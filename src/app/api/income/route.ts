import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const rows = await prisma.income.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      user_id: r.userId,
      type: r.type,
      source: r.source,
      amount: r.amount,
      platform: r.platform,
      date: r.date,
      notes: r.notes,
      created_at: r.createdAt.toISOString(),
    }))
  );
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

  const record = await prisma.income.create({
    data: {
      userId: Number(session.user.id),
      type,
      source: source.trim(),
      amount: Number(amount),
      platform,
      date,
      notes: notes?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true, id: record.id });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  await prisma.income.deleteMany({
    where: { id: Number(id), userId: Number(session.user.id) },
  });

  return NextResponse.json({ ok: true });
}
