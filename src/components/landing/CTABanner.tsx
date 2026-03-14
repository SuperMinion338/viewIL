"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTABanner() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/user-count")
      .then((r) => r.json())
      .then((d) => setUserCount(d.count))
      .catch(() => {});
  }, []);

  const countText = userCount !== null
    ? userCount.toLocaleString("he-IL") + "+"
    : "...";

  return (
    <section dir="rtl" className="relative bg-blue-600 py-24 overflow-hidden">
      {/* Animated SVG waves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.07)"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave"
          style={{ animationDelay: "-3s", animationDuration: "10s" }}
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80 C480,20 960,100 1440,40 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold text-white mb-4"
        >
          מוכן להתחיל לצמוח?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-blue-200 text-lg mb-10"
        >
          הצטרף ל-{countText} יוצרי תוכן ישראלים שכבר משתמשים ב-ViewIL
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link
            href="/studio"
            className="inline-block bg-white text-blue-600 font-bold text-lg px-10 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            צור חשבון חינם
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
