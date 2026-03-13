"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function DemoPreview() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section dir="rtl" ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-16"
        >
          תראה את זה בפעולה
        </motion.h2>

        <motion.div
          style={{ y }}
          className="rounded-2xl border border-gray-200 shadow-2xl shadow-blue-100 overflow-hidden"
        >
          {/* Browser chrome */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            {/* Traffic light dots */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            {/* Fake URL bar */}
            <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-left border border-gray-200 max-w-xs mx-auto">
              app.viewil.co/script-writer
            </div>
          </div>

          {/* App UI */}
          <div className="bg-white p-6 md:p-8">
            {/* Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💡 הרעיון שלך
              </label>
              <div className="border border-gray-200 rounded-xl px-4 py-3 text-gray-500 bg-gray-50 text-sm">
                רעיון: 5 טיפים לצמיחה בטיקטוק
              </div>
              <button className="mt-3 bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                צור סקריפט ✨
              </button>
            </div>

            {/* Output */}
            <div className="border border-blue-100 rounded-xl overflow-hidden">
              {/* Section: פתיחה */}
              <div className="bg-blue-50 border-b border-blue-100 px-4 py-3">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  פתיחה 🎣
                </span>
                <p className="text-sm text-gray-800 mt-1">
                  &quot;אם אתה על טיקטוק ואתה לא עושה את 5 הדברים האלה — אתה פשוט מפסיד קהל. אני הולך לשנות לך את המשחק בדקה הקרובה.&quot;
                </p>
              </div>

              {/* Section: גוף */}
              <div className="bg-white border-b border-gray-100 px-4 py-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  גוף הסרטון 📝
                </span>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  <li>• טיפ 1: פתח עם הוק חזק בשלוש השניות הראשונות</li>
                  <li>• טיפ 2: שמור על קצב מהיר — חתוך כל שתיקה</li>
                  <li>• טיפ 3: הוסף כתוביות — 80% צופים בלי קול</li>
                  <li>• טיפ 4: צלם בפורמט אנכי 9:16 בלבד</li>
                  <li>• טיפ 5: פרסם בשעות השיא — 19:00–21:00</li>
                </ul>
              </div>

              {/* Section: סיום */}
              <div className="bg-gray-50 px-4 py-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  סיום 🎬
                </span>
                <p className="text-sm text-gray-700 mt-1">
                  &quot;אם הטיפים האלה עזרו לך — שמור את הסרטון ועקוב לעוד תוכן כזה. נתראה בסרטון הבא!&quot;
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
