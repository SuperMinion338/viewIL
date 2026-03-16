"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const TYPEWRITER_TEXT = `פתיחה:
"וואלה, לא האמנתי שהדבר הזה אמיתי — עד שניסיתי בעצמי."

גוף הסרטון:
יש טריק אחד שכל יוצר תוכן ישראלי צריך לדעת: לפרסם בזמן הנכון.
ב-19:30 ב׳ בשבוע? הקהל שלך על הטלפון. ב-14:00 ביום ג׳? אתה מדבר לחלל.
זה לא קשור לתוכן — זה קשור לתזמון. ורוב האנשים לא יודעים את זה.

סיום:
שמור את הסרטון הזה לפעם הבאה שאתה מתכנן תוכן ✅`;

function TypewriterDemo() {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setStarted(true), 1000);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (idx >= TYPEWRITER_TEXT.length) return;
    const timer = setTimeout(
      () => {
        setDisplayed(TYPEWRITER_TEXT.slice(0, idx + 1));
        setIdx((prev) => prev + 1);
      },
      TYPEWRITER_TEXT[idx] === "\n" ? 40 : 22
    );
    return () => clearTimeout(timer);
  }, [idx, started]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="max-w-2xl mx-auto mt-14 rounded-2xl border border-gray-200 shadow-2xl shadow-blue-100 overflow-hidden"
    >
      {/* Browser chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3" dir="ltr">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-left border border-gray-200 max-w-xs">
          app.viewil.co/script-writer
        </div>
        <span className="text-xs text-blue-500 font-medium">✨ יוצר סקריפט...</span>
      </div>

      {/* Typewriter area */}
      <div className="bg-white p-6 min-h-36 text-right" dir="rtl">
        <p className="text-sm text-gray-800 leading-7 whitespace-pre-line font-medium">
          {displayed}
          {idx < TYPEWRITER_TEXT.length && (
            <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse ml-0.5 align-middle" />
          )}
        </p>
        {displayed.length === 0 && (
          <p className="text-sm text-gray-400">מכין את הסקריפט שלך...</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      dir="rtl"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-8 pb-16"
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-blob absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-400 opacity-20 blur-3xl" />
        <div className="animation-delay-2000 animate-blob absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-sky-300 opacity-20 blur-3xl" />
        <div className="animation-delay-4000 animate-blob absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-blue-500 opacity-20 blur-3xl" />
      </div>

      {/* Floating cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="animate-float absolute top-24 right-8 md:right-20 bg-white rounded-2xl shadow-xl p-4 w-48 z-10 border border-gray-100"
      >
        <p className="text-sm font-bold mb-1">✍️ סקריפט מוכן</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          &quot;פותחים עם שאלה שכולם שואלים את עצמם...&quot;
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="animate-float-delay absolute top-40 left-8 md:left-20 bg-white rounded-2xl shadow-xl p-4 w-44 z-10 border border-gray-100"
      >
        <p className="text-sm font-bold mb-1">🎣 5 פתיחות</p>
        <p className="text-xs text-gray-500">
          &quot;אם אתה עושה את הטעות הזו, אתה מפסיד...&quot;
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="animate-float-delay2 absolute bottom-40 right-8 md:right-24 bg-white rounded-2xl shadow-xl p-4 w-44 z-10 border border-gray-100"
      >
        <p className="text-sm font-bold mb-1">📅 לוח תוכן</p>
        <p className="text-xs text-gray-500">יום ג׳ — טיפים לצמיחה</p>
        <p className="text-xs text-gray-500">יום ה׳ — מאחורי הקלעים</p>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Image src="/logo-transparent.png" alt="ViewIL" width={80} height={80} priority />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-extrabold text-4xl md:text-6xl text-gray-900 leading-tight mb-6"
        >
          הכלי שיוצרי התוכן
          <br />
          <span className="text-blue-600">בישראל חיכו לו</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto"
        >
          סקריפטים, לוח תוכן, ניתוח שעות שיא — הכל בעברית, הכל במקום אחד
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/studio"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-blue-200 hover:shadow-xl"
          >
            התחל בחינם
          </Link>
          <a
            href="#features"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-full text-lg transition-all"
          >
            ראה איך זה עובד
          </a>
        </motion.div>

        {/* Live typewriter demo */}
        <TypewriterDemo />
      </div>
    </section>
  );
}
