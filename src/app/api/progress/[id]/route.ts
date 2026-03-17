import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  const userId = Number(session.user.id);
  const id = Number(params.id);

  const existing = await prisma.contentProject.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.contentProject.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.platform !== undefined && { platform: body.platform }),
      ...(body.stage !== undefined && { stage: body.stage }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.checklist !== undefined && { checklist: body.checklist }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  const userId = Number(session.user.id);
  const id = Number(params.id);

  const existing = await prisma.contentProject.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "לא נמצא" }, { status: 404 });

  await prisma.contentProject.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
