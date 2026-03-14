import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      instagramUrl: true,
      tiktokUrl: true,
      plan: true,
      scriptsThisMonth: true,
      scriptsMonthKey: true,
    },
  });

  if (!user) return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });

  // Reset monthly counter if month changed
  const thisMonthKey = new Date().toISOString().slice(0, 7);
  const scriptsThisMonth = user.scriptsMonthKey === thisMonthKey ? user.scriptsThisMonth : 0;

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar_url: user.avatarUrl,
    instagram_url: user.instagramUrl,
    tiktok_url: user.tiktokUrl,
    plan: user.plan || "free",
    scripts_this_month: scriptsThisMonth,
    scripts_month_key: user.scriptsMonthKey,
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { name, instagram_url, tiktok_url } = await req.json();

  if (name !== undefined && (!name || !name.trim())) {
    return NextResponse.json({ error: "שם לא יכול להיות ריק" }, { status: 400 });
  }

  const data: Record<string, string | null> = {};
  if (name !== undefined) data.name = name.trim();
  if (instagram_url !== undefined) data.instagramUrl = instagram_url || null;
  if (tiktok_url !== undefined) data.tiktokUrl = tiktok_url || null;

  if (Object.keys(data).length === 0) return NextResponse.json({ ok: true });

  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data,
  });

  return NextResponse.json({ ok: true });
}
