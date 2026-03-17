"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, Zap, Calendar, BarChart3, User, X, TrendingUp, MessageSquare, UserCircle2, RefreshCw, Clock, CircleDollarSign, BarChart2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MobileBottomNavProps {
  activeTool?: string;
  onSelectTool?: (id: string) => void;
}

const MAIN_ITEMS = [
  { id: "home",     label: "בית",    icon: Home,     href: "/studio",          isRoute: true },
  { id: "script",   label: "סקריפט", icon: FileText, href: "/studio?tool=script", isRoute: false },
  { id: "hooks",    label: "הוקים",  icon: Zap,      href: "/studio?tool=hooks",  isRoute: false },
  { id: "calendar", label: "לוח",    icon: Calendar, href: "/studio?tool=calendar", isRoute: false },
  { id: "progress", label: "התקדמות",icon: BarChart3, href: "/studio/progress", isRoute: true },
  { id: "profile",  label: "פרופיל", icon: User,     href: "/studio/profile",  isRoute: true },
];

const MORE_TOOLS = [
  { id: "viral",       label: "ניתוח ויראלי",  icon: TrendingUp,      emoji: "🔥" },
  { id: "caption",     label: "כותב קפשן",     icon: MessageSquare,   emoji: "📝" },
  { id: "bio",         label: "יוצר ביו",      icon: UserCircle2,     emoji: "👤" },
  { id: "repurpose",   label: "שינוי פורמט",   icon: RefreshCw,       emoji: "🔄" },
  { id: "time",        label: "שעות שיא",      icon: Clock,           emoji: "⏰" },
  { id: "performance", label: "ניתוח ביצועים", icon: BarChart2,       emoji: "📊" },
  { id: "income",      label: "הכנסות",        icon: CircleDollarSign, emoji: "💰", href: "/studio/income" },
];

export default function MobileBottomNav({ activeTool, onSelectTool }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (item: typeof MAIN_ITEMS[0]) => {
    if (item.id === "home") return pathname === "/studio" && !activeTool;
    if (item.isRoute) return pathname === item.href;
    return activeTool === item.id && pathname === "/studio";
  };

  const handleToolClick = (id: string) => {
    if (onSelectTool) {
      onSelectTool(id);
    } else {
      router.push(`/studio?tool=${id}`);
    }
  };

  return (
    <>
      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden"
        style={{ background: "linear-gradient(0deg, #0F172A 0%, #1E3A5F 100%)" }}
        dir="rtl"
      >
        <div className="flex items-center justify-around px-2 pb-safe-area-inset-bottom">
          {MAIN_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isRoute) {
                    router.push(item.href);
                  } else {
                    handleToolClick(item.id);
                  }
                }}
                className={`flex flex-col items-center gap-0.5 py-2 px-1 min-w-[48px] min-h-[56px] justify-center transition-all ${
                  active ? "text-blue-400" : "text-white/40"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-blue-400" : ""}`} />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                {active && <span className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-0.5 py-2 px-1 min-w-[48px] min-h-[56px] justify-center text-white/40"
          >
            <span className="text-lg leading-none">⋯</span>
            <span className="text-[10px] font-medium">עוד</span>
          </button>
        </div>
      </nav>

      {/* More tools bottom sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl md:hidden"
              style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E3A5F 100%)" }}
              dir="rtl"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h3 className="text-white font-bold text-base">כל הכלים</h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3 px-4 pb-8">
                {MORE_TOOLS.map(({ id, label, emoji, href }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setMoreOpen(false);
                      if (href) {
                        router.push(href);
                      } else {
                        handleToolClick(id);
                      }
                    }}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl bg-white/8 hover:bg-white/15 transition active:scale-95"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-white/80 text-xs font-medium text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
