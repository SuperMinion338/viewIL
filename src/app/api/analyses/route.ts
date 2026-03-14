import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const analyses = await prisma.performanceAnalysis.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    analyses: analyses.map((a) => ({
      id: a.id,
      title: a.title,
      platform: a.platform,
      views: a.views,
      likes: a.likes,
      comments: a.comments,
      shares: a.shares,
      saves: a.saves,
      reach: a.reach,
      groqAnalysis: a.groqAnalysis,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { title, platform, views, likes, comments, shares, saves, reach, groqAnalysis } =
    await req.json();

  if (!title) return NextResponse.json({ error: "חסר שם" }, { status: 400 });

  const record = await prisma.performanceAnalysis.create({
    data: {
      userId: Number(session.user.id),
      title,
      platform: platform || "instagram",
      views: Number(views) || 0,
      likes: Number(likes) || 0,
      comments: Number(comments) || 0,
      shares: Number(shares) || 0,
      saves: Number(saves) || 0,
      reach: Number(reach) || 0,
      groqAnalysis: groqAnalysis || "{}",
    },
  });

  return NextResponse.json({ id: record.id });
}
