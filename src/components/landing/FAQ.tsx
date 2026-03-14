"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "האם ViewIL מתאים לי אם אני רק מתחיל?",
    answer:
      "בהחלט! ViewIL תוכנן במיוחד גם ליוצרים מתחילים. הכלים שלנו עוזרים לך ליצור תוכן מקצועי מהיום הראשון, בלי ניסיון קודם.",
  },
  {
    question: "באילו פלטפורמות ViewIL תומך?",
    answer:
      "ViewIL תומך באינסטגרם, טיקטוק ויוטיוב. הכלים שלנו מותאמים לכל פלטפורמה בנפרד עם המלצות ספציפיות לכל אחת.",
  },
  {
    question: "האם הסקריפטים והכלים עובדים בעברית?",
    answer:
      "כן! ViewIL הוא הכלי היחיד מסוגו שעובד בעברית מלאה. כל הסקריפטים, ההוקים והניתוחים נכתבים בעברית טבעית ומדוברת.",
  },
  {
    question: "האם המידע שלי נשמר בצורה מאובטחת?",
    answer:
      "בהחלט. כל המידע שלך מוצפן ומאובטח. אנחנו לא משתפים את הנתונים שלך עם אף גורם חיצוני. תוכל לקרוא עוד במדיניות הפרטיות שלנו.",
  },
  {
    question: "עד מתי זה חינמי?",
    answer:
      "ViewIL חינמי לגמרי ל-1,000 המשתמשים הראשונים. לאחר מכן יתווספו תוכניות תשלום — אבל מי שנרשם עכשיו יקבל הטבות מיוחדות.",
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-right hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 text-base">{item.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 mr-3"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section dir="rtl" className="py-24 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12"
        >
          שאלות נפוצות
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <FAQAccordionItem
                item={faq}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
