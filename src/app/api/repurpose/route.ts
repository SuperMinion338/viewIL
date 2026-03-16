import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FORMAT_PROMPTS: Record<string, string> = {
  tiktok: "סרטון TikTok קצר (60 שניות) — כתוב הוק + גוף + CTA בסגנון מדובר וקליל",
  instagram_reel: "Instagram Reel (30-60 שניות) — קצר, ויזואלי, עם קריאה להוסיף לשמור",
  instagram_post: "פוסט אינסטגרם — פסקה ראשונה שמאלצת לפתוח, 3-4 פסקאות, 3 שורות אחרונות CTA",
  linkedin: "פוסט לינקדאין מקצועי — פותח עם hook חזק, ערך אמיתי, מסתיים בשאלה פתוחה",
  twitter: "תגובת ת'רד טוויטר/X — 5 ציוצים של עד 280 תווים כל אחד, ממוספרים",
  youtube_shorts: "YouTube Shorts (60 שניות) — ישיר, ממוקד, עם חוק 3 שניות ראשונות",
  email: "ניוזלטר / אימייל שיווקי — כותרת, פתיחה אישית, גוף עם ערך, CTA אחד ברור",
  blog: "מאמר בלוג — כותרת SEO, מבוא מושך, 3-4 כותרות משנה עם תוכן, סיכום + CTA",
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "לא מחובר" }, { status: 401 });

  try {
    const { content, sourceFormat, targetFormats } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "נדרש תוכן לשינוי פורמט" }, { status: 400 });
    }
    if (!targetFormats || !Array.isArray(targetFormats) || targetFormats.length === 0) {
      return NextResponse.json({ error: "נדרש לבחור פורמט יעד אחד לפחות" }, { status: 400 });
    }

    // Generate all formats in parallel
    const results = await Promise.all(
      targetFormats.map(async (format: string) => {
        const formatDescription = FORMAT_PROMPTS[format] || format;
        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `אתה מומחה לשיווק תוכן ישראלי. תפקידך לקחת תוכן קיים ולשנות אותו לפורמט חדש — תוך שמירה על המסר המרכזי אבל עם אדaptציה מלאה לסגנון הפלטפורמה החדשה.
כתוב בעברית ישראלית מדוברת וטבעית. אל תתרגם מילולית — תשנה בחכמה.`,
            },
            {
              role: "user",
              content: `פורמט המקור: ${sourceFormat}
תוכן מקורי:
${content}

עכשיו שנה את התוכן הזה ל: ${formatDescription}

כתוב רק את התוכן החדש, ללא הסברים.`,
            },
          ],
          temperature: 0.75,
          max_tokens: 1024,
        });

        return {
          format,
          text: completion.choices[0]?.message?.content?.trim() || "",
        };
      })
    );

    return NextResponse.json({ results });
  } catch (error: unknown) {
    console.error("Repurpose API error:", error);
    const status = (error as { status?: number })?.status;
    if (status === 429) {
      return NextResponse.json({ error: "חרגת ממגבלת הבקשות. המתן רגע ונסה שוב." }, { status: 429 });
    }
    return NextResponse.json({ error: "שגיאה בשינוי הפורמט. נסה שוב." }, { status: 500 });
  }
}
