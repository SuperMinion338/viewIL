"use client";

import { useState } from "react";
import { Loader2, Link as LinkIcon, ClipboardList } from "lucide-react";

interface Result {
  score: number;
  engagementRate: string;
  workedWell: string[];
  improve: string[];
  nextTopic: string;
}

interface Stats {
  views: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  reach: string;
}

const EMPTY_STATS: Stats = {
  views: "", likes: "", comments: "", shares: "", saves: "", reach: "",
};

const fields = [
  { key: "views" as const, label: "👁️ צפיות" },
  { key: "likes" as const, label: "❤️ לייקים" },
  { key: "comments" as const, label: "💬 תגובות" },
  { key: "shares" as const, label: "🔁 שיתופים" },
  { key: "saves" as const, label: "🔖 שמירות" },
  { key: "reach" as const, label: "📡 טווח הגעה" },
];

export default function PerformanceAnalyzer() {
  const [tab, setTab] = useState<"manual" | "url">("manual");
  const [platform, setPlatform] = useState("instagram");
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [url, setUrl] = useState("");
  const [urlStatsReady, setUrlStatsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          views: Number(stats.views) || 0,
          likes: Number(stats.likes) || 0,
          comments: Number(stats.comments) || 0,
          shares: Number(stats.shares) || 0,
          saves: Number(stats.saves) || 0,
          reach: Number(stats.reach) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "שגיאה בניתוח");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlContinue = () => {
    if (!url.trim()) return;
    // Auto-detect platform from URL
    if (url.includes("tiktok.com")) setPlatform("tiktok");
    else if (url.includes("instagram.com")) setPlatform("instagram");
    setUrlStatsReady(true);
  };

  const scoreColor = (s: number) =>
    s >= 8 ? "text-green-600" : s >= 5 ? "text-amber-600" : "text-red-600";
  const scoreBg = (s: number) =>
    s >= 8 ? "bg-green-50 border-green-200" : s >= 5 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">ניתוח ביצועים</h2>
        <p className="text-sm text-gray-500">הכנס נתונים ידנית או קישור לפוסט</p>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 rounded-2xl p-1 gap-1 w-fit">
        <button
          onClick={() => { setTab("manual"); setUrlStatsReady(false); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === "manual"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          הכנס נתונים ידנית
        </button>
        <button
          onClick={() => { setTab("url"); setUrlStatsReady(false); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === "url"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          הכנס קישור לפוסט
        </button>
      </div>

      {/* URL tab */}
      {tab === "url" && !urlStatsReady && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            אינסטגרם וטיקטוק לא מאפשרים קריאה אוטומטית — הכנס את הנתונים מהפוסט
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              קישור לפוסט (לצורך עיון)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlContinue()}
              placeholder="https://www.instagram.com/p/... או https://www.tiktok.com/..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              dir="ltr"
            />
          </div>
          <button
            onClick={handleUrlContinue}
            disabled={!url.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-2xl transition flex items-center justify-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            המשך — הכנס נתוני הפוסט
          </button>
        </div>
      )}

      {/* Manual entry — shown for manual tab OR after URL is entered */}
      {(tab === "manual" || urlStatsReady) && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
          {/* URL reference banner */}
          {urlStatsReady && url && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
              <LinkIcon className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-semibold mb-0.5">פוסט לניתוח</p>
                <p className="text-xs text-blue-500 truncate" dir="ltr">{url}</p>
              </div>
            </div>
          )}

          {urlStatsReady && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
              אינסטגרם וטיקטוק לא מאפשרים קריאה אוטומטית — הכנס את הנתונים מהפוסט
            </div>
          )}

          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">פלטפורמה</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "instagram", label: "📸 אינסטגרם" },
                { value: "tiktok", label: "🎵 TikTok" },
                { value: "youtube", label: "▶️ יוטיוב" },
                { value: "facebook", label: "👥 פייסבוק" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition border-2 ${
                    platform === p.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                <input
                  type="number"
                  min="0"
                  value={stats[key]}
                  onChange={(e) => setStats((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                מנתח ביצועים...
              </>
            ) : (
              "📊 נתח ביצועים"
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">
          <div className={`border rounded-2xl p-6 text-center ${scoreBg(result.score)}`}>
            <p className="text-sm font-semibold text-gray-600 mb-1">ציון הסרטון</p>
            <p className={`text-6xl font-extrabold ${scoreColor(result.score)}`}>
              {result.score}
              <span className="text-2xl text-gray-400">/10</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">אחוז מעורבות: {result.engagementRate}%</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                <span>✅</span> מה עבד טוב
              </h4>
              <ul className="flex flex-col gap-2">
                {result.workedWell.map((item, i) => (
                  <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="mt-0.5 text-green-500 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h4 className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                <span>⚡</span> מה לשפר
              </h4>
              <ul className="flex flex-col gap-2">
                {result.improve.map((item, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="mt-0.5 text-amber-500 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
              <span>🎯</span> נושא לסרטון הבא
            </h4>
            <p className="text-blue-800 text-sm leading-relaxed">{result.nextTopic}</p>
          </div>
        </div>
      )}

      {!result && !loading && tab === "manual" && (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center py-16 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="font-medium">הניתוח יופיע כאן</p>
          </div>
        </div>
      )}
    </div>
  );
}
