import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ scriptsThisMonth: 0 });

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const count = await prisma.savedScript.count({
    where: {
      userId: Number(session.user.id),
      createdAt: { gte: start },
    },
  });

  return NextResponse.json({ scriptsThisMonth: count });
}
