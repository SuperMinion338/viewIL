"use client";

import { useState } from "react";

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

// Heat levels 0-7 for each platform
// Format: [Sun, Mon, Tue, Wed, Thu, Fri, Sat][hourIndex]
function getHeatLevel(platform: string, dayIndex: number, hourIndex: number): number {
  const hour = HOURS[hourIndex];
  const isFriday = dayIndex === 5;
  const isSaturday = dayIndex === 6;
  const isWeekday = dayIndex <= 4;

  if (isSaturday) return 0; // Shabbat
  if (isFriday && hour >= 14) return 1; // Friday afternoon - avoid

  if (platform === "instagram") {
    if (isWeekday && hour >= 19 && hour <= 22) return 7;
    if (isWeekday && hour >= 12 && hour <= 14) return 5;
    if (isWeekday && hour >= 7 && hour <= 9) return 4;
    if (isFriday && hour >= 8 && hour <= 12) return 4;
    if (isWeekday && hour >= 17 && hour <= 18) return 5;
    if (hour < 6 || hour > 23) return 0;
    return 2;
  }

  if (platform === "tiktok") {
    if (isWeekday && hour >= 21 && hour <= 23) return 7;
    if (isWeekday && hour >= 19 && hour <= 21) return 6;
    if (isWeekday && hour >= 14 && hour <= 16) return 4;
    if (isFriday && hour >= 10 && hour <= 13) return 4;
    if (hour < 10) return 1;
    return 3;
  }

  if (platform === "youtube") {
    if (isWeekday && hour >= 19 && hour <= 22) return 7;
    if (isWeekday && hour >= 15 && hour <= 18) return 5;
    if (isWeekday && hour === 12 || hour === 13) return 4;
    if (isFriday && hour >= 9 && hour <= 13) return 5;
    if (hour < 8) return 0;
    return 2;
  }

  return 3;
}

function getTooltip(level: number): string {
  if (level === 0) return "לא מומלץ לפרסם";
  if (level <= 2) return "פעילות נמוכה";
  if (level <= 4) return "שעה בינונית";
  if (level <= 6) return "שעה טובה לפרסם";
  return "שעה מומלצת מאוד! ⭐";
}

export default function TimeAnalyzer() {
  const [platform, setPlatform] = useState("instagram");
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">ניתוח שעות שיא</h2>
        <p className="text-sm text-gray-500">מתי הקהל הישראלי הכי פעיל?</p>
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

      {/* Heatmap */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 overflow-x-auto">
        <div className="min-w-max">
          {/* Hour headers */}
          <div className="flex mb-1">
            <div className="w-20 shrink-0" />
            {HOURS.map((h) => (
              <div key={h} className="w-10 text-center text-xs text-gray-400 font-medium">
                {h}:00
              </div>
            ))}
          </div>

          {/* Rows */}
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-20 shrink-0 text-sm font-medium text-gray-700 text-right pl-2">
                {day}
              </div>
              {HOURS.map((_, hourIdx) => {
                const level = getHeatLevel(platform, dayIdx, hourIdx);
                return (
                  <div
                    key={hourIdx}
                    className={`w-10 h-8 rounded mx-0.5 cursor-pointer transition hover:scale-110 heatmap-cell-${level}`}
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
        <div className="flex items-center gap-2 mt-4 justify-center flex-wrap">
          <span className="text-xs text-gray-500">פחות פעיל</span>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((l) => (
            <div key={l} className={`w-6 h-4 rounded heatmap-cell-${l}`} />
          ))}
          <span className="text-xs text-gray-500">הכי פעיל</span>
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <h4 className="font-bold text-green-700 text-sm mb-2">✅ שעות מומלצות</h4>
          <p className="text-xs text-green-600">
            {platform === "tiktok"
              ? "21:00–23:00 ימים א׳–ה׳"
              : platform === "youtube"
              ? "19:00–22:00 ימים א׳–ה׳"
              : "19:00–22:00 ימים א׳–ה׳"}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h4 className="font-bold text-amber-700 text-sm mb-2">⚠️ שעות בינוניות</h4>
          <p className="text-xs text-amber-600">
            {platform === "tiktok"
              ? "14:00–16:00, בוקר שישי"
              : platform === "youtube"
              ? "15:00–18:00, שישי בוקר"
              : "שישי 8:00–12:00"}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <h4 className="font-bold text-red-700 text-sm mb-2">🚫 הימנע</h4>
          <p className="text-xs text-red-600">
            שבת כולה, שישי אחר הצהריים, לילה מאוחר
          </p>
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
