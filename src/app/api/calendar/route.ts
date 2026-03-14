import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const events = await prisma.calendarEvent.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({
    events: events.map((e) => ({
      id: e.id,
      user_id: e.userId,
      date: e.date,
      title: e.title,
      platform: e.platform,
      notes: e.notes,
      color: e.color,
      created_at: e.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { date, title, platform, notes, color } = await req.json();
  if (!date || !title) return NextResponse.json({ error: "חסרים שדות" }, { status: 400 });

  const record = await prisma.calendarEvent.create({
    data: {
      userId: Number(session.user.id),
      date,
      title,
      platform: platform || "",
      notes: notes || "",
      color: color || "bg-blue-500",
    },
  });

  return NextResponse.json({ id: record.id });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { id } = await req.json();

  await prisma.calendarEvent.deleteMany({
    where: { id: Number(id), userId: Number(session.user.id) },
  });

  return NextResponse.json({ success: true });
}
