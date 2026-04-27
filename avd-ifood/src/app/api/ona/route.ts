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
  const all = searchParams.get("all");
  const role = (session.user as any).role;

  if (all === "true" && role === "ADMIN") {
    const responses = await prisma.oNAResponse.findMany({
      where: cycleId ? { cycleId } : {},
      include: {
        respondent: { select: { id: true, name: true, department: true } },
        collaborator: { select: { id: true, name: true, department: true } },
      },
    });
    return Response.json(responses);
  }

  const myResponses = await prisma.oNAResponse.findMany({
    where: { respondentId: userId, ...(cycleId ? { cycleId } : {}) },
    include: {
      collaborator: { select: { id: true, name: true, department: true } },
    },
  });

  return Response.json(myResponses);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const body = await req.json();
  const { cycleId, responses } = body;

  for (const r of responses) {
    await prisma.oNAResponse.upsert({
      where: {
        cycleId_respondentId_collaboratorId: {
          cycleId,
          respondentId: userId,
          collaboratorId: r.collaboratorId,
        },
      },
      update: {
        frequency: r.frequency,
        influence: r.influence,
        types: JSON.stringify(r.types),
      },
      create: {
        cycleId,
        respondentId: userId,
        collaboratorId: r.collaboratorId,
        frequency: r.frequency,
        influence: r.influence,
        types: JSON.stringify(r.types),
      },
    });
  }

  return Response.json({ ok: true });
}
