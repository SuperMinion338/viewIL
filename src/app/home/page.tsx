"use client";

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
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

function getHebrewDate(): string {
  return new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState(searchParams.get("tool") ?? "script");
  const { data: session } = useSession();

  useEffect(() => {
    const tool = searchParams.get("tool") ?? "script";
    setActiveTool(tool);
  }, [searchParams]);

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
        onSelectTool={(id) => { setActiveTool(id); router.push(`/home?tool=${id}`, { scroll: false }); }}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image}
      />

      <div className="flex-1 flex flex-col min-w-0">
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
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}
