"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const MAX_USERS = 1000;

const features = [
  "כותב סקריפטים מלא",
  "מחולל פתיחות ללא הגבלה",
  "לוח תוכן חכם",
  "ניתוח שעות שיא",
  "ניתוח ביצועים מלא",
];

export default function Pricing() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/user-count")
      .then((r) => r.json())
      .then((d) => setUserCount(d.count))
      .catch(() => {});
  }, []);

  const pct = userCount !== null ? Math.min(100, (userCount / MAX_USERS) * 100) : 0;

  return (
    <section dir="rtl" className="py-24 bg-white" id="pricing">
      <div className="max-w-2xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4"
        >
          חינם לגמרי — עד 1,000 משתמשים
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-500 mb-12 text-base leading-relaxed"
        >
          אנחנו בשלב גישה מוקדמת. כל הכלים פתוחים לגמרי, בלי כרטיס אשראי, בלי הגבלות.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            🎉 גישה מוקדמת — חינם לחלוטין
          </span>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-6xl font-extrabold">₪0</span>
              <span className="text-white/60 text-lg">לחלוטין</span>
            </div>
            <p className="text-white/75 text-sm">ללא כרטיס אשראי · ללא הגבלות · כל הכלים כלולים</p>
          </div>

          {/* Features */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* User counter */}
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white/90">משתמשים שהצטרפו</span>
              <span className="text-sm font-bold text-white">
                {userCount !== null ? userCount.toLocaleString("he-IL") : "..."} / {MAX_USERS.toLocaleString("he-IL")}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="text-white/55 text-xs mt-2 text-center">
              {userCount !== null ? MAX_USERS - userCount : "..."} מקומות נותרו
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/signup"
            className="block w-full text-center bg-white text-blue-700 font-extrabold py-4 rounded-2xl text-base hover:bg-blue-50 transition shadow-lg shadow-blue-900/20"
          >
            הצטרף עכשיו — בחינם
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
