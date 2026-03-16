"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const avatars = [
  { initials: "עמ", name: "עמית",   color: "bg-blue-500" },
  { initials: "נו", name: "נועה",   color: "bg-pink-500" },
  { initials: "יו", name: "יובל",   color: "bg-green-500" },
  { initials: "שי", name: "שירה",   color: "bg-purple-500" },
  { initials: "דן", name: "דניאל",  color: "bg-amber-500" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || target === 0) return;
    let start = 0;
    const duration = 1600;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-extrabold text-blue-600">
      {count.toLocaleString("he-IL")}{suffix}
    </span>
  );
}

export default function SocialProof() {
  const [stats, setStats] = useState({ users: 0, scripts: 0, hooks: 0 });

  useEffect(() => {
    fetch("/api/platform-stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (typeof d.users === "number") setStats(d); })
      .catch(() => {});
  }, []);

  const counters = [
    { label: "יוצרים ישראלים", value: stats.users, suffix: "+" },
    { label: "סקריפטים שנוצרו", value: stats.scripts, suffix: "+" },
    { label: "הוקים שנוצרו",    value: stats.hooks,   suffix: "+" },
  ];

  return (
    <section dir="rtl" className="bg-gray-50 border-t border-b border-gray-200 py-10">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-8">
        {/* Animated counters */}
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
          {counters.map(({ label, value, suffix }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-3xl md:text-4xl">
                <AnimatedCounter target={value} suffix={suffix} />
              </span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Avatars */}
        <div className="flex gap-4 flex-wrap justify-center">
          {avatars.map((avatar) => (
            <div key={avatar.name} className="flex flex-col items-center gap-1">
              <div className={`${avatar.color} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                {avatar.initials}
              </div>
              <span className="text-xs text-gray-500">{avatar.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
