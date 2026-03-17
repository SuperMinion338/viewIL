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
import OnboardingModal from "@/components/studio/OnboardingModal";
import ViralScoreAnalyzer from "@/components/studio/ViralScoreAnalyzer";
import CaptionWriter from "@/components/studio/CaptionWriter";
import BioGenerator from "@/components/studio/BioGenerator";
import Dashboard from "@/components/studio/Dashboard";
import RepurposeTool from "@/components/studio/RepurposeTool";
import ContentProgressManager from "@/components/studio/ContentProgressManager";
import MobileTopBar from "@/components/studio/MobileTopBar";
import MobileBottomNav from "@/components/studio/MobileBottomNav";

const TOOL_TITLES: Record<string, string> = {
  dashboard:   "דשבורד",
  script:      "כותב סקריפטים",
  hooks:       "יוצר הוקים",
  repurpose:   "שינוי פורמט תוכן",
  progress:    "מנהל תהליך יצירה",
  viral:       "ניתוח פוטנציאל ויראלי",
  caption:     "כותב קפשן חכם",
  bio:         "יוצר ביו",
  calendar:    "לוח תוכן",
  time:        "ניתוח שעות שיא",
  performance: "ניתוח ביצועים",
};

function getHebrewDate(): string {
  return new Date().toLocaleDateString("he-IL", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function StudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState(searchParams.get("tool") ?? "dashboard");
  const { data: session } = useSession();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("viewil_theme");
    const dark = theme === "dark";
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const tool = searchParams.get("tool") ?? "dashboard";
    setActiveTool(tool);
  }, [searchParams]);

  const selectTool = (id: string) => {
    setActiveTool(id);
    router.push(`/studio?tool=${id}`, { scroll: false });
  };

  const firstName = session?.user?.name?.split(" ")[0] || "יוצר";

  const renderTool = () => {
    switch (activeTool) {
      case "dashboard":   return <Dashboard userName={session?.user?.name} onSelectTool={selectTool} />;
      case "script":      return <ScriptWriter />;
      case "hooks":       return <HookGenerator />;
      case "repurpose":   return <RepurposeTool />;
      case "progress":    return <ContentProgressManager onSelectTool={selectTool} />;
      case "viral":       return <ViralScoreAnalyzer />;
      case "caption":     return <CaptionWriter />;
      case "bio":         return <BioGenerator />;
      case "calendar":    return <ContentCalendar />;
      case "time":        return <TimeAnalyzer />;
      case "performance": return <PerformanceAnalyzer />;
      default:            return <Dashboard userName={session?.user?.name} onSelectTool={selectTool} />;
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? "dark bg-gray-900" : "bg-gray-50"}`} dir="rtl">
      <OnboardingModal />
      <Sidebar
        activeTool={activeTool}
        onSelectTool={selectTool}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image}
        onThemeChange={setIsDark}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar onThemeChange={setIsDark} />
        <header className={`hidden md:flex ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-100"} border-b px-4 md:px-6 py-4 items-center justify-between sticky top-0 z-10 shadow-sm`}>
          <div>
            <h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>{TOOL_TITLES[activeTool] || "סטודיו"}</h1>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}>{getHebrewDate()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👋</span>
            <p className={`font-semibold text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>שלום, {firstName}!</p>
          </div>
        </header>

        <main className={`flex-1 p-3 md:p-6 max-w-6xl w-full pb-20 md:pb-6 overflow-x-hidden ${isDark ? "text-gray-100" : ""}`}>
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
      <MobileBottomNav activeTool={activeTool} onSelectTool={selectTool} />
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
