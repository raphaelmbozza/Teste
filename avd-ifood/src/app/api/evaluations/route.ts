import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = req.nextUrl;
  const cycleId = searchParams.get("cycleId");

  const where: any = { evaluatorId: userId };
  if (cycleId) where.cycleId = cycleId;

  const evaluations = await prisma.evaluation.findMany({
    where,
    include: {
      evaluatee: { select: { id: true, name: true, department: true, jobTitle: true, isLeader: true } },
      cycle: { select: { id: true, name: true, status: true } },
      responses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(evaluations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { evaluationId, responses } = body;

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
  });

  if (!evaluation) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.evaluationResponse.deleteMany({ where: { evaluationId } });

  await prisma.evaluationResponse.createMany({
    data: responses.map((r: any) => ({
      evaluationId,
      dimension: r.dimension,
      attribute: r.attribute,
      score: r.score,
      justification: r.justification ?? null,
    })),
  });

  await prisma.evaluation.update({
    where: { id: evaluationId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  return Response.json({ ok: true });
}
