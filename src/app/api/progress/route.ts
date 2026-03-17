import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  const userId = Number(session.user.id);

  const projects = await prisma.contentProject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  const userId = Number(session.user.id);

  const { title, platform, stage, priority, dueDate, notes } = await req.json();
  if (!title?.trim() || !platform) {
    return NextResponse.json({ error: "נדרש כותרת ופלטפורמה" }, { status: 400 });
  }

  const project = await prisma.contentProject.create({
    data: {
      userId,
      title: title.trim(),
      platform,
      stage: stage || "idea",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      notes: notes || null,
      checklist: undefined,
    },
  });

  return NextResponse.json(project);
}
