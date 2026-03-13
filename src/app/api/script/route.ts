import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { idea, tone } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "חסר רעיון לסרטון" }, { status: 400 });
    }

    const toneMap: Record<string, string> = {
      funny: "מצחיק וקליל",
      serious: "רציני ומקצועי",
      inspirational: "מעורר השראה ומוטיבציוני",
      educational: "חינוכי ומלמד",
    };

    const toneText = toneMap[tone] || "טבעי ומדוברי";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "אתה עוזר ליוצרי תוכן ישראלים לכתוב סקריפטים לסרטונים קצרים. כתוב בעברית טבעית ומדוברת. חלק את הסקריפט לפתיחה, גוף וסיום.",
        },
        {
          role: "user",
          content: `הטון המבוקש: ${toneText}
רעיון לסרטון: ${idea}

כתוב סקריפט מלא בפורמט הבא בדיוק (השתמש בכותרות האלה):

פתיחה (הוק - 5 שניות ראשונות):
[כתוב כאן את הפתיחה המושכת]

גוף הסרטון:
[כתוב כאן את התוכן הראשי עם נקודות מפתח]

סיום (קריאה לפעולה):
[כתוב כאן את הסיום עם קריאה לפעולה]

חשוב: כתוב בשפה עברית טבעית ומדוברת בלבד. אל תכתוב בפורמל מדי.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";

    const hookMatch = text.match(/פתיחה[^:]*:([\s\S]*?)(?=גוף הסרטון|$)/i);
    const bodyMatch = text.match(/גוף הסרטון[^:]*:([\s\S]*?)(?=סיום|$)/i);
    const ctaMatch = text.match(/סיום[^:]*:([\s\S]*?)$/i);

    return NextResponse.json({
      hook: hookMatch?.[1]?.trim() || "",
      body: bodyMatch?.[1]?.trim() || "",
      cta: ctaMatch?.[1]?.trim() || "",
      full: text,
    });
  } catch (error: unknown) {
    console.error("Script API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429) {
      return NextResponse.json(
        { error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב.", retryAfter: 30 },
        { status: 429 }
      );
    }
    const message = (error as { message?: string })?.message || "";
    return NextResponse.json(
      { error: message || "שגיאה ביצירת הסקריפט. נסה שוב." },
      { status: 500 }
    );
  }
}
