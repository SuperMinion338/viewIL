"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Zap, Flame, Clock, Users } from "lucide-react";

interface DashboardStats {
  scriptsTotal: number;
  hooksTotal: number;
  analysesTotal: number;
  streak: number;
  activity: { type: string; text: string; createdAt: string }[];
}

const TIPS = [
  "הוק חזק = 3 השניות הראשונות. אם לא תפסת תשומת לב עד אז — הסרטון מת.",
  "פרסם בימים א-ה בין 19:00-21:00 לקהל ישראלי — זה שיא הפעילות.",
  "תגובה לכל תגובה ב-30 הדקות הראשונות אחרי פרסום = האלגוריתם אוהב אותך.",
  "סרטון קצר של 15-30 שניות שמסתיים ב-cliffhanger = הכי הרבה replay.",
  "שמור את 3 הסרטונים הכי טובים שלך — נתח מה משותף להם ועשה עוד מאותו הדבר.",
  "הוסף כתוביות לכל הסרטונים — 80% מהאנשים צופים בלי קול.",
  "תדירות > פרפקציוניזם. 3 סרטונים בינוניים עדיפים על סרטון אחד מושלם.",
  "שבת היא היום הגרוע ביותר לפרסם בישראל. שמור את התוכן לראשון.",
  "סרטון שמתחיל עם שאלה מקבל בממוצע 40% יותר תגובות.",
  "ציין בסיום סרטון בדיוק מה אתה רוצה שהצופה יעשה — לא כל האפשרויות, אחת.",
  "לוח תוכן שבועי מקדים = פחות סטרס + יותר עקביות = יותר צמיחה.",
  "שנה פורמט כל 4-6 שבועות — האלגוריתם מתגמל יוצרים שמתנסים.",
  "Story מאחורי הקלעים של תהליך יצירת הסרטון = engagement גבוה בינוני.",
  "פרסם 3 רילז קצרים לכל רילז ארוך — ככה בונים קהל.",
  "Bio עם CTA ברור + קישור בפועל = 3x יותר קליקים מ-bio ריק.",
  "הוסף טקסט גרפי לשניות הראשונות — הרבה אנשים גוללים עם הצגת פוש ולא ממיד נוגעים.",
  "ענה על שאלות נפוצות של הקהל שלך — זה תמיד מניב תוכן שמחפשים.",
  "שתף כישלון אמיתי שלך — אמינות מייצרת קהילה נאמנה יותר מהצלחות.",
  "אל תמחק סרטונים ישנים — לפעמים הם ויראליים שנים אחרי הפרסום.",
  "השתמש ב-trending sounds בשלושת הימים הראשונים שהם עולים — אחרי זה מאוחר.",
  "הכנס את המילה הכי מחפשת בנישה שלך ל-caption — SEO עובד גם ב-TikTok.",
  "Cross-post בין פלטפורמות בהפרש של 24-48 שעות — לא בו-זמנית.",
  "thumbnail מותאם לנייד (פנים + טקסט גדול) = יותר קליקים ב-YouTube.",
  "שאל את הקהל שלך מה הם רוצים לראות — Posts שואלים = engagement גבוה.",
  "הצג תוצאות מספריות בכותרת: '5 טיפים' עדיף על 'טיפים לצמיחה'.",
  "עקוב אחרי 10 מתחרים ותעד מה מצליח להם — למד לפני שאתה מחדש.",
  "פינת 'שאלות ותשובות' שבועית = תוכן קל + engage גבוה עם קהל.",
  "סרטון שמגיב לתגובה ספציפית = engagement מ-2 קהלים בו-זמנית.",
  "ערוץ יוטיוב עם 12 סרטונים לפחות נראה יותר מקצועי וגורם לאנשים להירשם.",
  "שיתוף פעולה עם יוצר אחר בנישה = חשיפה הדדית לשני קהלים.",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "בוקר טוב";
  if (h < 17) return "צהריים טובים";
  if (h < 21) return "ערב טוב";
  return "לילה טוב";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `לפני ${days} יום${days > 1 ? "ים" : ""}`;
  if (hours > 0) return `לפני ${hours} שעה${hours > 1 ? "ות" : ""}`;
  if (mins > 0) return `לפני ${mins} דקה${mins > 1 ? "ות" : ""}`;
  return "עכשיו";
}

const ACTIVITY_ICONS: Record<string, string> = {
  script:   "✍️",
  hook:     "🎣",
  calendar: "📅",
  analysis: "📊",
  project:  "📋",
  income:   "💰",
};

const ACTIVITY_LABELS: Record<string, string> = {
  script:   "יצרת סקריפט",
  hook:     "יצרת הוקים",
  calendar: "הוספת אירוע לוח",
  analysis: "שמרת ניתוח ביצועים",
  project:  "יצרת פרויקט תוכן",
  income:   "הוספת הכנסה",
};

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getInitialTipIndex(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem("viewil_tip");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === getTodayKey()) return parsed.index;
    }
  } catch {}
  const idx = new Date().getDay() % TIPS.length;
  localStorage.setItem("viewil_tip", JSON.stringify({ date: getTodayKey(), index: idx }));
  return idx;
}

export default function Dashboard({ userName, onSelectTool }: { userName?: string | null; onSelectTool: (id: string) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [referralCount, setReferralCount] = useState<number | null>(null);

  useEffect(() => {
    setTipIndex(getInitialTipIndex());

    fetch("/api/dashboard-stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});

    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => setReferralCount(d.referralCount ?? 0))
      .catch(() => {});
  }, []);

  const nextTip = () => {
    const next = (tipIndex + 1) % TIPS.length;
    setTipIndex(next);
    localStorage.setItem("viewil_tip", JSON.stringify({ date: getTodayKey(), index: next }));
  };

  const firstName = userName?.split(" ")[0] || "יוצר";

  const statCards = [
    { icon: FileText, label: "סקריפטים שנוצרו", value: stats?.scriptsTotal ?? "—", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-100 dark:border-blue-900" },
    { icon: Zap,      label: "הוקים שנוצרו",    value: stats?.hooksTotal ?? "—",   color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950", border: "border-amber-100 dark:border-amber-900" },
    { icon: Flame,    label: "ימים רצופים",      value: stats?.streak ?? "—",       color: "text-red-600 dark:text-red-400",   bg: "bg-red-50 dark:bg-red-950",   border: "border-red-100 dark:border-red-900" },
    { icon: Users,    label: "חברים שהזמנת",     value: referralCount ?? "—",       color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950", border: "border-purple-100 dark:border-purple-900" },
  ];

  const quickActions = [
    { label: "✍️ צור סקריפט חדש", tool: "script",   color: "bg-blue-600 hover:bg-blue-700 text-white" },
    { label: "🎣 צור הוקים",       tool: "hooks",    color: "bg-amber-500 hover:bg-amber-600 text-white" },
    { label: "📅 פתח לוח תוכן",   tool: "calendar", color: "bg-green-600 hover:bg-green-700 text-white" },
    { label: "🔥 ניתוח ויראלי",    tool: "viral",    color: "bg-purple-600 hover:bg-purple-700 text-white" },
  ];

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          {getGreeting()}, {firstName}! 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString("he-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, bg, border }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`${bg} border ${border} rounded-2xl p-4 flex flex-col gap-2`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3">פעולות מהירות</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ label, tool, color }) => (
            <motion.button
              key={tool}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectTool(tool)}
              className={`${color} font-semibold py-3 px-4 rounded-2xl text-sm transition text-center`}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom row: activity + tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent activity */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            פעילות אחרונה
          </h3>
          {stats?.activity && stats.activity.length > 0 ? (
            <ul className="space-y-3">
              {stats.activity.map((a, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="shrink-0 text-base">{ACTIVITY_ICONS[a.type] ?? "🔧"}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500 block">{ACTIVITY_LABELS[a.type] ?? a.type}</span>
                    <span className="text-gray-700 dark:text-gray-200 truncate block text-xs">{a.text}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{timeAgo(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">
              <p>עדיין אין פעילות</p>
              <p className="text-xs mt-1">צור את הסקריפט הראשון שלך!</p>
            </div>
          )}
        </div>

        {/* Tip of the day */}
        <div className="rounded-2xl p-5 flex flex-col justify-between gap-4 border-r-4 border-blue-500 bg-blue-950">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">טיפ היום</p>
              <p className="text-white text-sm leading-relaxed">{TIPS[tipIndex]}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-400/60 text-xs">{tipIndex + 1} / {TIPS.length}</span>
            <button
              onClick={nextTip}
              className="text-xs text-blue-300 hover:text-white transition font-semibold flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full"
            >
              טיפ הבא ←
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
