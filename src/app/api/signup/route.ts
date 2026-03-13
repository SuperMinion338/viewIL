import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "כל השדות הם חובה" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "הסיסמה חייבת להכיל לפחות 6 תווים" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 });
    }

    const db = getDB();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
    if (existing) {
      return NextResponse.json(
        { error: "כתובת האימייל כבר רשומה במערכת" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 12);
    db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run(
      name.trim(),
      email.toLowerCase(),
      hash
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "שגיאה בהרשמה. נסה שוב." }, { status: 500 });
  }
}
