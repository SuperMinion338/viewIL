import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const scripts = await prisma.savedScript.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    scripts: scripts.map((s) => ({
      id: s.id,
      user_id: s.userId,
      idea: s.idea,
      tone: s.tone,
      hook: s.hook,
      body: s.body,
      cta: s.cta,
      created_at: s.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { idea, tone, hook, body, cta } = await req.json();
  if (!idea) return NextResponse.json({ error: "חסר רעיון" }, { status: 400 });

  const record = await prisma.savedScript.create({
    data: {
      userId: Number(session.user.id),
      idea,
      tone: tone || "",
      hook: hook || "",
      body: body || "",
      cta: cta || "",
    },
  });

  return NextResponse.json({ id: record.id });
}
