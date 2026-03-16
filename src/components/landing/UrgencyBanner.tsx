"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UrgencyBanner() {
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/user-count", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === "number") setSpotsLeft(Math.max(0, 1000 - d.count));
        else setSpotsLeft(843);
      })
      .catch(() => setSpotsLeft(843));
  }, []);

  if (dismissed || spotsLeft === null) return null;

  return (
    <div
      className="sticky top-0 z-50 bg-gradient-to-l from-red-700 to-orange-600 text-white py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-semibold shadow-lg"
      dir="rtl"
    >
      {/* Pulsing red dot */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-200" />
      </span>
      <span>
        🔥 נותרו רק{" "}
        <span className="font-extrabold text-yellow-200 text-base">
          {spotsLeft.toLocaleString("he-IL")}
        </span>{" "}
        מקומות בחינם
      </span>
      <Link
        href="/signup"
        className="bg-white text-red-700 font-bold px-4 py-1.5 rounded-full text-xs hover:bg-yellow-50 transition shadow-md"
      >
        הצטרף עכשיו →
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute left-4 text-white/60 hover:text-white text-xl leading-none"
        aria-label="סגור"
      >
        ×
      </button>
    </div>
  );
}
