import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
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

  const db = getDB();
  const user = db
    .prepare("SELECT password_hash FROM users WHERE id = ?")
    .get(Number(session.user.id)) as { password_hash: string } | undefined;

  if (!user) return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return NextResponse.json({ error: "הסיסמה הנוכחית שגויה" }, { status: 400 });

  const newHash = await bcrypt.hash(newPassword, 12);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, Number(session.user.id));

  return NextResponse.json({ ok: true });
}
