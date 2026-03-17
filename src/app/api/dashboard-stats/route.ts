import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const userId = Number(session.user.id);

  const [
    scriptsTotal, hooksTotal, analysesTotal,
    recentScripts, recentHooks, recentCalendar,
    recentAnalyses, recentProjects, recentIncome,
  ] = await Promise.all([
    prisma.savedScript.count({ where: { userId } }),
    prisma.savedHook.count({ where: { userId } }),
    prisma.performanceAnalysis.count({ where: { userId } }),
    prisma.savedScript.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, idea: true, createdAt: true },
    }),
    prisma.savedHook.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, topic: true, createdAt: true },
    }),
    prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.performanceAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.contentProject.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, createdAt: true },
    }),
    prisma.income.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, source: true, amount: true, createdAt: true },
    }),
  ]);

  // Calculate streak
  const allDates = await prisma.savedScript.findMany({
    where: { userId },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  let streak = 0;
  if (allDates.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = new Set(allDates.map((d) => d.createdAt.toISOString().split("T")[0]));
    const cursor = new Date(today);
    while (days.has(cursor.toISOString().split("T")[0])) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // Merge and sort recent activity
  const activity = [
    ...recentScripts.map((s) => ({ type: "script",      text: s.idea,                             createdAt: s.createdAt })),
    ...recentHooks.map((h) =>   ({ type: "hook",         text: h.topic,                            createdAt: h.createdAt })),
    ...recentCalendar.map((c) => ({ type: "calendar",    text: c.title,                            createdAt: c.createdAt })),
    ...recentAnalyses.map((a) => ({ type: "analysis",    text: a.title,                            createdAt: a.createdAt })),
    ...recentProjects.map((p) => ({ type: "project",     text: p.title,                            createdAt: p.createdAt })),
    ...recentIncome.map((i) =>   ({ type: "income",      text: `${i.source} — ₪${i.amount}`,      createdAt: i.createdAt })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10)
    .map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));

  return NextResponse.json({ scriptsTotal, hooksTotal, analysesTotal, streak, activity });
}
