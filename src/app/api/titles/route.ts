import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { containsBlockedWords } from "@/lib/contentFilter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json();

    if (!script) {
      return NextResponse.json({ error: "חסר סקריפט" }, { status: 400 });
    }

    if (containsBlockedWords(script)) {
      return NextResponse.json(
        { error: "הטקסט מכיל מילים לא מתאימות. אנא נסח מחדש." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            `Generate 5 short viral video titles in modern Hebrew for the given script.
Each title max 8 words. Must be curious, bold, or emotional.
No clickbait that doesn't deliver. Sound like real Israeli creators write titles.
Use numbers where relevant (e.g. '5 דברים ש...' '24 שעות של...')`,
        },
        {
          role: "user",
          content: `צור 5 כותרות קצרות וויראליות לסרטון הבא.

הסקריפט:
${script.slice(0, 1500)}

פורמט התשובה — בדיוק כך:
כותרת 1: [כותרת]
כותרת 2: [כותרת]
כותרת 3: [כותרת]
כותרת 4: [כותרת]
כותרת 5: [כותרת]

כל כותרת — מקסימום 8 מילים, בעברית, מושכת ומעוררת סקרנות.`,
        },
      ],
      temperature: 0.85,
      max_tokens: 400,
    });

    const text = completion.choices[0]?.message?.content || "";

    const titles: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const match = text.match(new RegExp(`כותרת ${i}[^:]*:([^\n]+)`, "i"));
      if (match?.[1]?.trim()) titles.push(match[1].trim());
    }

    if (containsBlockedWords(titles.join(" "))) {
      return NextResponse.json(
        { error: "התוצאה לא עמדה בסטנדרטים שלנו. נסה שוב." },
        { status: 400 }
      );
    }

    return NextResponse.json({ titles });
  } catch (error: unknown) {
    console.error("Titles API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429) {
      return NextResponse.json(
        { error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב.", retryAfter: 30 },
        { status: 429 }
      );
    }
    const message = (error as { message?: string })?.message || "";
    return NextResponse.json(
      { error: message || "שגיאה ביצירת כותרות. נסה שוב." },
      { status: 500 }
    );
  }
}
