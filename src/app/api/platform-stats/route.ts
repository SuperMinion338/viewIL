import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [users, scripts, hooks] = await Promise.all([
    prisma.user.count(),
    prisma.savedScript.count(),
    prisma.savedHook.count(),
  ]);
  return NextResponse.json({ users, scripts, hooks });
}
