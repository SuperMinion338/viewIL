"use client";

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/studio/Sidebar";
import MobileTopBar from "@/components/studio/MobileTopBar";
import MobileBottomNav from "@/components/studio/MobileBottomNav";
import ContentProgressManager from "@/components/studio/ContentProgressManager";

function ProgressContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("viewil_theme");
    setIsDark(theme === "dark");
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const handleSelectTool = (id: string) => {
    router.push(`/studio?tool=${id}`);
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`} dir="rtl">
      <Sidebar
        activeTool="progress"
        onSelectTool={handleSelectTool}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image}
        onThemeChange={setIsDark}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar onThemeChange={setIsDark} />

        <header className={`hidden md:flex ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} border-b px-6 py-4 items-center justify-between sticky top-0 z-10 shadow-sm`}>
          <div>
            <h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>מנהל תהליך יצירה</h1>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-400"}`}>נהל את כל התכנים שלך ממחשבה ועד פרסום</p>
          </div>
        </header>

        <main className={`flex-1 p-3 md:p-6 w-full pb-24 md:pb-6 overflow-hidden ${isDark ? "text-gray-100" : ""}`}>
          <ContentProgressManager onSelectTool={handleSelectTool} />
        </main>
      </div>

      <MobileBottomNav activeTool="progress" onSelectTool={handleSelectTool} />
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <ProgressContent />
    </Suspense>
  );
}
