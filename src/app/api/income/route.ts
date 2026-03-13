import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";

interface IncomeRow {
  id: number;
  user_id: number;
  type: string;
  source: string;
  amount: number;
  platform: string;
  date: string;
  notes: string | null;
  created_at: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const db = getDB();
  const rows = db
    .prepare("SELECT * FROM income WHERE user_id = ? ORDER BY date DESC, created_at DESC")
    .all(Number(session.user.id)) as IncomeRow[];

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { type, source, amount, platform, date, notes } = await req.json();

  if (!type || !source || !amount || !platform || !date) {
    return NextResponse.json({ error: "יש למלא את כל השדות החובה" }, { status: 400 });
  }
  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: "סכום לא תקין" }, { status: 400 });
  }

  const db = getDB();
  const result = db
    .prepare(
      "INSERT INTO income (user_id, type, source, amount, platform, date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .run(Number(session.user.id), type, source.trim(), Number(amount), platform, date, notes?.trim() || null);

  return NextResponse.json({ ok: true, id: result.lastInsertRowid });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  const db = getDB();
  db.prepare("DELETE FROM income WHERE id = ? AND user_id = ?").run(Number(id), Number(session.user.id));
  return NextResponse.json({ ok: true });
}
