"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Link as LinkIcon, ClipboardList, Trash2, ChevronDown, ChevronUp, Download } from "lucide-react";
import { containsBlockedWords } from "@/lib/contentFilter";

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

interface SavedAnalysis {
  id: number;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  groqAnalysis: string;
  createdAt: string;
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

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  youtube: "▶️",
  facebook: "👥",
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "אינסטגרם",
  tiktok: "TikTok",
  youtube: "יוטיוב",
  facebook: "פייסבוק",
};

export default function PerformanceAnalyzer() {
  const [tab, setTab] = useState<"manual" | "url">("manual");
  const [platform, setPlatform] = useState("instagram");
  const [title, setTitle] = useState("");
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [url, setUrl] = useState("");
  const [urlStatsReady, setUrlStatsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    setLoadingAnalyses(true);
    try {
      const res = await fetch("/api/analyses");
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data.analyses || []);
      }
    } catch {
      // silent
    } finally {
      setLoadingAnalyses(false);
    }
  };

  const saveAnalysis = async (r: Result) => {
    try {
      await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          platform,
          views: Number(stats.views) || 0,
          likes: Number(stats.likes) || 0,
          comments: Number(stats.comments) || 0,
          shares: Number(stats.shares) || 0,
          saves: Number(stats.saves) || 0,
          reach: Number(stats.reach) || 0,
          groqAnalysis: JSON.stringify(r),
        }),
      });
      await loadAnalyses();
    } catch {
      // silent
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      // silent
    }
  };

  const handleAnalyze = async () => {
    if (!title.trim()) {
      setError("אנא הכנס שם לסרטון / הפוסט");
      return;
    }
    if (containsBlockedWords(title)) {
      setError("הטקסט מכיל מילים לא מתאימות. אנא נסח מחדש.");
      return;
    }
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
      saveAnalysis(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "שגיאה בניתוח");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlContinue = () => {
    if (!url.trim()) return;
    if (url.includes("tiktok.com")) setPlatform("tiktok");
    else if (url.includes("instagram.com")) setPlatform("instagram");
    setUrlStatsReady(true);
  };

  const handleExport = async () => {
    if (!resultRef.current || !result) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");

      const captured = await html2canvas(resultRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = 1080;
      finalCanvas.height = 1080;
      const ctx = finalCanvas.getContext("2d")!;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1080, 1080);

      const paddingH = 60;
      const paddingTop = 50;
      const brandingH = 70;
      const contentAreaW = 1080 - paddingH * 2;
      const contentAreaH = 1080 - paddingTop - brandingH;

      const scaleX = contentAreaW / captured.width;
      const scaleY = contentAreaH / captured.height;
      const drawScale = Math.min(scaleX, scaleY);

      const drawW = captured.width * drawScale;
      const drawH = captured.height * drawScale;
      const drawX = (1080 - drawW) / 2;
      const drawY = paddingTop + (contentAreaH - drawH) / 2;

      ctx.drawImage(captured, drawX, drawY, drawW, drawH);

      // Draw branding (favicon + text) at bottom right
      const faviconSize = 40;
      const faviconX = 1080 - 24 - faviconSize;
      const faviconY = 1080 - 24 - faviconSize;

      const img = new Image();
      img.src = "/favicon.ico";
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 1500);
      });

      if (img.naturalWidth > 0) {
        ctx.drawImage(img, faviconX, faviconY, faviconSize, faviconSize);
      }

      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px Arial, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("viewil.com", faviconX - 10, faviconY + faviconSize / 2);

      const dateStr = new Date().toISOString().split("T")[0];
      const safeTitle = title.replace(/[\s/\\:*?"<>|]/g, "-").slice(0, 40);
      const filename = `viewil-analysis-${safeTitle}-${dateStr}.png`;

      const link = document.createElement("a");
      link.download = filename;
      link.href = finalCanvas.toDataURL("image/png", 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 8 ? "text-green-600" : s >= 5 ? "text-amber-600" : "text-red-600";
  const scoreBg = (s: number) =>
    s >= 8
      ? "bg-green-50 border-green-200"
      : s >= 5
      ? "bg-amber-50 border-amber-200"
      : "bg-red-50 border-red-200";

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">ניתוח ביצועים</h2>
        <p className="text-sm text-gray-500">הכנס נתונים ידנית או קישור לפוסט</p>
      </div>

      {/* Title field */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          שם הסרטון / הפוסט <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוגמה: ריל על 5 טיפים לעסקים קטנים"
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
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

      {/* Manual entry */}
      {(tab === "manual" || urlStatsReady) && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
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
        <div ref={resultRef} className="flex flex-col gap-4">
          <div className={`border rounded-2xl p-6 text-center ${scoreBg(result.score)}`}>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              ציון הסרטון — {title}
            </p>
            <p className={`text-6xl font-extrabold ${scoreColor(result.score)}`}>
              {result.score}
              <span className="text-2xl text-gray-400">/10</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {PLATFORM_ICONS[platform]} {PLATFORM_LABELS[platform] || platform} • אחוז מעורבות: {result.engagementRate}%
            </p>
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

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-2xl transition"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                מייצא תמונה...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                הורד כתמונה
              </>
            )}
          </button>
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

      {/* ── Saved Analyses ── */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-800">הניתוחים השמורים שלי</h3>
          {analyses.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {analyses.length}
            </span>
          )}
        </div>

        {loadingAnalyses ? (
          <div className="flex items-center gap-3 text-gray-400 py-6">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-sm">טוען ניתוחים...</span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center py-12 text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm font-medium">אין ניתוחים שמורים עדיין</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {analyses.map((analysis) => {
              const parsed: Result | null = (() => {
                try { return JSON.parse(analysis.groqAnalysis); } catch { return null; }
              })();
              const isExpanded = expandedId === analysis.id;

              return (
                <div
                  key={analysis.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center gap-3 p-4">
                    <span className="text-2xl shrink-0">
                      {PLATFORM_ICONS[analysis.platform] || "📊"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{analysis.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {PLATFORM_LABELS[analysis.platform] || analysis.platform} • {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                    {parsed && (
                      <div
                        className={`shrink-0 text-center px-3 py-1.5 rounded-full text-sm font-bold border ${
                          parsed.score >= 8
                            ? "bg-green-50 border-green-200 text-green-700"
                            : parsed.score >= 5
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}
                      >
                        {parsed.score}/10
                      </div>
                    )}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : analysis.id)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                      title={isExpanded ? "סגור" : "הרחב"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(analysis.id)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                      title="מחק"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && parsed && (
                    <div className="border-t border-gray-100 p-4 flex flex-col gap-3 bg-gray-50">
                      <p className="text-xs text-gray-500 font-medium">
                        אחוז מעורבות: {parsed.engagementRate}%
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-green-700 mb-1.5">✅ מה עבד טוב</p>
                          <ul className="flex flex-col gap-1">
                            {parsed.workedWell?.map((item, i) => (
                              <li key={i} className="text-xs text-green-700">• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-amber-700 mb-1.5">⚡ מה לשפר</p>
                          <ul className="flex flex-col gap-1">
                            {parsed.improve?.map((item, i) => (
                              <li key={i} className="text-xs text-amber-700">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {parsed.nextTopic && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                          <p className="text-xs font-bold text-blue-700 mb-1">🎯 נושא לסרטון הבא</p>
                          <p className="text-xs text-blue-800">{parsed.nextTopic}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
