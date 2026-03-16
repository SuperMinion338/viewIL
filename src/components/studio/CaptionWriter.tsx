"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Copy, CheckCircle2, MessageSquare } from "lucide-react";

interface CaptionResult {
  hook: string;
  body: string;
  israeliTags: string[];
  nicheTags: string[];
}

export default function CaptionWriter() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("inspirational");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaptionResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "😕 שגיאה ביצירת הקפשן. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const fullCaption = result ? `${result.hook}\n\n${result.body}` : "";
  const allTags = result ? [...result.israeliTags, ...result.nicheTags].join(" ") : "";
  const charCount = fullCaption.length;

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          כותב קפשן חכם
        </h2>
        <p className="text-sm text-gray-500">קפשן מלא עם האשטאגים — בלחיצה אחת</p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/5 flex flex-col gap-4">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="נושא הסרטון — למשל: 'יצאתי לחופשה בתאילנד עם 500₪'"
            rows={4}
            className="w-full border border-gray-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">פלטפורמה</label>
            <div className="flex gap-2">
              {[
                { id: "instagram", label: "📸 Instagram" },
                { id: "tiktok", label: "🎵 TikTok" },
                { id: "youtube", label: "▶️ YouTube" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition ${
                    platform === p.id ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">טון</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="funny">😄 מצחיק</option>
              <option value="serious">💼 רציני</option>
              <option value="inspirational">🌟 השראתי</option>
            </select>
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />יוצר קפשן...</> : "✨ צור קפשן"}
          </motion.button>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}
        </div>

        {/* Output */}
        <div className="lg:w-3/5 flex flex-col gap-4">
          <AnimatePresence>
            {!result && !loading && (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center min-h-64 text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="font-medium">הקפשן שלך יופיע כאן</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3">
                {[80, 60, 90, 70].map((w, i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded-full animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-4"
              >
                {/* Caption text */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{charCount} תווים</span>
                    <button
                      onClick={() => copyText(fullCaption, "caption")}
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-full transition"
                    >
                      {copied === "caption" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied === "caption" ? "הועתק!" : "העתק קפשן"}
                    </button>
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                    <span className="font-bold text-gray-900">{result.hook}</span>
                    {"\n\n"}
                    {result.body}
                  </div>
                </div>

                {/* Hashtags */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700 text-sm"># האשטאגים</span>
                    <button
                      onClick={() => copyText(allTags, "tags")}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-full transition"
                    >
                      {copied === "tags" ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      {copied === "tags" ? "הועתק!" : "העתק הכל"}
                    </button>
                  </div>
                  {result.israeliTags.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">🇮🇱 ישראלי</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.israeliTags.map((t) => (
                          <button key={t} onClick={() => copyText(t, t)} className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full hover:bg-blue-200 transition">
                            {copied === t ? "✓" : t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.nicheTags.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">🎯 נישה</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.nicheTags.map((t) => (
                          <button key={t} onClick={() => copyText(t, t)} className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full hover:bg-purple-200 transition">
                            {copied === t ? "✓" : t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Copy all */}
                <button
                  onClick={() => copyText(fullCaption + "\n\n" + allTags, "all")}
                  className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-2xl transition text-sm flex items-center justify-center gap-2"
                >
                  {copied === "all" ? <><CheckCircle2 className="w-4 h-4" />הועתק!</> : <><Copy className="w-4 h-4" />העתק קפשן + האשטאגים</>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
