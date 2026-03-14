import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const { currentPassword, newPassword, confirmPassword } = await req.json();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json({ error: "יש למלא את כל השדות" }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "הסיסמה החדשה חייבת להכיל לפחות 6 תווים" }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "הסיסמאות אינן תואמות" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: { password: true },
  });

  if (!user) return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return NextResponse.json({ error: "הסיסמה הנוכחית שגויה" }, { status: 400 });

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: { password: newHash },
  });

  return NextResponse.json({ ok: true });
}
