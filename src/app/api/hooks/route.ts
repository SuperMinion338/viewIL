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
          content:
            `You are an expert at writing viral hooks for Israeli short-form video content.
Generate 5 hooks in natural modern Hebrew — the way young Israelis actually talk.
NO formal Hebrew. NO "היי כולם". Sound real, raw, and attention-grabbing.

Each hook must be a different TYPE:
1. עובדה מטורפת — shocking stat or fact that stops the scroll
2. שאלה מסקרנת — a question that makes them NEED to know the answer
3. סיפור אישי — starts mid-story, feels like you're already in the action
4. קונטרה — says the opposite of what people expect
5. הבטחה — promises a specific result or transformation

Rules:
- Maximum 2 sentences per hook
- Must feel like something a real Israeli creator would say in 2025
- Use Israeli slang naturally (וואלה, אחי, בטח, אין מצב, ממש)
- Each hook should create immediate curiosity or emotional reaction
- NO generic hooks like "היום אני הולך לספר לכם על..."`,
        },
        {
          role: "user",
          content: `צור 5 פתיחות מנצחות לסרטון בנושא: "${topic}"

הפלטפורמה: ${platformText}

צור בדיוק 5 פתיחות, אחת לכל סגנון, בפורמט הבא:

סגנון 1 - עובדה מטורפת:
[פתיחה]

סגנון 2 - שאלה מסקרנת:
[פתיחה]

סגנון 3 - סיפור אישי:
[פתיחה]

סגנון 4 - קונטרה:
[פתיחה]

סגנון 5 - הבטחה:
[פתיחה]

כל פתיחה — מקסימום 2 משפטים בעברית ישראלית מדוברת ואמיתית. ללא הסברים, רק הפתיחות עצמן.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || "";

    const styles = [
      { key: "עובדה מטורפת", label: "עובדה מטורפת", icon: "🤯" },
      { key: "שאלה מסקרנת", label: "שאלה מסקרנת", icon: "❓" },
      { key: "סיפור אישי", label: "סיפור אישי", icon: "📖" },
      { key: "קונטרה", label: "קונטרה", icon: "⚡" },
      { key: "הבטחה", label: "הבטחה", icon: "🎯" },
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
