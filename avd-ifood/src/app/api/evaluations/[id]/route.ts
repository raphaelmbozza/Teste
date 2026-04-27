import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    include: {
      evaluatee: { select: { id: true, name: true, department: true, jobTitle: true, isLeader: true } },
      evaluator: { select: { id: true, name: true } },
      cycle: true,
      responses: true,
    },
  });

  if (!evaluation) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(evaluation);
}
