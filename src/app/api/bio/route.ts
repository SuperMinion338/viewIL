import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { containsBlockedWords } from "@/lib/contentFilter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { niche, audience, tone, keywords } = await req.json();
    if (!niche) return NextResponse.json({ error: "חסר נישה" }, { status: 400 });
    if (containsBlockedWords(niche + " " + (keywords || "")))
      return NextResponse.json({ error: "הטקסט מכיל מילים לא מתאימות." }, { status: 400 });

    const toneMap: Record<string, string> = {
      funny: "מצחיק עם הומור עצמי",
      professional: "מקצועי ואמין",
      inspirational: "מעורר השראה",
    };

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Write 6 social media bios in Hebrew for an Israeli content creator. 3 for Instagram (max 150 chars each) and 3 for TikTok (max 80 chars each). Make them punchy, memorable, with personality. Include 1-2 relevant emojis. Sound like real Israeli creators, not corporate. Return ONLY JSON: {"instagram": ["bio1", "bio2", "bio3"], "tiktok": ["bio1", "bio2", "bio3"]}`,
        },
        {
          role: "user",
          content: `נישה: ${niche}
קהל יעד: ${audience || "כללי"}
טון: ${toneMap[tone] || toneMap.professional}
מילות מפתח: ${keywords || ""}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const jsonStr = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(jsonStr);

    const allBios = [...(result.instagram || []), ...(result.tiktok || [])].join(" ");
    if (containsBlockedWords(allBios))
      return NextResponse.json({ error: "התוצאה לא עמדה בסטנדרטים. נסה שוב." }, { status: 400 });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Bio API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429)
      return NextResponse.json({ error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב.", retryAfter: 30 }, { status: 429 });
    return NextResponse.json({ error: "שגיאה ביצירת הביו. נסה שוב." }, { status: 500 });
  }
}
