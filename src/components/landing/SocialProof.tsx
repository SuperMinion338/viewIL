"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const avatars = [
  { initials: "עמ", name: "עמית", color: "bg-blue-500" },
  { initials: "נו", name: "נועה", color: "bg-pink-500" },
  { initials: "יו", name: "יובל", color: "bg-green-500" },
  { initials: "שי", name: "שירה", color: "bg-purple-500" },
  { initials: "דן", name: "דניאל", color: "bg-amber-500" },
];

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || target === 0) return;
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-extrabold text-blue-600 text-2xl mx-1">
      {count.toLocaleString("he-IL")}
    </span>
  );
}

export default function SocialProof() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetch("/api/user-count", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setUserCount(data.count);
      })
      .catch(() => {});
  }, []);

  return (
    <section dir="rtl" className="bg-gray-50 border-t border-b border-gray-200 py-8">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8">
        <p className="text-gray-700 text-lg text-center">
          כבר משתמשים בנו מעל
          <AnimatedCounter target={userCount} />
          יוצרים ישראלים
        </p>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-3">
            {avatars.map((avatar) => (
              <div key={avatar.name} className="flex flex-col items-center gap-1">
                <div
                  className={`${avatar.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {avatar.initials}
                </div>
                <span className="text-xs text-gray-500">{avatar.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
