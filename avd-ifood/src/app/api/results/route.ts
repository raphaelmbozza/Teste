import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId") ?? (session.user as any).id;
  const cycleId = searchParams.get("cycleId");
  const role = (session.user as any).role;
  const selfId = (session.user as any).id;

  if (userId !== selfId && role !== "ADMIN" && role !== "LIDER") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const evaluations = await prisma.evaluation.findMany({
    where: {
      evaluateeId: userId,
      status: "COMPLETED",
      ...(cycleId ? { cycleId } : {}),
    },
    include: {
      responses: true,
      evaluator: { select: { id: true, name: true, role: true } },
    },
  });

  const grouped: Record<string, Record<string, { scores: number[]; justifications: string[] }>> = {};

  for (const ev of evaluations) {
    const type = ev.type;
    if (!grouped[type]) grouped[type] = {};
    for (const r of ev.responses) {
      const key = `${r.dimension}::${r.attribute}`;
      if (!grouped[type][key]) grouped[type][key] = { scores: [], justifications: [] };
      grouped[type][key].scores.push(r.score);
      if (r.justification) grouped[type][key].justifications.push(r.justification);
    }
  }

  const summary: any[] = [];
  for (const [type, attrs] of Object.entries(grouped)) {
    for (const [key, data] of Object.entries(attrs)) {
      const [dimension, attribute] = key.split("::");
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      summary.push({
        type,
        dimension,
        attribute,
        avg: Math.round(avg * 10) / 10,
        count: data.scores.length,
        scores: data.scores,
        justifications: data.justifications,
      });
    }
  }

  return Response.json({ summary, totalEvaluations: evaluations.length });
}
