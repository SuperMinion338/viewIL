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
    question: "האם יש ניסיון חינם?",
    answer:
      "כן! הפלן החינמי כולל גישה לכותב הסקריפטים עם מגבלה של 5 סקריפטים בחודש ו-3 פתיחות. אין צורך בכרטיס אשראי.",
  },
  {
    question: "האם הכלים עובדים עם TikTok ואינסטגרם?",
    answer:
      "בהחלט. הכלים שלנו מותאמים לכל הפלטפורמות הגדולות — TikTok, אינסטגרם, יוטיוב וגם פייסבוק.",
  },
  {
    question: "האם אפשר לבטל בכל עת?",
    answer:
      "כן, ניתן לבטל את המנוי בכל עת ללא קנסות. הביטול ייכנס לתוקף בסוף תקופת החיוב הנוכחית.",
  },
  {
    question: "האם הסקריפטים נשמרים?",
    answer:
      "כן! כל הסקריפטים וההוקים שיצרת נשמרים בחשבונך ונגישים בכל עת מכל מכשיר.",
  },
  {
    question: "מה ההבדל בין חינם לפרו?",
    answer:
      "הפלן החינמי מוגבל בכמות הכלים. הפלן הפרו מאפשר שימוש ללא הגבלה בכל הכלים, כולל ניתוח ביצועים מתקדם ותמיכה מועדפת.",
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
