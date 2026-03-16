"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "script", label: "✍️ כותב סקריפטים" },
  { id: "hooks", label: "🎣 יוצר הוקים" },
  { id: "calendar", label: "📅 לוח תוכן" },
];

function ScriptDemo() {
  return (
    <div dir="rtl">
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">💡 הרעיון שלך</label>
        <div className="border border-gray-200 rounded-xl px-4 py-3 text-gray-500 bg-gray-50 text-sm">
          5 טיפים לצמיחה מהירה בטיקטוק לעסקים קטנים
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">😄 מצחיק</span>
          <button className="bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-xl">
            ✨ צור סקריפט
          </button>
        </div>
      </div>
      <div className="border border-blue-100 rounded-2xl overflow-hidden text-sm">
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
            פתיחה — 5 שניות ראשונות
          </span>
          <p className="text-gray-800 mt-2 leading-relaxed">
            &quot;אחי, אם העסק שלך על טיקטוק ועוד לא מכיר את 5 הדברים האלה — אתה פשוט מפסיד לקוחות בכל יום. בוא נתקן את זה עכשיו.&quot;
          </p>
        </div>
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            גוף הסרטון
          </span>
          <ul className="mt-2 space-y-1.5 text-gray-700">
            <li>• טיפ 1: פתח עם הוק חזק בשלוש השניות הראשונות</li>
            <li>• טיפ 2: שמור על קצב מהיר — חתוך כל שתיקה</li>
            <li>• טיפ 3: הוסף כתוביות — 80% צופים בלי קול</li>
            <li>• טיפ 4: פרסם ב-19:00–21:00 — שעות הזהב</li>
            <li>• טיפ 5: תגובה לכל תגובה ב-30 דק׳ הראשונות</li>
          </ul>
        </div>
        <div className="bg-amber-50 px-4 py-3">
          <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
            סיום — קריאה לפעולה
          </span>
          <p className="text-gray-700 mt-2">
            &quot;שמור את הסרטון הזה — תחזור אליו לפני כל פוסט. ✅&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

function HooksDemo() {
  return (
    <div dir="rtl" className="flex flex-col gap-3">
      <div className="border border-gray-200 rounded-xl px-4 py-3 text-gray-500 bg-gray-50 text-sm mb-2">
        נושא: למה לא כולם מצליחים בטיקטוק
      </div>
      {[
        { icon: "🤯", type: "עובדה מטורפת", text: "95% מהסרטונים בטיקטוק נצפים פחות מ-200 פעם — והסיבה היא לא התוכן." },
        { icon: "❓", type: "שאלה מסקרנת", text: "מה ההבדל בין יוצר עם 500 עוקבים לכזה עם 500K — כי הוא לא קשור לכישרון." },
        { icon: "📖", type: "סיפור אישי", text: "לפני שנה הייתי עם 200 עוקבים ומתוסכל. היום יש לי 45K. ואני הולך לספר לכם בדיוק מה שיניתי." },
        { icon: "⚡", type: "קונטרה", text: "תפסיקו לייצר תוכן טוב. זה לא מה שגורם לצמיחה בטיקטוק." },
        { icon: "🎯", type: "הבטחה", text: "תראה את 3 הטריקים האלה ואתה תכפיל את הצפיות שלך בחודש הקרוב." },
      ].map((hook) => (
        <div key={hook.type} className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex gap-3 shadow-sm">
          <span className="text-xl shrink-0">{hook.icon}</span>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">{hook.type}</p>
            <p className="text-sm text-gray-800">{hook.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarDemo() {
  const days = [
    { day: "ראשון", date: "23/3", content: "טיפים לצמיחה", platform: "📸", color: "bg-pink-100 border-pink-200 text-pink-700" },
    { day: "שני", date: "24/3", content: "מאחורי הקלעים", platform: "🎵", color: "bg-purple-100 border-purple-200 text-purple-700" },
    { day: "שלישי", date: "25/3", content: "", platform: "", color: "" },
    { day: "רביעי", date: "26/3", content: "שאלות ותשובות", platform: "▶️", color: "bg-red-100 border-red-200 text-red-700" },
    { day: "חמישי", date: "27/3", content: "סיכום שבועי", platform: "📸", color: "bg-pink-100 border-pink-200 text-pink-700" },
    { day: "שישי", date: "28/3", content: "", platform: "", color: "" },
    { day: "שבת", date: "29/3", content: "", platform: "", color: "opacity-40" },
  ];
  return (
    <div dir="rtl" className="grid grid-cols-7 gap-1">
      {days.map((d) => (
        <div key={d.day} className="flex flex-col gap-1">
          <div className="text-center text-xs text-gray-400 font-medium pb-1 border-b border-gray-100">
            <div>{d.day.slice(0, 2)}</div>
            <div className="font-bold text-gray-600">{d.date.split("/")[0]}</div>
          </div>
          {d.content ? (
            <div className={`rounded-lg border px-1.5 py-1.5 text-center ${d.color}`}>
              <div className="text-xs">{d.platform}</div>
              <div className="text-[10px] font-medium leading-tight mt-0.5">{d.content}</div>
            </div>
          ) : (
            <div className="h-10 rounded-lg border border-dashed border-gray-200 bg-gray-50" />
          )}
        </div>
      ))}
    </div>
  );
}

const demoComponents: Record<string, React.ReactNode> = {
  script: <ScriptDemo />,
  hooks: <HooksDemo />,
  calendar: <CalendarDemo />,
};

export default function DemoPreview() {
  const [activeTab, setActiveTab] = useState("script");

  return (
    <section dir="rtl" className="py-24 bg-white overflow-hidden" id="demo">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            ראה דוגמה חיה
          </h2>
          <p className="text-gray-500 text-lg">בחר כלי ותראה איך הפלט נראה באמת</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition border-2 ${
                activeTab === tab.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                  : "border-gray-200 text-gray-600 hover:border-blue-300 bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Browser frame */}
        <motion.div
          className="rounded-2xl border border-gray-200 shadow-2xl shadow-blue-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3" dir="ltr">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-left border border-gray-200 max-w-xs mx-auto">
              app.viewil.co/{activeTab === "script" ? "script-writer" : activeTab === "hooks" ? "hook-generator" : "calendar"}
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 min-h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {demoComponents[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
