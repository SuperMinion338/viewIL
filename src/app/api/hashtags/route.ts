import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script } = await req.json();
    if (!script) return NextResponse.json({ error: "חסר תוכן סקריפט" }, { status: 400 });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "אתה מומחה לשיווק ברשתות חברתיות ישראליות. צור האשטאגים רלוונטיים בעברית ובאנגלית לתוכן נתון.",
        },
        {
          role: "user",
          content: `בהתבסס על הסקריפט הבא, צור בדיוק 20 האשטאגים רלוונטיים לשוק הישראלי.

סקריפט:
${script}

החזר JSON בדיוק בפורמט הזה (בלי שום טקסט נוסף):
{
  "large": ["#האשטאג1", "#האשטאג2", "#האשטאג3", "#האשטאג4", "#האשטאג5", "#האשטאג6"],
  "medium": ["#האשטאג7", "#האשטאג8", "#האשטאג9", "#האשטאג10", "#האשטאג11", "#האשטאג12", "#האשטאג13"],
  "small": ["#האשטאג14", "#האשטאג15", "#האשטאג16", "#האשטאג17", "#האשטאג18", "#האשטאג19", "#האשטאג20"]
}

large = האשטאגים גדולים (מעל מיליון פוסטים) - כלליים ופופולריים
medium = האשטאגים בינוניים (100K-1M פוסטים) - קצת יותר ספציפיים
small = האשטאגים קטנים (פחות מ-100K פוסטים) - נישה ספציפית וממוקדת

כלל האשטאגים להיות בעברית או ענף שמשתמשים בו ישראלים. ללא רווחים בתוך האשטאג.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response format");

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      large: parsed.large || [],
      medium: parsed.medium || [],
      small: parsed.small || [],
    });
  } catch (error: unknown) {
    console.error("Hashtags API error:", error);
    return NextResponse.json({ error: "שגיאה ביצירת האשטאגים" }, { status: 500 });
  }
}
