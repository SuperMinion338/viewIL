"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { feature: "100% בעברית", viewil: true, others: false },
  { feature: "מותאם לקהל ישראלי", viewil: true, others: false },
  { feature: "מודע לשבת וחגים", viewil: true, others: false },
  { feature: "כותב סקריפטים לסרטון", viewil: true, others: "חלקי" },
  { feature: "יוצר הוקים ויראלים", viewil: true, others: true },
  { feature: "ניתוח שעות שיא ישראל", viewil: true, others: false },
  { feature: "ניתוח ציון ויראלי", viewil: true, others: false },
  { feature: "כותב קפשן + האשטאגים", viewil: true, others: "חלקי" },
  { feature: "יוצר ביו לפרופיל", viewil: true, others: false },
  { feature: "לוח תוכן חודשי", viewil: true, others: "חלקי" },
  { feature: "ללא כרטיס אשראי", viewil: true, others: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-red-400 mx-auto" />;
  return <span className="text-xs text-amber-600 font-medium">{value}</span>;
}

export default function ComparisonTable() {
  return (
    <section dir="rtl" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            למה ViewIL?
          </h2>
          <p className="text-gray-500 text-lg">הכלי הישראלי היחיד שבנוי בשביל יוצרי תוכן ישראלים</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="py-4 px-5 text-sm font-bold text-gray-600">תכונה</div>
            <div className="py-4 px-4 text-center">
              <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                ViewIL 🇮🇱
              </span>
            </div>
            <div className="py-4 px-4 text-sm font-bold text-gray-400 text-center">כלים אחרים</div>
          </div>

          {/* Rows */}
          {features.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <div className="py-3 px-5 text-sm text-gray-700">{row.feature}</div>
              <div className="py-3 px-4 flex items-center justify-center">
                <Cell value={row.viewil} />
              </div>
              <div className="py-3 px-4 flex items-center justify-center">
                <Cell value={row.others} />
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-full text-lg transition-all shadow-lg hover:shadow-blue-200 hover:shadow-xl"
          >
            התחל בחינם — ללא כרטיס אשראי
          </a>
        </motion.div>
      </div>
    </section>
  );
}
