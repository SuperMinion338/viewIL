"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "עמית כהן",
    followers: "12K עוקבים",
    color: "bg-blue-500",
    initials: "עמ",
    platform: "TikTok",
    platformColor: "bg-black text-white",
    quote:
      "לפני ViewIL הייתי מבזבז שעתיים לכתוב סקריפט אחד. עכשיו אני מקבל סקריפט מלא תוך 20 שניות שנשמע בדיוק כמוני. הצמיחה שלי בטיקטוק הלכה פי 3 מאז שהתחלתי להשתמש.",
    stars: 5,
  },
  {
    name: "נועה לוי",
    followers: "34K עוקבים",
    color: "bg-pink-500",
    initials: "נו",
    platform: "Instagram",
    platformColor: "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
    quote:
      "הכלי שעות השיא שינה לי את המשחק. פרסמתי תמיד ב-12:00 כי נוח לי — אבל האלגוריתם לא אהב. מאז שעברתי ל-19:30 לפי ההמלצות, ה-reach שלי עלה ב-40% בחודש אחד.",
    stars: 5,
  },
  {
    name: "יובל מזרחי",
    followers: "8K עוקבים",
    color: "bg-green-500",
    initials: "יו",
    platform: "YouTube",
    platformColor: "bg-red-600 text-white",
    quote:
      "הייתי עם 200 עוקבים ומוותר כמעט. ניסיתי את ViewIL כחלק אחרון — ה-hooks שהוא ייצר לי היו כל כך חזקים שהסרטון הראשון שלי הגיע ל-40K צפיות. זה שינה הכל.",
    stars: 5,
  },
  {
    name: "שירה אברהם",
    followers: "67K עוקבים",
    color: "bg-purple-500",
    initials: "שי",
    platform: "TikTok",
    platformColor: "bg-black text-white",
    quote:
      "הדבר הכי חשוב לי זה שהכל בעברית אמיתית. ניסיתי כלים באנגלית וצריך לתרגם ולשנות הכל. ViewIL כותב כמו ישראלי אמיתי — הקהל שלי לא מרגיש שזה AI.",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-amber-400 text-sm">★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section dir="rtl" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            מה אומרים היוצרים
          </h2>
          <p className="text-gray-500 text-lg">תוצאות אמיתיות מיוצרים ישראלים</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <Stars count={t.stars} />
              <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className={`${t.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.initials}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.followers}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${t.platformColor}`}>
                  {t.platform}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
