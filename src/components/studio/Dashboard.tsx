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
  "פרסם ב-19:00–21:00 בימי ב׳–ה׳ לקהל ישראלי — זו שעת השיא של טיקטוק ואינסטגרם.",
  "שלוש השניות הראשונות של הסרטון קובעות 70% מהצפיות. תשקיע בהוק.",
  "הוסף כתוביות לכל הסרטונים — 80% מהאנשים צופים בלי קול.",
  "תגיב לתגובות ב-30 הדקות הראשונות — האלגוריתם מתגמל אינטראקציה מהירה.",
  "תדירות > פרפקציוניזם. 3 סרטונים בינוניים עדיפים על סרטון אחד מושלם.",
  "שבת היא היום הגרוע ביותר לפרסם בישראל. שמור את התוכן לראשון.",
  "סרטון שמתחיל עם שאלה מקבל בממוצע 40% יותר תגובות.",
  "ציין בסיום סרטון בדיוק מה אתה רוצה שהצופה יעשה — לא כל האפשרויות, אחת.",
  "הצורה הכי ויראלית לישראל: 'גיליתי משהו שאתה לא מאמין' + תוצאה אמיתית.",
  "לוח תוכן שבועי מקדים = פחות סטרס + יותר עקביות = יותר צמיחה.",
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

export default function Dashboard({ userName, onSelectTool }: { userName?: string | null; onSelectTool: (id: string) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tipIndex] = useState(() => new Date().getDay() % TIPS.length);
  const [referralCount, setReferralCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {});

    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => setReferralCount(d.referralCount ?? 0))
      .catch(() => {});
  }, []);

  const firstName = userName?.split(" ")[0] || "יוצר";

  const statCards = [
    { icon: FileText, label: "סקריפטים שנוצרו", value: stats?.scriptsTotal ?? "—", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { icon: Zap, label: "הוקים שנוצרו", value: stats?.hooksTotal ?? "—", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { icon: Flame, label: "ימים רצופים", value: stats?.streak ?? "—", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    { icon: Users, label: "חברים שהזמנת", value: referralCount ?? "—", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  ];

  const quickActions = [
    { label: "✍️ צור סקריפט חדש", tool: "script", color: "bg-blue-600 hover:bg-blue-700 text-white" },
    { label: "🎣 צור הוקים", tool: "hooks", color: "bg-amber-500 hover:bg-amber-600 text-white" },
    { label: "📅 פתח לוח תוכן", tool: "calendar", color: "bg-green-600 hover:bg-green-700 text-white" },
    { label: "🔥 ניתוח ויראלי", tool: "viral", color: "bg-purple-600 hover:bg-purple-700 text-white" },
  ];

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="text-2xl font-extrabold text-gray-900">
          {getGreeting()}, {firstName}! 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
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
            <p className="text-xs text-gray-500 leading-tight">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3">פעולות מהירות</h3>
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
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            פעילות אחרונה
          </h3>
          {stats?.activity && stats.activity.length > 0 ? (
            <ul className="space-y-3">
              {stats.activity.map((a, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="shrink-0 text-base">{a.type === "script" ? "✍️" : "🎣"}</span>
                  <span className="flex-1 text-gray-700 truncate">{a.text}</span>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(a.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 text-sm text-center py-6">
              <p>עדיין אין פעילות</p>
              <p className="text-xs mt-1">צור את הסקריפט הראשון שלך!</p>
            </div>
          )}
        </div>

        {/* Tip of the day */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)" }}
        >
          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">טיפ היום</p>
            <p className="text-white text-sm leading-relaxed">{TIPS[tipIndex]}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-white/30 text-xs">ViewIL Pro Tip</span>
          </div>
        </div>
      </div>
    </div>
  );
}
