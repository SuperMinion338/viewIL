import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });

  // Ensure the analysis belongs to this user
  const record = await prisma.performanceAnalysis.findFirst({
    where: { id, userId: Number(session.user.id) },
  });

  if (!record) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });

  await prisma.performanceAnalysis.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
