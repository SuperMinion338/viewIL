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
      className="sticky top-0 z-50 bg-gradient-to-l from-red-600 to-orange-500 text-white py-2.5 px-4 flex items-center justify-center gap-3 text-sm font-semibold shadow-md"
      dir="rtl"
    >
      <span>
        🔥 נותרו רק{" "}
        <span className="font-extrabold text-yellow-200">
          {spotsLeft.toLocaleString("he-IL")}
        </span>{" "}
        מקומות חינמיים
      </span>
      <Link
        href="/signup"
        className="bg-white text-red-600 font-bold px-3 py-1 rounded-full text-xs hover:bg-yellow-50 transition"
      >
        הצטרף עכשיו
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute left-4 text-white/70 hover:text-white text-xl leading-none"
        aria-label="סגור"
      >
        ×
      </button>
    </div>
  );
}
