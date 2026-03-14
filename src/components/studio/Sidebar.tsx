"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FileText,
  Zap,
  Calendar,
  Clock,
  BarChart2,
  LogOut,
  ChevronLeft,
  User,
  CircleDollarSign,
} from "lucide-react";

const tools = [
  { id: "script", icon: FileText, label: "כותב סקריפטים" },
  { id: "hooks", icon: Zap, label: "מחולל פתיחות" },
  { id: "calendar", icon: Calendar, label: "לוח תוכן" },
  { id: "time", icon: Clock, label: "שעות שיא" },
  { id: "performance", icon: BarChart2, label: "ניתוח ביצועים" },
];

// Standalone pages linked from sidebar (not studio tools)
const standalonePages = [
  { href: "/studio/income", id: "income", icon: CircleDollarSign, label: "הכנסות" },
  { href: "/studio/profile", id: "profile", icon: User, label: "הפרופיל שלי" },
];

interface SidebarProps {
  activeTool: string;
  onSelectTool: (id: string) => void;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

export default function Sidebar({
  activeTool,
  onSelectTool,
  userName,
  userEmail,
  userImage,
}: SidebarProps) {
  const pathname = usePathname();
  const isStandalonePage = pathname !== "/studio";

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "יצ";

  return (
    <aside
      className="w-60 shrink-0 hidden md:flex flex-col h-screen sticky top-0 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0F172A 0%, #1E3A5F 100%)",
      }}
      dir="rtl"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo-transparent.png" alt="ViewIL" width={32} height={32} className="shrink-0" />
          <ChevronLeft className="w-3 h-3 text-white/20 group-hover:text-white/50 transition mr-auto" />
        </Link>
        <p className="text-white/70 text-xs mt-1 font-semibold tracking-wide">סטודיו יוצרים</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
          כלים
        </p>
        {tools.map(({ id, icon: Icon, label }) => {
          const isActive = !isStandalonePage && activeTool === id;
          return (
            <button
              key={id}
              onClick={() => onSelectTool(id)}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right group ${
                isActive
                  ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.45)]"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                }`}
              />
              <span>{label}</span>
              {isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-white/60" />
              )}
            </button>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-white/8" />

        <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
          חשבון
        </p>

        {standalonePages.map(({ href, id, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={id}
              href={href}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.45)]"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                }`}
              />
              <span>{label}</span>
              {isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/8">
        <Link
          href="/studio/profile"
          className="flex items-center gap-3 px-2 mb-3 hover:bg-white/5 rounded-xl py-1.5 transition"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-[0_0_12px_rgba(37,99,235,0.4)] overflow-hidden">
            {userImage ? (
              <Image src={userImage} alt="אווטר" width={36} height={36} className="object-cover w-full h-full" unoptimized />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {userName || "יוצר תוכן"}
            </p>
            <p className="text-white/35 text-xs truncate">{userEmail || "פלן חינמי"}</p>
          </div>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-white/45 hover:text-white hover:bg-white/8 transition-all duration-200 text-sm font-medium group"
        >
          <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
          <span>יציאה</span>
        </button>
      </div>
    </aside>
  );
}
