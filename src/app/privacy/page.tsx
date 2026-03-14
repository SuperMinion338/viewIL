import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "מדיניות פרטיות — ViewIL",
};

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">מדיניות פרטיות</h1>
            <p className="text-sm text-gray-400">עדכון אחרון: מרץ 2026</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            ViewIL מחויבת להגן על פרטיותך ועל המידע האישי שלך בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981
            ותקנותיו, ועקרונות ה-GDPR. מדיניות זו מסבירה אילו נתונים אנו אוספים, כיצד אנו משתמשים
            בהם, ואיך תוכל לממש את זכויותיך. השירות פועל בהתאם לדין הישראלי.
          </p>

          <Section title="1. איסוף מידע">
            <p><strong className="text-gray-700">מידע שאתה מספק בעת הרשמה:</strong></p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>שם מלא</li>
              <li>כתובת דוא&quot;ל</li>
              <li>סיסמה (מוצפנת — לא נשמרת בטקסט גלוי)</li>
              <li>קישורים לפרופילי רשתות חברתיות (אינסטגרם, טיקטוק) — אופציונלי</li>
              <li>תמונת פרופיל — אופציונלי</li>
            </ul>
            <p><strong className="text-gray-700">תוכן שאתה יוצר ושומר:</strong></p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>סקריפטים ופתיחות שנוצרו בשירות</li>
              <li>אירועי לוח תוכן</li>
              <li>נתוני הכנסות שהוזנו ידנית</li>
            </ul>
            <p><strong className="text-gray-700">נתונים טכניים ואוטומטיים:</strong></p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>כתובת IP לצורך אבטחה ומניעת שימוש לרעה</li>
              <li>סוג דפדפן ומערכת הפעלה</li>
              <li>עמודים שביקרת בהם ותדירות השימוש</li>
              <li>זמן ותאריך כניסה לשירות</li>
            </ul>
            <p>
              אנו <strong className="text-gray-700">לא</strong> אוספים מידע רגיש כגון מספרי תעודת
              זהות, נתוני תשלום ישירים (תשלומים מנוהלים על ידי צד שלישי מאובטח), או מידע ביומטרי.
            </p>
          </Section>

          <Section title="2. שימוש במידע">
            <p>אנו משתמשים במידע שנאסף למטרות הבאות בלבד:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>הפעלת השירות ואימות זהות המשתמש</li>
              <li>אחסון ושליפה של תוכן שיצרת</li>
              <li>שיפור ופיתוח תכונות הפלטפורמה על בסיס דפוסי שימוש מצטברים ואנונימיים</li>
              <li>שליחת עדכונים מהותיים בשירות — לא דיוור שיווקי ללא הסכמתך המפורשת</li>
              <li>אבטחת החשבון, זיהוי הונאות ומניעת שימוש לרעה</li>
              <li>מתן תמיכה טכנית בעת פנייה</li>
            </ul>
            <p>
              ViewIL <strong className="text-gray-700">אינה</strong> מוכרת, משכירה, סוחרת, או
              מעבירה את נתוניך האישיים לצדדים שלישיים למטרות שיווק או רווח.
            </p>
            <p>
              לא נשתמש בתוכן שיצרת לאימון מודלי בינה מלאכותית ללא הסכמתך המפורשת.
            </p>
          </Section>

          <Section title="3. עוגיות (Cookies)">
            <p>
              ViewIL משתמשת בעוגיות הכרחיות לניהול הסשן ואימות הכניסה. אנו אינו משתמשים בעוגיות
              פרסומיות, מעקב בין-אתרי, או פרופיילינג.
            </p>
            <p>
              <strong className="text-gray-700">עוגיות הכרחיות:</strong> חיוניות לפעולת הפלטפורמה —
              ללא אפשרות להשבית.
            </p>
            <p>
              <strong className="text-gray-700">עוגיות סשן (Session Cookies):</strong> נמחקות
              כשאתה סוגר את הדפדפן או מתנתק.
            </p>
            <p>
              <strong className="text-gray-700">עוגיות JWT:</strong> שומרות על מצב הכניסה בין
              ביקורים. תוקפן עד 30 יום ממועד הכניסה.
            </p>
            <p>
              תוכל להגדיר את הדפדפן לחסום עוגיות, אך הדבר עשוי לפגוע בפעולת השירות ולמנוע כניסה
              לחשבון.
            </p>
          </Section>

          <Section title="4. שיתוף מידע עם צדדים שלישיים">
            <p>
              אנו משתפים מידע רק עם ספקי תשתית טכנית החיוניים להפעלת השירות, וכולם כפופים להסכמי
              עיבוד נתונים (DPA):
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>
                <strong className="text-gray-700">Neon (PostgreSQL):</strong> אחסון בסיס הנתונים
                בענן — שרתים באירופה, מוצפן
              </li>
              <li>
                <strong className="text-gray-700">Vercel:</strong> אירוח האפליקציה ו-CDN
              </li>
              <li>
                <strong className="text-gray-700">Google Gemini AI:</strong> עיבוד בקשות יצירת
                תוכן — לא נשמרת היסטוריית שיחות
              </li>
            </ul>
            <p>
              ספקים אלה מחויבים חוזית שלא להשתמש בנתוניך לכל מטרה מעבר למתן השירות עבורנו.
            </p>
            <p>
              ViewIL תחשוף מידע אישי לרשויות המוסמכות אך ורק אם נדרש לכך על פי חוק, צו שיפוטי,
              או לצורך הגנה על זכויות החברה ומשתמשיה.
            </p>
          </Section>

          <Section title="5. אבטחת מידע">
            <p>
              אנו נוקטים באמצעי אבטחה מקובלים בתעשייה כדי להגן על המידע שלך:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>סיסמאות מוצפנות עם bcrypt (12 rounds) — לא ניתן לשחזר</li>
              <li>תעבורת נתונים מוצפנת ב-HTTPS/TLS בלבד</li>
              <li>גישה לבסיס הנתונים מוגבלת לסביבות מאושרות בלבד</li>
              <li>משתני סביבה רגישים (API keys) לא נחשפים בקוד הלקוח</li>
              <li>JWT tokens עם תפוגה מוגדרת</li>
            </ul>
            <p>
              <strong className="text-gray-700">פרצת אבטחה:</strong> במקרה של פרצה שעלולה לפגוע
              בנתוניך, נודיע לך בדוא&quot;ל תוך 72 שעות, בהתאם לחובות החוק, ונפרט את הצעדים שננקטים.
            </p>
            <p>
              על אף האמצעים הנ&quot;ל, אנו ממליצים לבחור סיסמה ייחודית וחזקה ולא לשתף את פרטי הגישה.
            </p>
          </Section>

          <Section title="6. זכויות המשתמש לפי חוק הגנת הפרטיות הישראלי">
            <p>
              בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981 ותיקוניו, ועקרונות ה-GDPR, עומדות לך הזכויות
              הבאות:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li><strong className="text-gray-700">זכות עיון:</strong> לבקש לראות את כל המידע האישי שלך השמור אצלנו</li>
              <li><strong className="text-gray-700">זכות תיקון:</strong> לבקש תיקון מידע שגוי, לא מדויק, או לא רלוונטי</li>
              <li><strong className="text-gray-700">זכות מחיקה:</strong> לבקש מחיקת חשבונך וכל הנתונים הקשורים אליו</li>
              <li><strong className="text-gray-700">זכות ניידות:</strong> לקבל עותק של הנתונים שלך בפורמט קריא (CSV/JSON)</li>
              <li><strong className="text-gray-700">זכות התנגדות:</strong> להתנגד לסוגים מסוימים של עיבוד נתוניך</li>
              <li><strong className="text-gray-700">זכות הגבלת עיבוד:</strong> לבקש הגבלת השימוש בנתוניך בנסיבות מסוימות</li>
            </ul>
            <p>
              לממש כל אחת מהזכויות הנ&quot;ל, שלחו בקשה לכתובת{" "}
              <a href="mailto:support@viewil.co.il" className="text-blue-600 hover:underline">
                support@viewil.co.il
              </a>
              . נגיב תוך 30 יום מקבלת הבקשה.
            </p>
            <p>
              אם אינך מרוצה מהטיפול בבקשתך, זכותך לפנות לרשם מאגרי המידע במשרד המשפטים.
            </p>
          </Section>

          <Section title="7. יצירת קשר">
            <p>
              לכל שאלה, בקשה, או תלונה בנוגע לפרטיות ולמידע האישי שלך, ניתן לפנות אלינו:
            </p>
            <ul className="list-none flex flex-col gap-1 mr-2">
              <li>
                <strong className="text-gray-700">דוא&quot;ל:</strong>{" "}
                <a href="mailto:support@viewil.co.il" className="text-blue-600 hover:underline">
                  support@viewil.co.il
                </a>
              </li>
              <li>
                <strong className="text-gray-700">אינסטגרם:</strong>{" "}
                <a
                  href="https://instagram.com/_view.il"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  @_view.il
                </a>
              </li>
            </ul>
            <p>
              ViewIL פועלת בהתאם לדין הישראלי. כל תלונה או סכסוך יוסדרו בפני בתי המשפט המוסמכים
              במחוז תל אביב-יפו.
            </p>
          </Section>

          <div className="pt-4 border-t border-gray-100 text-sm text-gray-400">
            לשאלות בנוגע למדיניות הפרטיות, אנא צרו קשר:{" "}
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
