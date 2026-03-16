"use client";

import { useState } from "react";
import { Loader2, Copy, CheckCircle2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SOURCE_FORMATS = [
  { value: "tiktok", label: "TikTok / Reels", emoji: "🎵" },
  { value: "instagram_post", label: "פוסט אינסטגרם", emoji: "📸" },
  { value: "script", label: "סקריפט", emoji: "✍️" },
  { value: "blog", label: "מאמר בלוג", emoji: "📝" },
  { value: "email", label: "אימייל", emoji: "📧" },
];

const TARGET_FORMATS = [
  { value: "tiktok", label: "TikTok", emoji: "🎵" },
  { value: "instagram_reel", label: "Instagram Reel", emoji: "🎬" },
  { value: "instagram_post", label: "פוסט אינסטגרם", emoji: "📸" },
  { value: "linkedin", label: "לינקדאין", emoji: "💼" },
  { value: "twitter", label: "Twitter/X Thread", emoji: "🐦" },
  { value: "youtube_shorts", label: "YouTube Shorts", emoji: "▶️" },
  { value: "email", label: "ניוזלטר / אימייל", emoji: "📧" },
  { value: "blog", label: "מאמר בלוג", emoji: "📝" },
];

interface RepurposeResult {
  format: string;
  text: string;
}

export default function RepurposeTool() {
  const [content, setContent] = useState("");
  const [sourceFormat, setSourceFormat] = useState("tiktok");
  const [selectedTargets, setSelectedTargets] = useState<string[]>(["instagram_post"]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RepurposeResult[]>([]);
  const [error, setError] = useState("");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  const toggleTarget = (value: string) => {
    setSelectedTargets((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleRepurpose = async () => {
    if (!content.trim() || selectedTargets.length === 0) return;
    setLoading(true);
    setError("");
    setResults([]);
    setActiveTab("");

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sourceFormat, targetFormats: selectedTargets }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      setResults(data.results);
      setActiveTab(data.results[0]?.format ?? "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "שגיאה בשינוי הפורמט. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (format: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const activeResult = results.find((r) => r.format === activeTab);
  const getFormatLabel = (value: string) => TARGET_FORMATS.find((f) => f.value === value)?.label ?? value;
  const getFormatEmoji = (value: string) => TARGET_FORMATS.find((f) => f.value === value)?.emoji ?? "📄";

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          שינוי פורמט תוכן
        </h2>
        <p className="text-sm text-gray-500">הדבק תוכן קיים — קבל אותו מותאם לכל פלטפורמה שתבחר</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">פורמט מקורי</label>
              <div className="flex flex-wrap gap-2">
                {SOURCE_FORMATS.map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => setSourceFormat(value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                      sourceFormat === value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                הדבק את התוכן שלך
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="הדבק כאן את הסקריפט, הפוסט, הסרטון התמלול — כל תוכן שיש לך..."
                rows={8}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <p className="text-xs text-gray-400 mt-1">{content.length} תווים</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              פורמטים יעד — בחר את כל מה שאתה רוצה
            </label>
            <div className="flex flex-wrap gap-2">
              {TARGET_FORMATS.filter((f) => f.value !== sourceFormat).map(({ value, label, emoji }) => (
                <button
                  key={value}
                  onClick={() => toggleTarget(value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition border-2 ${
                    selectedTargets.includes(value)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {emoji} {label}
                  {selectedTargets.includes(value) && <span className="mr-1">✓</span>}
                </button>
              ))}
            </div>
            {selectedTargets.length > 0 && (
              <p className="text-xs text-blue-600 mt-2 font-medium">
                {selectedTargets.length} פורמטים נבחרו
              </p>
            )}
          </div>

          <motion.button
            onClick={handleRepurpose}
            disabled={loading || !content.trim() || selectedTargets.length === 0}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                ממיר לכל הפורמטים...
              </>
            ) : (
              `🔄 שנה פורמט ל-${selectedTargets.length} פלטפורמות`
            )}
          </motion.button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                  {results.map(({ format }) => (
                    <button
                      key={format}
                      onClick={() => setActiveTab(format)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                        activeTab === format
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-gray-200 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {getFormatEmoji(format)} {getFormatLabel(format)}
                    </button>
                  ))}
                </div>

                {/* Active result */}
                {activeResult && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-700 text-sm">
                        {getFormatEmoji(activeTab)} {getFormatLabel(activeTab)}
                      </h3>
                      <button
                        onClick={() => handleCopy(activeTab, activeResult.text)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                          copiedFormat === activeTab
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {copiedFormat === activeTab ? (
                          <><CheckCircle2 className="w-4 h-4" />הועתק!</>
                        ) : (
                          <><Copy className="w-4 h-4" />העתק</>
                        )}
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-t border-gray-100 pt-3">
                      {activeResult.text}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && results.length === 0 && (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center py-24 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-3">🔄</div>
                <p className="font-medium">התוכן המותאם יופיע כאן</p>
                <p className="text-sm mt-1">הדבק תוכן ובחר פורמטים</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col gap-3">
              {selectedTargets.map((_, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded-full w-32 mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded-full w-full" />
                    <div className="h-3 bg-gray-200 rounded-full w-4/5" />
                    <div className="h-3 bg-gray-200 rounded-full w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
