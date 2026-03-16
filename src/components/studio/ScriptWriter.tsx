"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Save, Loader2, Hash, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ScriptResult {
  hook: string;
  body: string;
  cta: string;
  full?: string;
}

interface Hashtags {
  large: string[];
  medium: string[];
  small: string[];
}

const DRAFT_KEY = "viewil_draft_script";

export default function ScriptWriter() {
  const [idea, setIdea] = useState("");
  const [tone, setTone] = useState("educational");
  const [length, setLength] = useState("3min");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);
  const hasConfettied = useRef(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDismissed, setDraftDismissed] = useState(false);

  // Hashtags
  const [hashtags, setHashtags] = useState<Hashtags | null>(null);
  const [loadingHashtags, setLoadingHashtags] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Titles
  const [titles, setTitles] = useState<string[] | null>(null);
  const [loadingTitles, setLoadingTitles] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const { idea: draftIdea, tone: draftTone, length: draftLength } = JSON.parse(draft);
        if (draftIdea) setHasDraft(true);
        // Don't auto-restore yet — show banner first
        void draftIdea; void draftTone; void draftLength;
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, []);

  const restoreDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    try {
      const { idea: draftIdea, tone: draftTone, length: draftLength } = JSON.parse(draft);
      if (draftIdea) setIdea(draftIdea);
      if (draftTone) setTone(draftTone);
      if (draftLength) setLength(draftLength);
    } catch { /* ignore */ }
    setHasDraft(false);
    setDraftDismissed(true);
  };

  // Autosave every 30s when idea has content
  useEffect(() => {
    autosaveRef.current = setInterval(() => {
      if (idea.trim()) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ idea, tone, length }));
      }
    }, 30000);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [idea, tone, length]);

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const startCountdown = (seconds: number) => {
    setCountdown(seconds);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const generateTitles = async (scriptText: string) => {
    setLoadingTitles(true);
    setTitles(null);
    try {
      const res = await fetch("/api/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptText }),
      });
      const data = await res.json();
      if (res.ok) setTitles(data.titles);
    } catch {
      // silent — titles are optional
    } finally {
      setLoadingTitles(false);
    }
  };

  const generateHashtags = async (scriptText: string) => {
    setLoadingHashtags(true);
    setHashtags(null);
    try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptText }),
      });
      const data = await res.json();
      if (res.ok) setHashtags(data);
    } catch {
      // silent — hashtags are optional
    } finally {
      setLoadingHashtags(false);
    }
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setHashtags(null);
    setTitles(null);

    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, tone, length }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 && data.retryAfter) startCountdown(data.retryAfter);
        throw new Error(data.error);
      }
      setResult(data);
      setJustGenerated(true);
      setTimeout(() => setJustGenerated(false), 1200);
      // Clear saved draft after successful generation
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
      if (!hasConfettied.current) {
        hasConfettied.current = true;
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#2563EB", "#60A5FA", "#34D399", "#FBBF24"] });
      }
      // Generate hashtags from full script text
      const fullText = data.full || `${data.hook}\n${data.body}\n${data.cta}`;
      generateHashtags(fullText);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "שגיאה ביצירת הסקריפט");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = `פתיחה:\n${result.hook}\n\nגוף הסרטון:\n${result.body}\n\nסיום:\n${result.cta}`;
    navigator.clipboard.writeText(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, tone, hook: result.hook, body: result.body, cta: result.cta }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silent fail
    }
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const handleCopyAllTags = () => {
    if (!hashtags) return;
    const all = [...hashtags.large, ...hashtags.medium, ...hashtags.small].join(" ");
    navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const allTags = hashtags ? [...hashtags.large, ...hashtags.medium, ...hashtags.small] : [];

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Draft banner */}
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Input panel */}
        <div className="lg:w-2/5 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800">כותב סקריפטים</h2>
          <p className="text-sm text-gray-500">הכנס רעיון וקבל סקריפט מלא לסרטון</p>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              רעיון לסרטון
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="לדוגמה: 5 טיפים לצמיחה מהירה בטיקטוק לעסקים קטנים"
              rows={5}
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              טון הסרטון
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="funny">😄 מצחיק וקליל</option>
              <option value="serious">💼 רציני ומקצועי</option>
              <option value="inspirational">🌟 מעורר השראה</option>
              <option value="educational">📚 חינוכי ומלמד</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              אורך הסרטון
            </label>
            <div className="flex gap-2">
              {[
                { value: "60s", label: "60 שניות", desc: "~100 מילה" },
                { value: "3min", label: "3 דקות", desc: "~350 מילה" },
                { value: "10min", label: "10 דקות", desc: "~1,200 מילה" },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setLength(value)}
                  className={`flex-1 flex flex-col items-center py-2.5 px-2 rounded-xl text-sm font-medium transition border-2 ${
                    length === value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold">{label}</span>
                  <span className="text-xs opacity-60 mt-0.5">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={loading || !idea.trim() || countdown > 0}
            whileHover={{ scale: loading || countdown > 0 ? 1 : 1.02 }}
            whileTap={{ scale: loading || countdown > 0 ? 1 : 0.97 }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                יוצר סקריפט...
              </>
            ) : countdown > 0 ? (
              `המתן ${countdown}s...`
            ) : (
              "✨ צור סקריפט"
            )}
          </motion.button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
              {error}
              {countdown > 0 && (
                <p className="mt-2 font-bold">ניתן לנסות שוב בעוד {countdown} שניות...</p>
              )}
            </div>
          )}
        </div>

        {/* Output panel */}
        <div className="lg:w-3/5 flex flex-col gap-4 relative">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 min-h-64"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">✍️</div>
                  <p className="font-medium">הסקריפט שלך יופיע כאן</p>
                  <p className="text-sm mt-1">הכנס רעיון ולחץ על &quot;צור סקריפט&quot;</p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-4"
              >
                {/* Skeleton cards */}
                {[
                  { color: "bg-blue-50 border-blue-100", barColor: "bg-blue-200", lines: [80, 60] },
                  { color: "bg-gray-50 border-gray-100", barColor: "bg-gray-200", lines: [90, 70, 55] },
                  { color: "bg-amber-50 border-amber-100", barColor: "bg-amber-200", lines: [75, 50] },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`border rounded-2xl p-5 ${s.color}`}
                  >
                    <div className={`h-5 w-28 rounded-full ${s.barColor} mb-4 animate-pulse`} />
                    {s.lines.map((w, j) => (
                      <div
                        key={j}
                        className={`h-3 rounded-full ${s.barColor} mb-2 animate-pulse`}
                        style={{ width: `${w}%`, animationDelay: `${j * 100}ms` }}
                      />
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Success flash overlay */}
                <AnimatePresence>
                  {justGenerated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                    >
                      <div className="bg-green-500 text-white rounded-2xl px-6 py-3 flex items-center gap-2 shadow-lg text-sm font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                        הסקריפט מוכן!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-700">הסקריפט המוכן</h3>
                  <motion.button
                    onClick={handleCopyAll}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition"
                  >
                    <Copy className="w-4 h-4" />
                    {saved ? "הועתק!" : "העתק הכל"}
                  </motion.button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      פתיחה — 5 שניות ראשונות
                    </span>
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="text-gray-800 text-sm leading-relaxed min-h-8 focus:outline-none"
                  >
                    {result.hook}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      גוף הסרטון
                    </span>
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="text-gray-800 text-sm leading-relaxed min-h-16 whitespace-pre-line focus:outline-none"
                  >
                    {result.body}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      סיום — קריאה לפעולה
                    </span>
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="text-gray-800 text-sm leading-relaxed min-h-8 focus:outline-none"
                  >
                    {result.cta}
                  </div>
                </div>

                {/* Title generator button */}
                <motion.button
                  onClick={() => {
                    const fullText = result.full || `${result.hook}\n${result.body}\n${result.cta}`;
                    generateTitles(fullText);
                  }}
                  disabled={loadingTitles}
                  whileHover={{ scale: loadingTitles ? 1 : 1.02 }}
                  whileTap={{ scale: loadingTitles ? 1 : 0.97 }}
                  className="flex items-center justify-center gap-2 w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 disabled:opacity-60 font-bold py-3 rounded-2xl transition"
                >
                  {loadingTitles ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      יוצר כותרות...
                    </>
                  ) : (
                    "✨ צור לי כותרת"
                  )}
                </motion.button>

                {/* Title chips */}
                {titles && titles.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col gap-3">
                    <p className="text-sm font-bold text-purple-700">5 כותרות לסרטון — לחץ להעתקה:</p>
                    <div className="flex flex-wrap gap-2">
                      {titles.map((title, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            navigator.clipboard.writeText(title);
                            setCopiedTitle(title);
                            setTimeout(() => setCopiedTitle(null), 1500);
                          }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                            copiedTitle === title
                              ? "bg-green-100 border-green-300 text-green-700"
                              : "bg-white border-purple-300 text-purple-700 hover:bg-purple-100"
                          }`}
                        >
                          {copiedTitle === title ? "✓ הועתק" : title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-2xl transition"
                >
                  <Save className="w-4 h-4" />
                  {saved ? "נשמר! ✓" : "שמור סקריפט"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Hashtag Section ── */}
      {(result || loadingHashtags) && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              האשטאגים מומלצים
            </h3>
            {hashtags && allTags.length > 0 && (
              <button
                onClick={handleCopyAllTags}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition"
              >
                <Copy className="w-4 h-4" />
                {copiedAll ? "הועתק!" : "העתק הכל"}
              </button>
            )}
          </div>

          {loadingHashtags && (
            <div className="flex items-center gap-3 text-gray-400 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-sm">מייצר האשטאגים...</span>
            </div>
          )}

          {hashtags && (
            <div className="flex flex-col gap-4">
              {/* Large */}
              {hashtags.large.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                      🔥 גדולים — 1M+
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.large.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleCopyTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                          copiedTag === tag
                            ? "bg-green-100 border-green-300 text-green-700"
                            : "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {copiedTag === tag ? "✓ הועתק" : tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium */}
              {hashtags.medium.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      ⚡ בינוניים — 100K–1M
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.medium.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleCopyTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                          copiedTag === tag
                            ? "bg-green-100 border-green-300 text-green-700"
                            : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                        }`}
                      >
                        {copiedTag === tag ? "✓ הועתק" : tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Small */}
              {hashtags.small.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                      🎯 קטנים — עד 100K
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.small.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleCopyTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                          copiedTag === tag
                            ? "bg-green-100 border-green-300 text-green-700"
                            : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        {copiedTag === tag ? "✓ הועתק" : tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
