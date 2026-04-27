import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const DEPARTMENTS = ["Produto", "Engenharia", "Dados", "Design", "Marketing", "Operações", "RH", "Financeiro"];

const JOBS = {
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
  "Zara Monteiro", "Adriana Figueiredo", "Bernardo Teixeira", "Claudia Ramos", "Diego Correia",
  "Eduarda Freitas", "Felipe Cunha", "Giovanna Pacheco", "Humberto Lopes", "Ingrid Vieira",
  "Jorge Campos", "Kelly Rocha", "Leandro Sousa", "Manuela Borges", "Nathan Araújo",
  "Odete Cavalcanti", "Pedro Queiroz", "Quezia Sampaio", "Roberto Melo", "Simone Magalhães",
  "Tatiane Brito", "Ulisses Medeiros", "Vanessa Guimarães", "Wellington Peixoto", "Ximena Duarte",
];

export async function POST() {
  const existing = await prisma.user.count();
  if (existing > 0) {
    return Response.json({ message: "Database already seeded", count: existing });
  }

  const password = await bcrypt.hash("ifood123", 10);

  // Create admin
  await prisma.user.create({
    data: {
      name: "Admin RH",
      email: "admin@ifood.com.br",
      password,
      role: "ADMIN",
      department: "RH",
      jobTitle: "HR Business Partner",
      isLeader: true,
    },
  });

  // Create leaders per department
  const leaderIds: Record<string, string> = {};
  for (const dept of DEPARTMENTS) {
    const leader = await prisma.user.create({
      data: {
        name: `Líder ${dept}`,
        email: `lider.${dept.toLowerCase().replace(/ç/g, "c").replace(/õ/g, "o").replace(/ê/g, "e")}@ifood.com.br`,
        password,
        role: "LIDER",
        department: dept,
        jobTitle: (JOBS[dept as keyof typeof JOBS] ?? ["Manager"])[1],
        isLeader: true,
      },
    });
    leaderIds[dept] = leader.id;
  }

  // Create ~190 colaboradores
  const usedNames = new Set<string>();
  let created = 0;
  let nameIdx = 0;

  for (const dept of DEPARTMENTS) {
    const count = Math.floor(190 / DEPARTMENTS.length);
    const jobs = JOBS[dept as keyof typeof JOBS] ?? ["Analyst"];

    for (let i = 0; i < count && created < 190; i++) {
      let name = NAMES[nameIdx % NAMES.length];
      if (usedNames.has(name)) name = `${name} ${i + 1}`;
      usedNames.add(name);
      nameIdx++;

      const emailBase = name
        .toLowerCase()
        .replace(/\s+/g, ".")
        .replace(/[áàâã]/g, "a")
        .replace(/[éê]/g, "e")
        .replace(/[íî]/g, "i")
        .replace(/[óôõ]/g, "o")
        .replace(/[úû]/g, "u")
        .replace(/ç/g, "c");

      await prisma.user.create({
        data: {
          name,
          email: `${emailBase}.${created}@ifood.com.br`,
          password,
          role: "COLABORADOR",
          department: dept,
          jobTitle: jobs[i % jobs.length],
          isLeader: false,
          managerId: leaderIds[dept],
        },
      });
      created++;
    }
  }

  const total = await prisma.user.count();
  return Response.json({ message: "Seeded successfully", total });
}
