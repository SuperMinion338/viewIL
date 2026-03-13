import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const db = getDB();
  const user = db
    .prepare("SELECT id, name, email, avatar_url, instagram_url, tiktok_url, plan, scripts_this_month, scripts_month_key FROM users WHERE id = ?")
    .get(Number(session.user.id)) as {
      id: number; name: string; email: string;
      avatar_url: string | null; instagram_url: string | null; tiktok_url: string | null;
      plan: string; scripts_this_month: number; scripts_month_key: string | null;
    } | undefined;

  if (!user) return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });

  // Reset monthly counter if month changed
  const thisMonthKey = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const scriptsThisMonth = user.scripts_month_key === thisMonthKey ? user.scripts_this_month : 0;

  return NextResponse.json({ ...user, scripts_this_month: scriptsThisMonth, plan: user.plan || "free" });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { name, instagram_url, tiktok_url } = await req.json();

  if (name !== undefined && (!name || !name.trim())) {
    return NextResponse.json({ error: "שם לא יכול להיות ריק" }, { status: 400 });
  }

  const db = getDB();
  const updates: string[] = [];
  const values: unknown[] = [];

  if (name !== undefined) { updates.push("name = ?"); values.push(name.trim()); }
  if (instagram_url !== undefined) { updates.push("instagram_url = ?"); values.push(instagram_url || null); }
  if (tiktok_url !== undefined) { updates.push("tiktok_url = ?"); values.push(tiktok_url || null); }

  if (updates.length === 0) return NextResponse.json({ ok: true });

  values.push(Number(session.user.id));
  db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  return NextResponse.json({ ok: true });
}
