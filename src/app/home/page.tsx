"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
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
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{TOOL_TITLES[activeTool]}</h1>
            <p className="text-xs text-gray-400">{getHebrewDate()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">👋</span>
            <p className="text-gray-700 font-semibold text-sm">שלום, {firstName}!</p>
          </div>
        </header>

        {/* Tool content */}
        <main className="flex-1 p-6 max-w-6xl w-full">
          {renderTool()}
        </main>
      </div>
    </div>
  );
}
