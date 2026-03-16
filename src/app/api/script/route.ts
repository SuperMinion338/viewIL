import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { containsBlockedWords } from "@/lib/contentFilter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { idea, tone, length } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "חסר רעיון לסרטון" }, { status: 400 });
    }

    const lengthMap: Record<string, string> = {
      "60s": "60 שניות (כ-100 מילה בגוף)",
      "3min": "3 דקות (כ-350 מילה בגוף)",
      "10min": "10 דקות (כ-1,200 מילה בגוף)",
    };
    const lengthText = lengthMap[length] || "3 דקות (כ-350 מילה בגוף)";

    if (containsBlockedWords(idea)) {
      return NextResponse.json(
        { error: "הטקסט מכיל מילים לא מתאימות. אנא נסח מחדש." },
        { status: 400 }
      );
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
            `You are an expert Israeli content creator scriptwriter for short-form video (TikTok, Instagram Reels, YouTube Shorts).
Write scripts in natural, modern, conversational Hebrew — the way young Israelis actually talk in 2024/2025.
NO formal Hebrew. NO old-fashioned phrases. Sound like a real person talking to a camera, not reading an essay.

Script structure:
- HOOK (first 3-5 seconds): Must be shocking, curious, or relatable. Start with a bold statement, surprising fact, or question. NO "היי כולם" openings — that's outdated.
- BODY: Tell a real story or give real value. Use specific details, personal moments, humor where relevant. Write as if talking to one friend, not an audience. Include natural transitions. Make it feel REAL and unscripted even though it's scripted.
- CTA (last 5 seconds): One clear, casual action — not multiple asks. No "לייקו, שתפו, הרשמו" all at once — pick ONE.

Length: Write a FULL script. Minimum 300 words in the body. Make it detailed enough for a 3-5 minute video.
Tone options: מצחיק = add real humor and self-deprecation. רציני = raw and honest. השראתי = emotional story arc. חינוכי = clear steps with "wait I didn't know that" moments.
NEVER write generic filler sentences. Every sentence must add value or move the story forward.
Always write in Israeli slang where appropriate (אחי, בן אדם, ממש, וואלה, אין מצב, בטירוף, etc.)`,
        },
        {
          role: "user",
          content: `הטון המבוקש: ${toneText}
אורך הסרטון: ${lengthText}
רעיון לסרטון: ${idea}

כתוב סקריפט מלא בפורמט הבא בדיוק (השתמש בכותרות האלה):

פתיחה (הוק - 5 שניות ראשונות):
[כתוב כאן את הפתיחה המושכת — מקסימום 2-3 משפטים, חייב לעצור גלילה]

גוף הסרטון:
[כתוב כאן את התוכן הראשי — התאם את אורך הכתיבה לאורך הסרטון המבוקש. כתוב כאילו אתה מדבר לחבר אחד]

סיום (קריאה לפעולה):
[כתוב כאן קריאה אחת ברורה וקלילה בלבד]

חשוב: כתוב בעברית ישראלית מדוברת ועם סלנג טבעי.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2048,
    });

    const text = completion.choices[0]?.message?.content || "";

    const hookMatch = text.match(/פתיחה[^:]*:([\s\S]*?)(?=גוף הסרטון|$)/i);
    const bodyMatch = text.match(/גוף הסרטון[^:]*:([\s\S]*?)(?=סיום|$)/i);
    const ctaMatch = text.match(/סיום[^:]*:([\s\S]*?)$/i);

    if (containsBlockedWords(text)) {
      return NextResponse.json(
        { error: "התוצאה לא עמדה בסטנדרטים שלנו. נסה שוב." },
        { status: 400 }
      );
    }

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
