import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const db = getDB();
  const scripts = db
    .prepare("SELECT * FROM scripts WHERE user_id = ? ORDER BY created_at DESC LIMIT 50")
    .all(session.user.id);

  return NextResponse.json({ scripts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { idea, tone, hook, body, cta } = await req.json();
  if (!idea) return NextResponse.json({ error: "חסר רעיון" }, { status: 400 });

  const db = getDB();
  const result = db
    .prepare("INSERT INTO scripts (user_id, idea, tone, hook, body, cta) VALUES (?, ?, ?, ?, ?, ?)")
    .run(session.user.id, idea, tone || "", hook || "", body || "", cta || "");

  return NextResponse.json({ id: result.lastInsertRowid });
}
