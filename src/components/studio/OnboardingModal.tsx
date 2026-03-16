"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "viewil_onboarding_done";

const steps = [
  {
    icon: "✍️",
    title: "כותב סקריפטים",
    description:
      "הכנס רעיון לסרטון וקבל סקריפט מלא בשניות — פתיחה, גוף וסיום — בעברית ישראלית טבעית. ניתן לערוך ולשמור.",
    tip: "נסה: 'למה רוב האנשים לא מצליחים בטיקטוק'",
  },
  {
    icon: "🎣",
    title: "יוצר הוקים",
    description:
      "קבל 5 פתיחות שונות לסרטון שלך — עובדה מטורפת, שאלה מסקרנת, סיפור אישי, קונטרה, והבטחה. בחר מה שעובד.",
    tip: "כל פתיחה מסוג אחר — מצא את זה שמרגיש הכי אמיתי",
  },
  {
    icon: "⏰",
    title: "ניתוח שעות שיא",
    description:
      "גלה מתי הקהל הישראלי הכי פעיל — ב-Instagram, TikTok ו-YouTube. כולל התחשבות בשבת ובחגים.",
    tip: "TikTok: 19:00–23:00 ב׳–ה׳ = שעות הזהב",
  },
];

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) setOpen(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else dismiss();
  };

  const current = steps[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          dir="rtl"
        >
          <motion.div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <button
              onClick={dismiss}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition"
              aria-label="סגור"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="text-5xl mb-4">{current.icon}</div>
              <div className="flex justify-center gap-1.5 mb-4">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? "w-6 bg-blue-600" : "w-2 bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{current.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {current.description}
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 font-medium mb-6">
                💡 {current.tip}
              </div>
              <div className="flex gap-3">
                {step < steps.length - 1 ? (
                  <>
                    <button
                      onClick={dismiss}
                      className="flex-1 border-2 border-gray-200 text-gray-500 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition text-sm"
                    >
                      דלג
                    </button>
                    <button
                      onClick={next}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition text-sm"
                    >
                      הבא ←
                    </button>
                  </>
                ) : (
                  <button
                    onClick={dismiss}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition text-sm"
                  >
                    בואו נתחיל! 🚀
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
