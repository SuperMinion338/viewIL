"use client";

import { useState } from "react";

const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

// Heat levels 0-7 — Israeli audience 2026 data (UTC+2/+3)
// dayIndex: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
function getHeatLevel(platform: string, dayIndex: number, hourIndex: number): number {
  const hour = HOURS[hourIndex];
  const isSunday    = dayIndex === 0;
  const isMonday    = dayIndex === 1;
  const isTueWedThu = dayIndex >= 2 && dayIndex <= 4;
  const isThursday  = dayIndex === 4;
  const isFriday    = dayIndex === 5;
  const isSaturday  = dayIndex === 6;
  const isMonToThu  = dayIndex >= 1 && dayIndex <= 4;

  // Saturday: Shabbat — block all
  // Exception: YouTube Saturday night (after ~20:00, Shabbat ends)
  if (isSaturday) {
    if (platform === "youtube" && hour >= 20) return 5;
    return 0;
  }

  // Friday 14:00–20:00: Shabbat prep — avoid all platforms
  if (isFriday && hour >= 14 && hour < 20) return 1;

  // ── INSTAGRAM ──
  // Best days: Tue, Wed, Thu | Morning: 09–11 | Lunch: 13–14 | Evening: 19–21
  // Avoid: Sunday before 10:00
  if (platform === "instagram") {
    if (isSunday && hour < 10) return 1;

    // Evening peak 19:00–21:00
    if (hour >= 19 && hour <= 21) {
      if (isTueWedThu) return 7;
      if (isFriday) return 2; // Friday evening (Shabbat has started)
      return 5; // Mon, Sun
    }
    // Lunch peak 13:00–14:00
    if (hour >= 13 && hour <= 14) {
      if (isTueWedThu) return 6;
      return 4;
    }
    // Morning peak 09:00–11:00
    if (hour >= 9 && hour <= 11) {
      if (isTueWedThu) return 5;
      if (isFriday) return 4;
      return 3;
    }
    // Friday morning 8:00–13:00
    if (isFriday && hour >= 8 && hour < 14) return 3;
    if (hour < 8) return 1;
    return 2;
  }

  // ── TIKTOK ──
  // Best: Mon–Thu + weekends | Morning: 07–09 | Evening: 19–23 (strongest)
  // Thu & Fri evenings: absolute peak | Weekend afternoon: 14–17
  // Avoid: Friday 14:00–20:00 (Shabbat prep) — already handled above
  if (platform === "tiktok") {
    if (isFriday) {
      if (hour >= 20) return 7;           // Post-Shabbat: absolute peak
      if (hour >= 7 && hour <= 9) return 6;  // Friday morning peak
      if (hour >= 10 && hour < 14) return 5; // Friday midday (before Shabbat prep)
      return 1;
    }

    // Evening peak 19:00–23:00 (strongest window)
    if (hour >= 19 && hour <= 23) {
      if (isThursday || isMonday) return 7; // Absolute peak on Thu & Mon
      if (isMonToThu) return 7;
      if (isSunday) return 6;
      return 5;
    }
    // Morning peak 07:00–09:00
    if (hour >= 7 && hour <= 9) {
      if (isMonToThu) return 6;
      if (isSunday) return 5;
      return 3;
    }
    // Afternoon 14:00–17:00 (strong on non-Fri days)
    if (hour >= 14 && hour <= 17) return 4;
    if (hour < 7) return 2;
    return 3;
  }

  // ── YOUTUBE ──
  // Best: Thu, Fri morning, Sat night, Sun | Upload: 12–16 | Evening: 19–22
  // Weekend mornings 09–11 strong | Avoid: weekday (Mon–Thu) before 10:00
  if (platform === "youtube") {
    // Mon–Thu: avoid mornings before 10:00
    if (isMonToThu && !isThursday && hour < 10) return 1;
    if (isThursday && hour < 10) return 1;

    if (isFriday) {
      if (hour >= 9 && hour <= 11) return 5;  // Friday morning: strong
      if (hour >= 12 && hour < 14) return 6;  // Upload window before Shabbat prep
      if (hour >= 20) return 4;               // Friday night (after Shabbat)
      return 2;
    }

    // Evening viewing peak 19:00–22:00
    if (hour >= 19 && hour <= 22) {
      if (isThursday || isSunday) return 7;
      return 5;
    }
    // Upload window 12:00–16:00 (indexes before evening peak)
    if (hour >= 12 && hour <= 16) {
      if (isThursday || isSunday) return 6;
      return 4;
    }
    // Weekend mornings 09:00–11:00 strong
    if ((isSunday || isThursday) && hour >= 9 && hour <= 11) return 5;

    return 2;
  }

  return 3;
}

function getTooltip(level: number): string {
  if (level === 0) return "שבת — לא מומלץ לפרסם";
  if (level === 1) return "פעילות נמוכה — הימנע";
  if (level <= 2) return "פעילות נמוכה";
  if (level <= 4) return "שעה בינונית";
  if (level <= 6) return "שעה טובה לפרסם";
  return "שעה מומלצת מאוד! ⭐";
}

export default function TimeAnalyzer() {
  const [platform, setPlatform] = useState("instagram");
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const tips = {
    instagram: {
      good: "ג׳–ה׳ 19:00–21:00 | ג׳–ה׳ 09:00–11:00",
      medium: "שישי בוקר 09:00–13:00 | 13:00–14:00 כל ימות השבוע",
      avoid: "שבת כולה | שישי 14:00+ | ראשון לפני 10:00",
    },
    tiktok: {
      good: "ב׳–ה׳ 19:00–23:00 | שישי 20:00–23:00 (אחרי שבת)",
      medium: "שישי 07:00–13:00 | 14:00–17:00 ימות השבוע",
      avoid: "שבת כולה | שישי 14:00–20:00 (הכנות לשבת)",
    },
    youtube: {
      good: "ה׳ + ראשון 19:00–22:00 | העלאה 12:00–16:00",
      medium: "שישי 09:00–13:00 | שבת מוצ״ש 20:00+",
      avoid: "ב׳–ה׳ לפני 10:00 | שישי 14:00–20:00",
    },
  };

  const t = tips[platform as keyof typeof tips] || tips.instagram;

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">ניתוח שעות שיא</h2>
        <p className="text-sm text-gray-500">מתי הקהל הישראלי הכי פעיל? (נתוני 2026)</p>
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
