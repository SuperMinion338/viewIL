"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Copy, CheckCircle2, UserCircle2 } from "lucide-react";

interface BioResult {
  instagram: string[];
  tiktok: string[];
}

export default function BioGenerator() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("professional");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BioResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, audience, tone, keywords }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "😕 שגיאה ביצירת הביו. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  const copyBio = (bio: string) => {
    navigator.clipboard.writeText(bio);
    setCopied(bio);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <UserCircle2 className="w-5 h-5 text-blue-600" />
          יוצר ביו
        </h2>
        <p className="text-sm text-gray-500">3 ביו לאינסטגרם + 3 לטיקטוק — מוכן להעתקה</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Inputs */}
        <div className="lg:w-2/5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">הנישה שלך</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="למשל: פיטנס, בישול, טכנולוגיה, אפנה"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">קהל יעד</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="למשל: נשים 25-35, גברים ספורטיביים, יזמים צעירים"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">טון</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="funny">😄 מצחיק</option>
              <option value="professional">💼 מקצועי</option>
              <option value="inspirational">🌟 השראתי</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">3 מילות מפתח</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="למשל: בריאות, כושר, תזונה"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <motion.button
            onClick={handleGenerate}
            disabled={loading || !niche.trim()}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />יוצר ביו...</> : "✨ צור ביו"}
          </motion.button>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">{error}</div>}
        </div>

        {/* Output */}
        <div className="lg:w-3/5 flex flex-col gap-4">
          <AnimatePresence>
            {!result && !loading && (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center min-h-64 text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-3">👤</div>
                  <p className="font-medium">הביו שלך יופיע כאן</p>
                </div>
              </div>
            )}
            {loading && (
              <div className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3">
                {[70, 85, 60, 75, 80, 65].map((w, i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded-full animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />
                ))}
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-5"
              >
                {/* Instagram bios */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">📸</span>
                    <span className="font-bold text-gray-700">Instagram</span>
                    <span className="text-xs text-gray-400">מקס׳ 150 תווים</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(result.instagram || []).map((bio, i) => (
                      <div key={i} className="bg-gradient-to-l from-pink-50 to-purple-50 border border-pink-100 rounded-2xl p-4 flex items-start justify-between gap-3">
                        <p className="text-sm text-gray-800 leading-relaxed flex-1">{bio}</p>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <button
                            onClick={() => copyBio(bio)}
                            className="text-pink-600 hover:text-pink-800 transition"
                          >
                            {copied === bio ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <span className="text-[10px] text-gray-400">{bio.length}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TikTok bios */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🎵</span>
                    <span className="font-bold text-gray-700">TikTok</span>
                    <span className="text-xs text-gray-400">מקס׳ 80 תווים</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {(result.tiktok || []).map((bio, i) => (
                      <div key={i} className="bg-gradient-to-l from-gray-50 to-slate-50 border border-gray-100 rounded-2xl p-4 flex items-start justify-between gap-3">
                        <p className="text-sm text-gray-800 leading-relaxed flex-1">{bio}</p>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <button
                            onClick={() => copyBio(bio)}
                            className="text-gray-600 hover:text-gray-800 transition"
                          >
                            {copied === bio ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <span className="text-[10px] text-gray-400">{bio.length}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
