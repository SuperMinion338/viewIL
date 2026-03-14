import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { containsBlockedWords } from "@/lib/contentFilter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topic, platform } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "חסר נושא לסרטון" }, { status: 400 });
    }

    if (containsBlockedWords(topic)) {
      return NextResponse.json(
        { error: "הטקסט מכיל מילים לא מתאימות. אנא נסח מחדש." },
        { status: 400 }
      );
    }

    const platformMap: Record<string, string> = {
      tiktok: "TikTok (קצר, דינמי, לגיל 16-25)",
      instagram: "אינסטגרם (ויזואלי, השראתי, לגיל 20-35)",
      youtube: "יוטיוב (מעמיק יותר, אינפורמטיבי)",
    };

    const platformText = platformMap[platform] || "TikTok";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "אתה מומחה לתוכן ברשתות חברתיות ישראליות. כתוב בעברית מדוברת ומושכת בלבד.",
        },
        {
          role: "user",
          content: `צור 5 פתיחות מנצחות לסרטון בנושא: "${topic}"

הפלטפורמה: ${platformText}

צור בדיוק 5 פתיחות, אחת לכל סגנון, בפורמט הבא:

סגנון 1 - שאלה מסקרנת:
[פתיחה]

סגנון 2 - עובדה מפתיעה:
[פתיחה]

סגנון 3 - הבטחה:
[פתיחה]

סגנון 4 - סיפור אישי:
[פתיחה]

סגנון 5 - שוק/פרובוקציה:
[פתיחה]

כל פתיחה צריכה להיות 1-2 משפטים בעברית מדוברת ומושכת. אל תכלול הסברים, רק את הפתיחות עצמן.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || "";

    const styles = [
      { key: "שאלה מסקרנת", label: "שאלה מסקרנת", icon: "❓" },
      { key: "עובדה מפתיעה", label: "עובדה מפתיעה", icon: "🤯" },
      { key: "הבטחה", label: "הבטחה", icon: "🎯" },
      { key: "סיפור אישי", label: "סיפור אישי", icon: "📖" },
      { key: "שוק", label: "שוק/פרובוקציה", icon: "⚡" },
    ];

    const hooks = styles.map((style) => {
      const regex = new RegExp(
        `סגנון \\d+ - ${style.key}[^:]*:([\\s\\S]*?)(?=סגנון \\d+|$)`,
        "i"
      );
      const match = text.match(regex);
      return {
        style: style.label,
        icon: style.icon,
        text: match?.[1]?.trim() || "",
      };
    });

    const allHookText = hooks.map((h) => h.text).join(" ");
    if (containsBlockedWords(allHookText)) {
      return NextResponse.json(
        { error: "התוצאה לא עמדה בסטנדרטים שלנו. נסה שוב." },
        { status: 400 }
      );
    }

    return NextResponse.json({ hooks });
  } catch (error: unknown) {
    console.error("Hooks API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429) {
      return NextResponse.json(
        { error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב.", retryAfter: 30 },
        { status: 429 }
      );
    }
    const message = (error as { message?: string })?.message || "";
    return NextResponse.json(
      { error: message || "שגיאה ביצירת הפתיחות. נסה שוב." },
      { status: 500 }
    );
  }
}
