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
            <p className="text-sm text-gray-400">עדכון אחרון: ינואר 2026</p>
          </div>

          <p className="text-gray-600 leading-relaxed">
            ViewIL מחויבת להגן על פרטיותך. מדיניות זו מסבירה אילו מידע אנו אוספים, כיצד אנו
            משתמשים בו, ואיך אתה יכול לשלוט בו.
          </p>

          <Section title="1. איזה מידע אנחנו אוספים">
            <p>
              <strong className="text-gray-700">מידע שאתה מספק:</strong> בעת ההרשמה אנו אוספים את
              שמך, כתובת האימייל שלך וסיסמה (מוצפנת). תוכל גם לספק קישורים לפרופילי הרשתות
              החברתיות שלך.
            </p>
            <p>
              <strong className="text-gray-700">תוכן שנוצר:</strong> סקריפטים, פתיחות ואירועי לוח
              שנה שאתה יוצר ושומר בפלטפורמה.
            </p>
            <p>
              <strong className="text-gray-700">נתוני שימוש:</strong> מידע על האופן שבו אתה
              משתמש בפלטפורמה, כולל תדירות שימוש והעדפות כלים.
            </p>
            <p>
              <strong className="text-gray-700">נתונים טכניים:</strong> כתובת IP, סוג דפדפן,
              מערכת הפעלה ונתוני גישה בסיסיים לצורך אבטחה ושיפור השירות.
            </p>
          </Section>

          <Section title="2. איך אנחנו משתמשים במידע">
            <p>אנו משתמשים במידע שנאסף למטרות הבאות בלבד:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>הפעלת השירות ואימות זהות המשתמש</li>
              <li>שיפור ופיתוח תכונות הפלטפורמה</li>
              <li>שליחת עדכונים ושינויים מהותיים בשירות (לא דיוור שיווקי ללא הסכמה)</li>
              <li>אבטחת החשבון ומניעת שימוש לרעה</li>
              <li>מתן תמיכה טכנית</li>
            </ul>
            <p>
              ViewIL <strong className="text-gray-700">אינה</strong> מוכרת, משכירה או סוחרת
              בנתוניך האישיים לצדדים שלישיים.
            </p>
          </Section>

          <Section title="3. עוגיות (Cookies)">
            <p>
              ViewIL משתמשת בעוגיות הכרחיות לניהול הסשן ואימות הכניסה. אנו לא משתמשים בעוגיות
              פרסומיות או כאלה המשמשות למעקב בין אתרים.
            </p>
            <p>
              <strong className="text-gray-700">עוגיות סשן:</strong> נמחקות כשאתה סוגר את הדפדפן
              או מתנתק מהחשבון.
            </p>
            <p>
              <strong className="text-gray-700">עוגיות JWT:</strong> משמשות לשמירת מצב הכניסה
              בין ביקורים. תוקפן עד 30 יום ממועד הכניסה.
            </p>
            <p>
              תוכל להגדיר את הדפדפן שלך לחסום עוגיות, אך הדבר עלול לפגוע בפעולת הפלטפורמה.
            </p>
          </Section>

          <Section title="4. שיתוף מידע עם צד שלישי">
            <p>אנו משתפים מידע עם ספקים טכניים בלבד, לצורך הפעלת השירות:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>
                <strong className="text-gray-700">Neon (PostgreSQL):</strong> אחסון הנתונים
                המאובטח בענן
              </li>
              <li>
                <strong className="text-gray-700">Vercel:</strong> אירוח האפליקציה
              </li>
              <li>
                <strong className="text-gray-700">Groq AI:</strong> עיבוד בקשות הבינה המלאכותית
                ליצירת תוכן (ללא שמירת היסטוריית שיחות)
              </li>
            </ul>
            <p>
              כל הספקים כפופים לחוזי עיבוד נתונים (DPA) המחייבים אותם להגן על המידע ולא להשתמש
              בו למטרות אחרות.
            </p>
          </Section>

          <Section title="5. אבטחת מידע">
            <p>
              סיסמאות מוצפנות באמצעות bcrypt (12 rounds). העברת נתונים מוצפנת ב-HTTPS/TLS.
              הגישה לבסיס הנתונים מוגבלת ומאובטחת.
            </p>
            <p>
              במקרה של פרצת אבטחה שעלולה לפגוע בנתוניך, נודיע לך בהקדם האפשרי בדוא&quot;ל ונפרט
              את הצעדים שנוקטים לתיקון.
            </p>
            <p>
              אנו ממליצים לבחור סיסמה חזקה ייחודית ולא לשתף את פרטי הגישה שלך עם אחרים.
            </p>
          </Section>

          <Section title="6. הזכויות שלך">
            <p>בהתאם לחוק הגנת הפרטיות הישראלי ועקרונות GDPR, יש לך זכות:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 mr-2">
              <li>לעיין בנתונים האישיים שלך השמורים אצלנו</li>
              <li>לבקש תיקון נתונים שגויים</li>
              <li>למחוק את חשבונך ואת כל הנתונים הקשורים אליו</li>
              <li>לקבל עותק של הנתונים שלך (ייצוא)</li>
              <li>להתנגד לעיבוד מסוים של נתוניך</li>
            </ul>
            <p>
              לממש את זכויותיך, צור קשר בכתובת{" "}
              <a href="mailto:support@viewil.co.il" className="text-blue-600 hover:underline">
                support@viewil.co.il
              </a>
              . נגיב תוך 30 יום.
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
