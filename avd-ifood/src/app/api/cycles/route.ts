import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const cycles = await prisma.evaluationCycle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(cycles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  if (role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, description, startDate, endDate } = body;

  const cycle = await prisma.evaluationCycle.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "ACTIVE",
    },
  });

  // Auto-create evaluations for all users
  const users = await prisma.user.findMany();

  const evaluationData: any[] = [];

  for (const user of users) {
    // Self evaluation
    evaluationData.push({
      cycleId: cycle.id,
      evaluatorId: user.id,
      evaluateeId: user.id,
      type: "SELF",
    });

    // Peer evaluations (up to 3 peers in same department)
    const peers = users.filter(
      (u: typeof users[0]) => u.id !== user.id && u.department === user.department
    ).slice(0, 3);

    for (const peer of peers) {
      evaluationData.push({
        cycleId: cycle.id,
        evaluatorId: user.id,
        evaluateeId: peer.id,
        type: "PEER",
      });
    }

    // Leader evaluation (evaluate manager)
    if (user.managerId) {
      evaluationData.push({
        cycleId: cycle.id,
        evaluatorId: user.id,
        evaluateeId: user.managerId,
        type: "LEADER",
      });
    }

    // Subordinate evaluations (if leader, evaluate reports)
    const reports = users.filter((u: typeof users[0]) => u.managerId === user.id);
    for (const report of reports) {
      evaluationData.push({
        cycleId: cycle.id,
        evaluatorId: user.id,
        evaluateeId: report.id,
        type: "SUBORDINATE",
      });
    }
  }

  // Deduplicate
  const seen = new Set<string>();
  const unique = evaluationData.filter((e) => {
    const key = `${e.evaluatorId}-${e.evaluateeId}-${e.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  await prisma.evaluation.createMany({ data: unique });

  return Response.json({ cycle, evaluationsCreated: unique.length });
}
