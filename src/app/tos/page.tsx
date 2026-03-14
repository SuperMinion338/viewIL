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
            <p className="text-sm text-gray-400">עדכון אחרון: מרץ 2026</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            ברוכים הבאים ל-ViewIL. השימוש בפלטפורמה מהווה הסכמה מלאה לתנאים המפורטים להלן. אנא קראו
            אותם בעיון לפני השימוש בשירות. תנאים אלה מנוסחים בהתאם לדין הישראלי.
          </p>

          <Section title="1. הגדרות">
            <p><strong className="text-gray-700">&quot;השירות&quot;</strong> — פלטפורמת ViewIL, לרבות האתר, הכלים, ממשקי ה-API וכל תכונה המוצעת על ידה.</p>
            <p><strong className="text-gray-700">&quot;המשתמש&quot;</strong> — כל אדם הנרשם לשירות או גולש בו, לרבות חשבונות חינמיים ומנויים בתשלום.</p>
            <p><strong className="text-gray-700">&quot;תוכן משתמש&quot;</strong> — כל חומר שהמשתמש מעלה, יוצר, שומר או מפיץ באמצעות השירות, לרבות סקריפטים, פתיחות ואירועי לוח שנה.</p>
            <p><strong className="text-gray-700">&quot;ViewIL&quot; / &quot;החברה&quot;</strong> — המפעיל של שירות ViewIL, הפועל בהתאם לחוק הישראלי.</p>
            <p><strong className="text-gray-700">&quot;בינה מלאכותית&quot;</strong> — מודלי שפה גדולים (LLM) של ספקים חיצוניים, המשמשים ליצירת תוכן בשירות.</p>
          </Section>

          <Section title="2. שימוש מותר ואסור">
            <p>ViewIL מספקת כלים מבוססי בינה מלאכותית ליוצרי תוכן ישראלים. השימוש בשירות מותר למטרות חוקיות בלבד.</p>
            <p><strong className="text-gray-700">מותר:</strong></p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>יצירת תוכן שיווקי, בידורי, חינוכי לצורך פרסום ברשתות חברתיות</li>
              <li>ניהול לוח תוכן אישי ועסקי</li>
              <li>ניתוח נתוני ביצועים של תוכן שלך</li>
              <li>שיתוף תוצרים שנוצרו בשירות, תוך ציון מקורם</li>
            </ul>
            <p><strong className="text-gray-700">אסור:</strong></p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>יצירת תוכן שקרי, מטעה, דיפ-פייק, פוגעני, מאיים, גזעני או שנאה</li>
              <li>הפרת זכויות יוצרים, סימנים מסחריים או פרטיות של צד שלישי</li>
              <li>ניסיון לעקוף מנגנוני אבטחה, לבצע הנדסה לאחור, או לגשת לנתונים של משתמשים אחרים</li>
              <li>שימוש אוטומטי (בוטים, scraping) ללא אישור כתוב מראש</li>
              <li>מכירה חוזרת של גישה לשירות לצד שלישי</li>
              <li>שימוש הסותר את חוק המחשבים, התשנ&quot;ה-1995, ואת חוקי הגנת הצרכן הישראלי</li>
            </ul>
            <p>
              הגישה לשירות מוגבלת למשתמשים בני 13 ומעלה. משתמשים מתחת לגיל 18 מחויבים בקבלת אישור
              הורה או אפוטרופוס חוקי.
            </p>
          </Section>

          <Section title="3. קניין רוחני">
            <p>
              כל הטכנולוגיה, העיצוב, הקוד, הלוגואים, ממשקי המשתמש והמדגמים של ViewIL הם רכוש
              החברה ומוגנים בחוק זכויות יוצרים, התשס&quot;ח-2007 ובחוקי קניין רוחני ישראליים ובינלאומיים.
            </p>
            <p>
              <strong className="text-gray-700">תוכן משתמש:</strong> התוצרים שיצרת בעצמך באמצעות הכלים
              של ViewIL (סקריפטים, פתיחות, ניתוחים) שייכים לך. ViewIL אינה טוענת לבעלות עליהם.
            </p>
            <p>
              בשימושך בשירות אתה מעניק ל-ViewIL רישיון מוגבל, חינמי, ובלתי ניתן להעברה, לעיבוד
              תוכנך לצורך מתן השירות בלבד (לדוגמה: שמירה בבסיס הנתונים, הצגה בממשק).
            </p>
            <p>
              אינך רשאי להעתיק, לשכפל, לפרסם מחדש, להפיץ, לשנות, או ליצור עבודות נגזרות מהתוכנה,
              ממסד הנתונים, מממשק המשתמש, או מכל חלק אחר של ViewIL.
            </p>
          </Section>

          <Section title="4. הגבלת אחריות">
            <p>
              ViewIL מסופקת &quot;כפי שהיא&quot; (AS IS) ללא אחריות מכל סוג שהוא, מפורשת או משתמעת,
              לרבות התאמה למטרה ספציפית, סחירות, ואי-הפרה.
            </p>
            <p>
              ViewIL לא תישא באחריות לכל נזק ישיר, עקיף, מקרי, מיוחד, עונשי או תוצאתי הנובע
              משימוש בשירות או מאי-יכולת להשתמש בו, גם אם נודע לה על אפשרות נזק כזה.
            </p>
            <p>
              <strong className="text-gray-700">תוצרי הבינה המלאכותית הם הצעות בלבד.</strong> החברה
              אינה אחראית לנזק שיגרם כתוצאה מפרסום תוכן שנוצר בשירות ברשתות חברתיות. האחריות
              לתוכן המפורסם מוטלת על המשתמש בלבד.
            </p>
            <p>
              ViewIL אינה מתחייבת לזמינות רצופה של השירות ושומרת לעצמה את הזכות לבצע תחזוקה,
              עדכונים, שינויים ואף להפסיק את השירות בכל עת, עם הודעה מוקדמת סבירה.
            </p>
            <p>
              אחריות החברה הכוללת, בכל מקרה, לא תעלה על הסכום ששולם על ידך ל-ViewIL ב-12 החודשים
              שקדמו לאירוע שגרם לנזק.
            </p>
          </Section>

          <Section title="5. סיום חשבון">
            <p>
              תוכל לסגור את חשבונך בכל עת דרך הגדרות הפרופיל. עם הסגירה, הנתונים שלך יימחקו
              מהמערכת תוך 30 יום, למעט נתונים שהחברה מחויבת לשמור על פי דין.
            </p>
            <p>
              ViewIL שומרת לעצמה את הזכות להשעות או לסיים חשבון שמפר את תנאי השימוש, עם הודעה
              מוקדמת של 7 ימים — אלא אם מדובר בהפרה חמורה, בה רשאית החברה לפעול לאלתר.
            </p>
            <p>
              לאחר סגירת החשבון, לא תוכל לגשת לתוכן השמור, לסקריפטים, ללוחות התוכן, או לנתוני
              ההכנסות שנשמרו בחשבון.
            </p>
            <p>
              במקרה של הפסקת השירות לחלוטין, תינתן הודעה מוקדמת של 30 יום לפחות, ותתאפשר הורדה
              של הנתונים האישיים.
            </p>
          </Section>

          <Section title="6. שינויים בשירות">
            <p>
              ViewIL רשאית לשנות, להרחיב, לצמצם, או להפסיק תכונות ומחירים של השירות בכל עת.
              שינויים מהותיים יימסרו בהודעה בדוא&quot;ל לפחות 14 יום מראש.
            </p>
            <p>
              ViewIL רשאית לשנות את תנאי השימוש מעת לעת. המשך השימוש בשירות לאחר פרסום תנאים
              מעודכנים מהווה הסכמה לתנאים החדשים.
            </p>
            <p>
              הגרסה הנוכחית של תנאי השימוש תמיד תהיה זמינה בכתובת{" "}
              <span className="text-blue-600">view-il.vercel.app/tos</span>.
            </p>
          </Section>

          <Section title="7. דין ישראלי וסמכות שיפוט">
            <p>
              תנאי שימוש אלה, וכל סכסוך הנובע מהם או מהשימוש בשירות, יוסדרו בהתאם לדיני מדינת
              ישראל בלבד, ללא תחולת כללי ברירת הדין.
            </p>
            <p>
              סמכות השיפוט הבלעדית לדון בכל מחלוקת בין המשתמש לבין ViewIL תהיה לבתי המשפט המוסמכים
              במחוז תל אביב-יפו, ישראל.
            </p>
            <p>
              השירות פועל בהתאם לחוק הגנת הצרכן, התשמ&quot;א-1981, חוק המחשבים, התשנ&quot;ה-1995, וחוק
              הגנת הפרטיות, התשמ&quot;א-1981.
            </p>
            <p>
              אם הינך משתמש מחוץ לישראל, הנך מסכים שכל שימוש בשירות נעשה בכפוף לדין הישראלי
              ולסמכות שיפוט ישראלית.
            </p>
          </Section>

          <div className="pt-4 border-t border-gray-100 text-sm text-gray-400">
            לשאלות בנוגע לתנאי השימוש, אנא צרו קשר:{" "}
            <a href="mailto:viewil.support@gmail.com" className="text-blue-600 hover:underline">
              viewil.support@gmail.com
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
