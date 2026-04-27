import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const DEPARTMENTS = ["Produto", "Engenharia", "Dados", "Design", "Marketing", "Operações", "RH", "Financeiro"];

const JOBS: Record<string, string[]> = {
  "Produto": ["Product Manager", "Product Owner", "Associate PM"],
  "Engenharia": ["Software Engineer", "Senior Engineer", "Tech Lead"],
  "Dados": ["Data Scientist", "Data Analyst", "ML Engineer"],
  "Design": ["UX Designer", "UI Designer", "Product Designer"],
  "Marketing": ["Marketing Analyst", "Growth Manager", "Brand Manager"],
  "Operações": ["Operations Analyst", "Operations Manager", "Logistics Coordinator"],
  "RH": ["HR Business Partner", "Talent Acquisition", "People Analyst"],
  "Financeiro": ["Financial Analyst", "Controller", "FP&A Analyst"],
};

const NAMES = [
  "Ana Silva", "Bruno Santos", "Carla Oliveira", "Daniel Costa", "Elena Ferreira",
  "Fabio Rodrigues", "Gabriela Lima", "Henrique Alves", "Isabela Martins", "João Pereira",
  "Kamila Souza", "Lucas Barbosa", "Mariana Carvalho", "Nicolas Mendes", "Olivia Castro",
  "Paulo Ribeiro", "Quintina Nunes", "Rafael Gomes", "Sara Pinto", "Thiago Moura",
  "Ursula Dias", "Victor Azevedo", "Wanda Cardoso", "Xavier Nascimento", "Yasmin Torres",
];

async function main() {
  const existing = await prisma.user.count();
  if (existing > 0) {
    console.log(`Already seeded: ${existing} users`);
    return;
  }

  const password = await bcrypt.hash("ifood123", 10);

  await prisma.user.create({
    data: { name: "Admin RH", email: "admin@ifood.com.br", password, role: "ADMIN", department: "RH", jobTitle: "HR Business Partner", isLeader: true },
  });

  const leaderIds: Record<string, string> = {};
  for (const dept of DEPARTMENTS) {
    const leader = await prisma.user.create({
      data: {
        name: `Líder ${dept}`,
        email: `lider.${dept.toLowerCase().normalize("NFD").replace(/\p{Mn}/gu, "").replace(/\s/g, "")}@ifood.com.br`,
        password, role: "LIDER", department: dept, jobTitle: JOBS[dept][1], isLeader: true,
      },
    });
    leaderIds[dept] = leader.id;
  }

  let created = 0;
  let nameIdx = 0;
  for (const dept of DEPARTMENTS) {
    const count = 23;
    for (let i = 0; i < count; i++) {
      const name = `${NAMES[nameIdx % NAMES.length]} ${Math.floor(nameIdx / NAMES.length) > 0 ? Math.floor(nameIdx / NAMES.length) : ""}`.trim();
      nameIdx++;
      const emailBase = name.toLowerCase().normalize("NFD").replace(/\p{Mn}/gu, "").replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
      await prisma.user.create({
        data: {
          name, email: `${emailBase}.${created}@ifood.com.br`, password, role: "COLABORADOR",
          department: dept, jobTitle: JOBS[dept][i % JOBS[dept].length], isLeader: false, managerId: leaderIds[dept],
        },
      });
      created++;
    }
  }

  console.log(`Seeded ${await prisma.user.count()} users`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
