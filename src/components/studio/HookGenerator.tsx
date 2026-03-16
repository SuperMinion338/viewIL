"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Hook {
  style: string;
  icon: string;
  text: string;
}

const DRAFT_KEY = "viewil_draft_hooks";

export default function HookGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDismissed, setDraftDismissed] = useState(false);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const { topic: t } = JSON.parse(draft);
        if (t) setHasDraft(true);
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  const restoreDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    try {
      const { topic: t, platform: p } = JSON.parse(draft);
      if (t) setTopic(t);
      if (p) setPlatform(p);
    } catch { /* ignore */ }
    setHasDraft(false);
    setDraftDismissed(true);
  };

  useEffect(() => {
    autosaveRef.current = setInterval(() => {
      if (topic.trim()) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ topic, platform }));
      }
    }, 30000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [topic, platform]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setHooks([]);

    try {
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHooks(data.hooks);
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "שגיאה ביצירת הפתיחות");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {hasDraft && !draftDismissed && (
        <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
          <p className="text-sm text-amber-800 font-medium">📝 יש לך טיוטה שמורה — רוצה להמשיך ממנה?</p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={restoreDraft}
              className="text-sm font-bold text-amber-700 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-full transition"
            >
              שחזר טיוטה
            </button>
            <button
              onClick={() => { setHasDraft(false); setDraftDismissed(true); localStorage.removeItem(DRAFT_KEY); }}
              className="text-sm text-amber-600 hover:text-amber-800 px-2 py-1 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">יוצר הוקים</h2>
        <p className="text-sm text-gray-500">קבל 5 פתיחות מנצחות לכל סרטון</p>
      </div>

      {/* Input */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            נושא הסרטון
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="לדוגמה: איך להרוויח כסף מהבית"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            פלטפורמה
          </label>
          <div className="flex gap-3">
            {[
              { value: "tiktok", label: "TikTok", emoji: "🎵" },
              { value: "instagram", label: "אינסטגרם", emoji: "📸" },
              { value: "youtube", label: "יוטיוב", emoji: "▶️" },
            ].map((p) => (
              <motion.button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition border-2 ${
                  platform === p.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {p.emoji} {p.label}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              יוצר פתיחות...
            </>
          ) : (
            "🎣 צור 5 פתיחות"
          )}
        </motion.button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {hooks.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-700">הפתיחות שלך:</h3>
            {hooks.map((hook, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start justify-between gap-4 hover:shadow-md transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{hook.icon}</span>
                    <span className="text-sm font-bold text-gray-600">{hook.style}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">{hook.text}</p>
                </div>
                <motion.button
                  onClick={() => handleCopy(hook.text, index)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full transition font-medium"
                >
                  <Copy className="w-3 h-3" />
                  {copiedIndex === index ? "הועתק!" : "העתק"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {!loading && hooks.length === 0 && !error && (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center py-16 text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-3">🎣</div>
            <p className="font-medium">5 פתיחות מנצחות יופיעו כאן</p>
          </div>
        </div>
      )}
    </div>
  );
}
