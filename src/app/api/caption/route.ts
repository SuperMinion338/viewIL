import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { containsBlockedWords } from "@/lib/contentFilter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, tone } = await req.json();
    if (!topic) return NextResponse.json({ error: "חסר נושא" }, { status: 400 });
    if (containsBlockedWords(topic))
      return NextResponse.json({ error: "הטקסט מכיל מילים לא מתאימות." }, { status: 400 });

    const platformMap: Record<string, string> = {
      instagram: "Instagram — ארוך יותר, סיפורי, אמוציונלי",
      tiktok: "TikTok — קצר, דינמי, עם הרבה אמוג׳י",
      youtube: "YouTube — מתאר, ניתן לחיפוש, אינפורמטיבי",
    };
    const toneMap: Record<string, string> = {
      funny: "מצחיק ועם הומור עצמי",
      serious: "רציני וישיר",
      inspirational: "מעורר השראה ואמוציונלי",
    };

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an expert Israeli social media caption writer. Write captions the way top Israeli creators write — casual, real, with personality. Platform matters: Instagram = longer and storytelling, TikTok = short punchy and emoji-heavy, YouTube = searchable and descriptive. Always include relevant Israeli hashtags. Write ONLY in Hebrew. Sound human, not like AI.`,
        },
        {
          role: "user",
          content: `כתוב קפשן מלא לסרטון בנושא: "${topic}"
פלטפורמה: ${platformMap[platform] || platformMap.instagram}
טון: ${toneMap[tone] || toneMap.inspirational}

פורמט התשובה בדיוק כך:
פתיחה:
[שורת פתיחה מושכת]

גוף הקפשן:
[2-3 פסקאות, טבעי עם אמוג׳י]

האשטאגים ישראלים (10):
[10 האשטאגים]

האשטאגים נישה (10):
[10 האשטאגים]`,
        },
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || "";

    const hookMatch = text.match(/פתיחה[^:]*:([\s\S]*?)(?=גוף הקפשן|$)/i);
    const bodyMatch = text.match(/גוף הקפשן[^:]*:([\s\S]*?)(?=האשטאגים ישראלים|$)/i);
    const israeliTagsMatch = text.match(/האשטאגים ישראלים[^:]*:([\s\S]*?)(?=האשטאגים נישה|$)/i);
    const nicheTagsMatch = text.match(/האשטאגים נישה[^:]*:([\s\S]*?)$/i);

    const extractTags = (str: string) =>
      (str || "")
        .split(/\s+/)
        .filter((t) => t.startsWith("#"))
        .slice(0, 10);

    const hook = hookMatch?.[1]?.trim() || "";
    const body = bodyMatch?.[1]?.trim() || "";
    const israeliTags = extractTags(israeliTagsMatch?.[1] || "");
    const nicheTags = extractTags(nicheTagsMatch?.[1] || "");

    if (containsBlockedWords(hook + " " + body))
      return NextResponse.json({ error: "התוצאה לא עמדה בסטנדרטים. נסה שוב." }, { status: 400 });

    return NextResponse.json({ hook, body, israeliTags, nicheTags, full: text });
  } catch (error: unknown) {
    console.error("Caption API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429)
      return NextResponse.json({ error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב.", retryAfter: 30 }, { status: 429 });
    return NextResponse.json({ error: "שגיאה ביצירת הקפשן. נסה שוב." }, { status: 500 });
  }
}
