import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });

  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ error: "סוג קובץ לא נתמך. יש להעלות תמונה (JPG, PNG, WEBP)" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "הקובץ גדול מדי. גודל מקסימלי: 5MB" }, { status: 400 });
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `avatar_${session.user.id}_${Date.now()}.${ext}`;
  const avatarsDir = path.join(process.cwd(), "public", "avatars");

  if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(avatarsDir, filename), buffer);

  const avatarUrl = `/avatars/${filename}`;
  const db = getDB();
  db.prepare("UPDATE users SET avatar_url = ? WHERE id = ?").run(avatarUrl, Number(session.user.id));

  return NextResponse.json({ ok: true, avatar_url: avatarUrl });
}
