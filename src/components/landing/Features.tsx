"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "✍️",
    title: "כותב סקריפטים",
    description: "רושם רעיון, מקבל סקריפט מלא",
  },
  {
    icon: "🎣",
    title: "מחולל פתיחות",
    description: "5 פתיחות מנצחות לכל סרטון",
  },
  {
    icon: "📅",
    title: "לוח תוכן",
    description: "לוח חודשי שמכיר שבת וחגים",
  },
  {
    icon: "⏰",
    title: "ניתוח שעות שיא",
    description: "שעות השיא של הקהל הישראלי",
  },
  {
    icon: "📊",
    title: "ניתוח ביצועים",
    description: "מה עבד, מה לא — בעברית",
  },
  {
    icon: "₪",
    title: "ניהול הכנסות",
    description: "עקוב אחרי הכנסות מספונסרים, אפיליאציה ולייבים — עם גרפים וסיכומים חודשיים",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" dir="rtl" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-16"
        >
          כל מה שצריך כדי לגדול
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:scale-105 transition-all cursor-default"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
