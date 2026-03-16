"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, TrendingUp } from "lucide-react";

interface ViralResult {
  overallScore: number;
  subScores: { catchiness: number; israeliRelevance: number; shareability: number; uniqueness: number };
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  betterVersion: string;
}

function CircularScore({ score, max = 10 }: { score: number; max?: number }) {
  const [animated, setAnimated] = useState(0);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const pct = animated / max;

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimated(parseFloat((score * ease).toFixed(1)));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color = score >= 8 ? "#22c55e" : score >= 6 ? "#3b82f6" : score >= 4 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="flex flex-col items-center -mt-20 mb-14">
        <span className="text-4xl font-black text-white" style={{ textShadow: `0 0 20px ${color}` }}>
          {animated.toFixed(1)}
        </span>
        <span className="text-white/50 text-sm">/ {max}</span>
      </div>
    </div>
  );
}

function SubScoreBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), 100);
    return () => clearTimeout(t);
  }, [value, max]);
  const color = value >= 8 ? "bg-green-500" : value >= 6 ? "bg-blue-500" : value >= 4 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="text-white font-bold">{value}/10</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function ViralScoreAnalyzer() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ViralResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/viral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "😕 שגיאה בניתוח. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          ניתוח פוטנציאל ויראלי
        </h2>
        <p className="text-sm text-gray-500">הכנס רעיון לסרטון וקבל ציון ויראלי + המלצות לשיפור</p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="תאר את הרעיון לסרטון — למשל: 'כמה כסף הרווחתי מטיקטוק בחודש הראשון'"
          rows={4}
          className="w-full border border-gray-200 rounded-2xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <motion.button
          onClick={handleAnalyze}
          disabled={loading || !idea.trim()}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" />מנתח...</> : "🔥 נתח פוטנציאל ויראלי"}
        </motion.button>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">{error}</div>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Score card — dark premium */}
            <div
              className="rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center"
              style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)" }}
            >
              <div className="flex flex-col items-center shrink-0">
                <CircularScore score={result.overallScore} />
                <p className="text-white font-bold text-sm -mt-2">ציון ויראלי כולל</p>
              </div>
              <div className="flex-1 flex flex-col gap-3 w-full">
                <SubScoreBar label="קליטות הרעיון" value={result.subScores.catchiness} />
                <SubScoreBar label="רלוונטיות לקהל ישראלי" value={result.subScores.israeliRelevance} />
                <SubScoreBar label="פוטנציאל שיתוף" value={result.subScores.shareability} />
                <SubScoreBar label="ייחודיות" value={result.subScores.uniqueness} />
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-1.5">✅ חוזקות</h4>
                <ul className="space-y-1.5">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-green-700 flex gap-2">
                      <span className="shrink-0">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-1.5">⚠️ חולשות</h4>
                <ul className="space-y-1.5">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-red-700 flex gap-2">
                      <span className="shrink-0">•</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h4 className="font-bold text-blue-700 mb-3">🚀 3 שיפורים ספציפיים</h4>
              <ol className="space-y-2">
                {result.improvements.map((imp, i) => (
                  <li key={i} className="text-sm text-blue-800 flex gap-2">
                    <span className="font-bold shrink-0 text-blue-500">{i + 1}.</span>{imp}
                  </li>
                ))}
              </ol>
            </div>

            {/* Better version */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
              <h4 className="font-bold text-purple-700 mb-2">✨ גרסה משופרת של הרעיון</h4>
              <p className="text-sm text-purple-800 leading-relaxed">{result.betterVersion}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
