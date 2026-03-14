import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "תנאי שימוש — ViewIL",
};

export default function TermsOfServicePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-transparent.png" alt="ViewIL" width={32} height={32} />
            <span className="text-xl font-extrabold text-blue-600">ViewIL</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לדף הבית
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12 flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">תנאי שימוש</h1>
            <p className="text-sm text-gray-400">עדכון אחרון: ינואר 2026</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            ברוכים הבאים ל-ViewIL. השימוש בפלטפורמה מהווה הסכמה לתנאים המפורטים להלן. אנא קראו אותם
            בעיון לפני השימוש בשירות.
          </p>

          <Section title="1. שימוש בשירות">
            <p>
              ViewIL הינה פלטפורמת SaaS המספקת כלים מבוססי בינה מלאכותית ליוצרי תוכן ישראלים. השימוש
              בשירות מיועד למטרות חוקיות בלבד.
            </p>
            <p>
              אינך רשאי להשתמש בשירות כדי ליצור תוכן הפוגע בזכויות צד שלישי, תוכן פוגעני, מטעה, או
              כל תוכן האסור על פי חוק ישראלי.
            </p>
            <p>
              ViewIL שומרת לעצמה את הזכות להגביל, להשעות או לסגור חשבונות שמפרים את תנאי השימוש, על פי
              שיקול דעתה הבלעדי.
            </p>
            <p>
              הגישה לשירות מוגבלת למשתמשים בני 13 ומעלה. משתמשים מתחת לגיל 18 מחויבים בקבלת אישור
              הורה/אפוטרופוס.
            </p>
          </Section>

          <Section title="2. קניין רוחני">
            <p>
              כל הטכנולוגיה, העיצוב, הקוד, השמות המסחריים והלוגואים של ViewIL הם רכוש ViewIL ומוגנים
              בזכויות יוצרים ובחוקי קניין רוחני.
            </p>
            <p>
              התוכן שנוצר על ידך בעזרת הכלים של ViewIL (סקריפטים, פתיחות, ניתוחים) שייך לך. ViewIL
              אינה טוענת לבעלות על התוצרים שיצרת.
            </p>
            <p>
              אינך רשאי להעתיק, לשכפל, לפרסם מחדש, להפיץ, לשנות או ליצור עבודות נגזרות מהתוכנה,
              ממסד הנתונים, או מממשק המשתמש של ViewIL.
            </p>
          </Section>

          <Section title="3. הגבלת אחריות">
            <p>
              ViewIL מסופקת &quot;כפי שהיא&quot; (AS IS) ללא אחריות מכל סוג שהוא, מפורשת או משתמעת.
            </p>
            <p>
              ViewIL לא תישא באחריות לכל נזק ישיר, עקיף, מקרי, מיוחד או תוצאתי הנובע משימוש בשירות
              או מאי-יכולת להשתמש בו.
            </p>
            <p>
              התוצרים שמייצרת הבינה המלאכותית הם הצעות בלבד. אחריות לתוכן שמפורסם ברשתות החברתיות
              מוטלת על המשתמש בלבד.
            </p>
            <p>
              ViewIL אינה מתחייבת לזמינות שירות רצופה או ללא הפרעות, ושומרת לעצמה את הזכות לבצע
              תחזוקה ועדכונים בכל עת.
            </p>
          </Section>

          <Section title="4. ביטול חשבון">
            <p>
              תוכל לבטל את חשבונך בכל עת דרך הגדרות הפרופיל. עם הביטול, הנתונים שלך יימחקו מהמערכת
              תוך 30 יום.
            </p>
            <p>
              ViewIL שומרת לעצמה את הזכות לסיים את השירות לחשבון כלשהו מכל סיבה שהיא, עם הודעה
              מוקדמת של 7 ימים (אלא אם מדובר בהפרה חמורה).
            </p>
            <p>
              לאחר ביטול החשבון, לא תוכל לגשת לתוכן השמור, לסקריפטים או לנתוני ההכנסות שנשמרו
              בחשבון.
            </p>
          </Section>

          <Section title="5. שינויים בתנאים">
            <p>
              ViewIL רשאית לשנות את תנאי השימוש מעת לעת. שינויים מהותיים יימסרו למשתמשים בהודעה
              בדוא&quot;ל או בהתראה בפלטפורמה.
            </p>
            <p>
              המשך השימוש בשירות לאחר פרסום תנאים מעודכנים מהווה הסכמה לתנאים החדשים.
            </p>
            <p>
              הגרסה הנוכחית של תנאי השימוש תמיד תהיה זמינה בכתובת{" "}
              <span className="text-blue-600">view-il.vercel.app/tos</span>.
            </p>
          </Section>

          <div className="pt-4 border-t border-gray-100 text-sm text-gray-400">
            לשאלות בנוגע לתנאי השימוש, אנא צרו קשר:{" "}
            <a href="mailto:support@viewil.co.il" className="text-blue-600 hover:underline">
              support@viewil.co.il
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold text-gray-800 border-r-4 border-blue-600 pr-3">
        {title}
      </h2>
      <div className="flex flex-col gap-2 text-gray-600 leading-relaxed text-sm">
        {children}
      </div>
    </section>
  );
}
