"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "עמית כהן",
    followers: "12K עוקבים",
    color: "bg-blue-500",
    initials: "עמ",
    platform: "TikTok",
    quote:
      "ViewIL חסך לי שעות כל שבוע. הסקריפטים שיוצאים ממנו נשמעים בדיוק כמו שאני מדבר — לא כמו AI. אנשים שואלים אותי אם שכרתי כותב תוכן.",
    stars: 5,
  },
  {
    name: "נועה לוי",
    followers: "34K עוקבים",
    color: "bg-pink-500",
    initials: "נו",
    platform: "Instagram",
    quote:
      "מאז שהתחלתי להשתמש בכלי שעות השיא, ה-engagement שלי עלה ב-40%. פשוט מפרסמת בזמנים שהוא ממליץ ורואה את ההבדל בפועל.",
    stars: 5,
  },
  {
    name: "יובל מזרחי",
    followers: "8K עוקבים",
    color: "bg-green-500",
    initials: "יו",
    platform: "YouTube",
    quote:
      "הייתי תקוע עם הכותרות לסרטונים. עכשיו אני מקבל 5 אפשרויות בשניות ובוחר מה שהכי עובד. הקליקים עלו בצורה משמעותית.",
    stars: 5,
  },
  {
    name: "שירה אברהם",
    followers: "67K עוקבים",
    color: "bg-purple-500",
    initials: "שי",
    platform: "TikTok",
    quote:
      "הכי אהבתי שהכל בעברית אמיתית. לא צריך לתרגם, לא צריך להסביר — הכלי מבין את הקהל הישראלי ומדבר בשפה שלו.",
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
          <p className="text-gray-500 text-lg">אלפי יוצרי תוכן ישראלים כבר משתמשים ב-ViewIL</p>
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
                <div
                  className={`${t.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">
                    {t.followers} · {t.platform}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
