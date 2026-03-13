import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  const db = getDB();
  const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  return NextResponse.json({ count: row.count });
}
