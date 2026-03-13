import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const db = getDB();
  const events = db
    .prepare("SELECT * FROM calendar_events WHERE user_id = ? ORDER BY date ASC")
    .all(session.user.id);

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { date, title, platform, notes, color } = await req.json();
  if (!date || !title) return NextResponse.json({ error: "חסרים שדות" }, { status: 400 });

  const db = getDB();
  const result = db
    .prepare(
      "INSERT INTO calendar_events (user_id, date, title, platform, notes, color) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(session.user.id, date, title, platform || "", notes || "", color || "bg-blue-500");

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { id } = await req.json();
  const db = getDB();
  db.prepare("DELETE FROM calendar_events WHERE id = ? AND user_id = ?").run(id, session.user.id);

  return NextResponse.json({ success: true });
}
