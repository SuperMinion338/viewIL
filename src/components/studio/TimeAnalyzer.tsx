"use client";

import { useState } from "react";

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

// Heat levels 0-4: 0=blocked/very low, 1=low, 2=medium, 3=high, 4=peak
// dayIndex: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
function getHeatLevel(platform: string, dayIndex: number, hourIndex: number): number {
  const hour = HOURS[hourIndex];
  const isSun = dayIndex === 0;
  const isFri = dayIndex === 5;
  const isSat = dayIndex === 6;

  if (platform === "instagram") {
    if (isSat) return 0;
    if (isFri) {
      if (hour >= 9 && hour < 13) return 2;
      return 0;
    }
    // Sun–Thu
    if (hour >= 19 && hour <= 21) return 4;
    if (hour >= 9 && hour <= 11) return 3;
    if (hour >= 13 && hour <= 14) return 2;
    return 1;
  }

  if (platform === "tiktok") {
    if (isSat) {
      if (hour >= 21 && hour <= 23) return 3;
      return 0;
    }
    if (isFri) {
      if (hour >= 20) return 4;
      if (hour >= 7 && hour <= 9) return 3;
      return 0;
    }
    // Sun–Thu
    if (hour >= 19 && hour <= 23) return 4;
    if (hour >= 7 && hour <= 9) return 3;
    if (hour >= 12 && hour <= 13) return 2;
    return 1;
  }

  if (platform === "youtube") {
    if (isSat) {
      if (hour >= 20 && hour <= 23) return 3;
      return 0;
    }
    if (isFri) {
      if (hour >= 9 && hour < 12) return 2;
      return 0;
    }
    if (isSun) {
      if (hour >= 19 && hour <= 22) return 4;
      if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) return 2;
      return 1;
    }
    // Mon–Thu
    if (hour >= 19 && hour <= 22) return 4;
    if (hour >= 14 && hour <= 16) return 2;
    return 1;
  }

  return 1;
}

function getTooltip(level: number): string {
  if (level === 0) return "לא מומלץ לפרסם";
  if (level === 1) return "פעילות נמוכה";
  if (level === 2) return "שעה בינונית";
  if (level === 3) return "שעה טובה לפרסם";
  return "שעה מומלצת מאוד ⭐";
}

export default function TimeAnalyzer() {
  const [platform, setPlatform] = useState("instagram");
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const tips = {
    instagram: {
      good: "א׳–ה׳ 19:00–21:00 | א׳–ה׳ 09:00–11:00",
      medium: "שישי 09:00–13:00 | 13:00–14:00 ימות השבוע",
      avoid: "שבת כולה | שישי 13:00+",
    },
    tiktok: {
      good: "א׳–ה׳ 19:00–23:00 | שישי 20:00+ (אחרי שבת)",
      medium: "א׳–ה׳ 07:00–09:00 | שבת 21:00–23:00",
      avoid: "שבת עד 20:00 | שישי 10:00–20:00",
    },
    youtube: {
      good: "א׳–ה׳ 19:00–22:00 | שבת מוצ״ש 20:00+",
      medium: "שישי 09:00–12:00 | 14:00–16:00 ימות השבוע",
      avoid: "שבת 00:00–20:00 | שישי 12:00+",
    },
  };

  const t = tips[platform as keyof typeof tips] || tips.instagram;

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">ניתוח שעות שיא</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">מתי הקהל הישראלי הכי פעיל? (נתוני 2026)</p>
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2">
        {[
          { value: "instagram", label: "📸 אינסטגרם" },
          { value: "tiktok", label: "🎵 TikTok" },
          { value: "youtube", label: "▶️ יוטיוב" },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => setPlatform(p.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition border-2 ${
              platform === p.value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Heatmap — dir="ltr" forces left-to-right hour columns (6→23) */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 overflow-x-auto">
        <div className="min-w-[700px]" dir="ltr">
          {/* Hour headers — same grid as data rows for perfect alignment */}
          <div
            className="mb-1"
            style={{ display: "grid", gridTemplateColumns: "80px repeat(18, 1fr)" }}
          >
            <div className="w-20 shrink-0" />
            {HOURS.map((h) => (
              <div key={h} className="text-center text-xs text-gray-400 font-medium leading-tight">
                {h}:00
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day, dayIdx) => (
            <div
              key={day}
              className="mb-1 items-center"
              style={{ display: "grid", gridTemplateColumns: "80px repeat(18, 1fr)" }}
            >
              <div
                className="text-sm font-medium text-gray-700 dark:text-gray-300 text-right pr-2 leading-8"
                dir="rtl"
              >
                {day}
              </div>
              {HOURS.map((_, hourIdx) => {
                const level = getHeatLevel(platform, dayIdx, hourIdx);
                return (
                  <div
                    key={hourIdx}
                    className={`h-8 rounded cursor-pointer transition hover:scale-110 heatmap-cell-${level}`}
                    style={{ margin: "0 2px" }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({
                        text: getTooltip(level),
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-2 mt-4 justify-center flex-wrap" dir="ltr">
          <span className="text-xs text-gray-500">פחות פעיל</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className={`w-7 h-5 rounded heatmap-cell-${l}`} />
          ))}
          <span className="text-xs text-gray-500">הכי פעיל</span>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <h4 className="font-bold text-green-700 text-sm mb-2">✅ שעות מומלצות</h4>
          <p className="text-xs text-green-600">{t.good}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h4 className="font-bold text-amber-700 text-sm mb-2">⚠️ שעות בינוניות</h4>
          <p className="text-xs text-amber-600">{t.medium}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <h4 className="font-bold text-red-700 text-sm mb-2">🚫 הימנע</h4>
          <p className="text-xs text-red-600">{t.avoid}</p>
        </div>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg pointer-events-none shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
