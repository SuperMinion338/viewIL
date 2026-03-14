import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const steps: string[] = [];

  try {
    const body = await req.json();
    const { email, password } = body;

    steps.push(`1. Received email="${email}", password length=${password?.length ?? 0}`);

    if (!email || !password) {
      steps.push("ERROR: missing email or password");
      return NextResponse.json({ ok: false, steps, error: "missing fields" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    steps.push(`2. Normalized email="${normalizedEmail}"`);

    // DB lookup
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true, password: true, name: true, plan: true },
      });
      steps.push(`3. DB lookup done — user ${user ? `FOUND (id=${user.id})` : "NOT FOUND"}`);
    } catch (dbErr) {
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      steps.push(`3. DB lookup THREW: ${msg}`);
      console.error("[test-login] DB error:", dbErr);
      return NextResponse.json({ ok: false, steps, error: msg }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ ok: false, steps, result: "user_not_found" });
    }

    // Password check
    steps.push(`4. Hash from DB prefix="${user.password.slice(0, 7)}", length=${user.password.length}`);

    let valid = false;
    try {
      valid = await bcrypt.compare(password, user.password);
      steps.push(`5. bcrypt.compare result=${valid}`);
    } catch (bcryptErr) {
      const msg = bcryptErr instanceof Error ? bcryptErr.message : String(bcryptErr);
      steps.push(`5. bcrypt.compare THREW: ${msg}`);
      console.error("[test-login] bcrypt error:", bcryptErr);
      return NextResponse.json({ ok: false, steps, error: msg }, { status: 500 });
    }

    if (!valid) {
      return NextResponse.json({ ok: false, steps, result: "wrong_password" });
    }

    steps.push("6. SUCCESS — credentials are valid");
    return NextResponse.json({
      ok: true,
      steps,
      result: "success",
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    steps.push(`UNEXPECTED ERROR: ${message}`);
    console.error("[test-login] unexpected error:", err);
    return NextResponse.json({ ok: false, steps, error: message }, { status: 500 });
  }
}
