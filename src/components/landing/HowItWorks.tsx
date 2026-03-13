"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "נרשמים בחינם",
    description: "אין צורך בכרטיס אשראי",
  },
  {
    number: "02",
    title: "בוחרים כלי",
    description: "סקריפט, הוק, לוח תוכן",
  },
  {
    number: "03",
    title: "יוצרים תוכן",
    description: "בעברית, בשניות",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section dir="rtl" className="py-24 bg-blue-50">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-16"
        >
          איך זה עובד?
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Dotted line (desktop only) */}
          <div className="hidden md:block absolute top-10 right-[12%] left-[12%] border-dashed border-t-2 border-blue-200 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className="relative z-10 flex flex-col items-center text-center flex-1"
            >
              <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center shadow-md mb-4">
                <span className="text-blue-600 text-2xl font-extrabold">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
