"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Zap, Calendar, Clock, BarChart2 } from "lucide-react";
import Sidebar from "@/components/studio/Sidebar";
import ScriptWriter from "@/components/studio/ScriptWriter";
import HookGenerator from "@/components/studio/HookGenerator";
import ContentCalendar from "@/components/studio/ContentCalendar";
import TimeAnalyzer from "@/components/studio/TimeAnalyzer";
import PerformanceAnalyzer from "@/components/studio/PerformanceAnalyzer";

const TOOL_TITLES: Record<string, string> = {
  script: "כותב סקריפטים",
  hooks: "מחולל פתיחות",
  calendar: "לוח תוכן",
  time: "ניתוח שעות שיא",
  performance: "ניתוח ביצועים",
};

const tools = [
  { id: "script", icon: FileText, label: "סקריפטים" },
  { id: "hooks", icon: Zap, label: "פתיחות" },
  { id: "calendar", icon: Calendar, label: "לוח תוכן" },
  { id: "time", icon: Clock, label: "שעות שיא" },
  { id: "performance", icon: BarChart2, label: "ביצועים" },
];

function getHebrewDate(): string {
  return new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StudioPage() {
  const [activeTool, setActiveTool] = useState("script");
  const { data: session } = useSession();

  const firstName = session?.user?.name?.split(" ")[0] || "יוצר";

  const renderTool = () => {
    switch (activeTool) {
      case "script": return <ScriptWriter />;
      case "hooks": return <HookGenerator />;
      case "calendar": return <ContentCalendar />;
      case "time": return <TimeAnalyzer />;
      case "performance": return <PerformanceAnalyzer />;
      default: return <ScriptWriter />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-base md:text-lg font-bold text-gray-800">{TOOL_TITLES[activeTool]}</h1>
            <p className="text-xs text-gray-400 hidden sm:block">{getHebrewDate()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👋</span>
            <p className="text-gray-700 font-semibold text-sm">שלום, {firstName}!</p>
          </div>
        </header>

        {/* Tool content */}
        <main className="flex-1 p-3 md:p-6 max-w-6xl w-full pb-20 md:pb-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              {renderTool()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 flex md:hidden z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        {tools.map(({ id, icon: Icon, label }) => {
          const isActive = activeTool === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
              <span className={`text-[10px] font-medium leading-none ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-6 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
