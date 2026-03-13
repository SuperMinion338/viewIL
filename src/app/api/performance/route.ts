import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { views, likes, comments, shares, saves, reach, platform } =
      await req.json();

    const engagementRate =
      reach > 0
        ? (((likes + comments + shares + saves) / reach) * 100).toFixed(2)
        : "0";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "אתה מנתח ביצועים לתוכן ברשתות חברתיות ישראליות. ענה בעברית מדוברת וברורה בלבד.",
        },
        {
          role: "user",
          content: `נתח את הנתונים הבאים ותן המלצות:

פלטפורמה: ${platform || "לא צוין"}
צפיות: ${views?.toLocaleString("he-IL") || 0}
לייקים: ${likes?.toLocaleString("he-IL") || 0}
תגובות: ${comments?.toLocaleString("he-IL") || 0}
שיתופים: ${shares?.toLocaleString("he-IL") || 0}
שמירות: ${saves?.toLocaleString("he-IL") || 0}
טווח הגעה: ${reach?.toLocaleString("he-IL") || 0}
אחוז מעורבות: ${engagementRate}%

ענה בפורמט הבא בדיוק:

ציון: [מספר בין 1-10]

מה עבד טוב:
- [נקודה 1]
- [נקודה 2]
- [נקודה 3]

מה לשפר:
- [נקודה 1]
- [נקודה 2]
- [נקודה 3]

נושא לסרטון הבא:
[הצעה ספציפית אחת לסרטון הבא בהתבסס על הביצועים]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || "";

    const scoreMatch = text.match(/ציון:\s*(\d+(?:\.\d+)?)/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 5;

    const workedMatch = text.match(/מה עבד טוב:([\s\S]*?)(?=מה לשפר|$)/i);
    const improveMatch = text.match(/מה לשפר:([\s\S]*?)(?=נושא לסרטון הבא|$)/i);
    const nextMatch = text.match(/נושא לסרטון הבא:([\s\S]*?)$/i);

    const parseList = (str: string) =>
      str
        ?.split("\n")
        .map((l) => l.replace(/^-\s*/, "").trim())
        .filter(Boolean) || [];

    return NextResponse.json({
      score,
      engagementRate,
      workedWell: parseList(workedMatch?.[1] || ""),
      improve: parseList(improveMatch?.[1] || ""),
      nextTopic: nextMatch?.[1]?.trim() || "",
    });
  } catch (error: unknown) {
    console.error("Performance API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429) {
      return NextResponse.json(
        { error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב.", retryAfter: 30 },
        { status: 429 }
      );
    }
    const message = (error as { message?: string })?.message || "";
    return NextResponse.json(
      { error: message || "שגיאה בניתוח הביצועים. נסה שוב." },
      { status: 500 }
    );
  }
}
