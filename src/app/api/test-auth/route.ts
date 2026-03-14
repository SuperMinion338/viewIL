import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const steps: string[] = [];

  try {
    steps.push("1. Prisma client created");

    const users = await prisma.user.findMany({
      select: { id: true, email: true, createdAt: true },
    });

    steps.push(`2. DB query succeeded — found ${users.length} user(s)`);

    return NextResponse.json({
      ok: true,
      steps,
      userCount: users.length,
      users,
      env: {
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL ?? "(not set)",
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    steps.push(`ERROR: ${message}`);
    console.error("[test-auth] DB error:", err);

    return NextResponse.json(
      { ok: false, steps, error: message },
      { status: 500 }
    );
  }
}
