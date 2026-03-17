"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FileText, Zap, Calendar, Clock, BarChart2, LogOut,
  ChevronLeft, ChevronDown, User, CircleDollarSign, TrendingUp, MessageSquare,
  UserCircle2, LayoutDashboard, RefreshCw, Moon, Sun, BarChart3,
} from "lucide-react";

// ─── Navigation structure ─────────────────────────────────────────────────────

type NavTool = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isNew: boolean;
  isLink: boolean;
  href?: string;
};

type NavCategory = {
  key: string;
  label: string;
  tools: NavTool[];
};

const DASHBOARD_ITEM: NavTool = { id: "dashboard", icon: LayoutDashboard, label: "דשבורד", isNew: false, isLink: false };

const CATEGORIES: NavCategory[] = [
  {
    key: "creation",
    label: "יצירה",
    tools: [
      { id: "script",    icon: FileText,      label: "כותב סקריפטים", isNew: false, isLink: false },
      { id: "hooks",     icon: Zap,           label: "יוצר הוקים",    isNew: false, isLink: false },
      { id: "repurpose", icon: RefreshCw,     label: "שינוי פורמט",   isNew: false, isLink: false },
      { id: "caption",   icon: MessageSquare, label: "כותב קפשן",     isNew: false, isLink: false },
      { id: "bio",       icon: UserCircle2,   label: "יוצר ביו",      isNew: false, isLink: false },
    ],
  },
  {
    key: "management",
    label: "ניהול",
    tools: [
      { id: "calendar", icon: Calendar,        label: "לוח תוכן",      isNew: false, isLink: false },
      { id: "progress", icon: BarChart3,        label: "מנהל יצירה",   isNew: true,  isLink: true,  href: "/studio/progress" },
      { id: "income",   icon: CircleDollarSign, label: "ניהול הכנסות", isNew: false, isLink: true,  href: "/studio/income" },
      { id: "profile",  icon: User,             label: "פרופיל",       isNew: false, isLink: true,  href: "/studio/profile" },
    ],
  },
  {
    key: "analysis",
    label: "ניתוח",
    tools: [
      { id: "performance", icon: BarChart2,  label: "ניתוח ביצועים",  isNew: false, isLink: false },
      { id: "viral",       icon: TrendingUp, label: "ניתוח ויראליות", isNew: false, isLink: false },
      { id: "time",        icon: Clock,      label: "שעות שיא",       isNew: false, isLink: false },
    ],
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeTool: string;
  onSelectTool: (id: string) => void;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  onThemeChange?: (isDark: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ activeTool, onSelectTool, userName, userEmail, userImage, onThemeChange }: SidebarProps) {
  const pathname = usePathname();
  const isStandalonePage = pathname !== "/studio";
  const [scriptsThisMonth, setScriptsThisMonth] = useState<number | null>(null);
  const [seenBadges, setSeenBadges] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const theme = localStorage.getItem("viewil_theme");
    if (theme === "dark") setIsDark(true);

    // Load seen badges
    const seen = new Set<string>();
    CATEGORIES.forEach((cat) => {
      cat.tools.forEach(({ id }) => {
        if (localStorage.getItem(`viewil_seen_new_${id}`) === "1") seen.add(id);
      });
    });
    setSeenBadges(seen);

    // Load collapsed state
    const stored: Record<string, boolean> = {};
    CATEGORIES.forEach(({ key }) => {
      const val = localStorage.getItem(`viewil_sidebar_${key}_collapsed`);
      if (val === "1") stored[key] = true;
    });
    setCollapsed(stored);

    fetch("/api/user-stats")
      .then((r) => r.json())
      .then((d) => { if (typeof d.scriptsThisMonth === "number") setScriptsThisMonth(d.scriptsThisMonth); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectTool = (id: string) => {
    if (!seenBadges.has(id)) {
      localStorage.setItem(`viewil_seen_new_${id}`, "1");
      setSeenBadges((prev) => new Set(Array.from(prev).concat(id)));
    }
    onSelectTool(id);
  };

  const toggleCategory = (key: string) => {
    setCollapsed((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`viewil_sidebar_${key}_collapsed`, next[key] ? "1" : "0");
      return next;
    });
  };

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("viewil_theme", next ? "dark" : "light");
    onThemeChange?.(next);
  };

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "יצ";

  const isToolActive = (id: string) => !isStandalonePage && activeTool === id;
  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className="w-60 shrink-0 hidden md:flex flex-col h-screen sticky top-0 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E3A5F 100%)" }}
      dir="rtl"
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo-transparent.png" alt="ViewIL" width={32} height={32} className="shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-white text-sm font-bold tracking-wide">ViewIL Studio</span>
            <span className="text-white/50 text-[11px] font-medium">סטודיו יוצרים</span>
          </div>
          <ChevronLeft className="w-3 h-3 text-white/20 group-hover:text-white/50 transition mr-auto" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {/* Dashboard — standalone */}
        {(() => {
          const isActive = isToolActive(DASHBOARD_ITEM.id);
          const Icon = DASHBOARD_ITEM.icon;
          return (
            <button
              onClick={() => handleSelectTool(DASHBOARD_ITEM.id)}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right mb-2 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.45)]"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
              <span className="flex-1">{DASHBOARD_ITEM.label}</span>
              {isActive && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-white/60" />}
            </button>
          );
        })()}

        {/* Categories */}
        {CATEGORIES.map((cat) => {
          const isCollapsed = collapsed[cat.key];
          return (
            <div key={cat.key} className="mb-1">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.key)}
                className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-white/30 hover:text-white/60 transition group"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">{cat.label}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                />
              </button>

              {/* Category tools */}
              {!isCollapsed && (
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {cat.tools.map(({ id, icon: Icon, label, isNew, isLink, href }) => {
                    const isActive = isLink && href
                      ? isLinkActive(href)
                      : isToolActive(id);
                    const showBadge = isNew && !seenBadges.has(id) && !isActive;

                    if (isLink && href) {
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
                          <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
                          <span className="flex-1">{label}</span>
                          {showBadge && (
                            <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full leading-none">חדש</span>
                          )}
                          {isActive && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-white/60" />}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={id}
                        onClick={() => handleSelectTool(id)}
                        className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-right group ${
                          isActive
                            ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.45)]"
                            : "text-white/55 hover:text-white hover:bg-white/8"
                        }`}
                      >
                        <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
                        <span className="flex-1">{label}</span>
                        {showBadge && (
                          <span className="text-[9px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full leading-none">חדש</span>
                        )}
                        {isActive && <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-white/60" />}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-2 border-t border-white/8" />
            </div>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-white/8">
        <Link href="/studio/profile" className="flex items-center gap-3 px-2 mb-3 hover:bg-white/5 rounded-xl py-1.5 transition">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-[0_0_12px_rgba(37,99,235,0.4)] overflow-hidden">
            {userImage ? (
              <Image src={userImage} alt="אווטר" width={36} height={36} className="object-cover w-full h-full" unoptimized />
            ) : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{userName || "יוצר תוכן"}</p>
            <p className="text-white/35 text-xs truncate">{userEmail || "פלן חינמי"}</p>
          </div>
        </Link>

        {scriptsThisMonth !== null && (
          <div className="mb-2 px-3 py-2 rounded-xl bg-white/5 text-white/40 text-xs text-center">
            השתמשת ב-<span className="text-white/70 font-bold">{scriptsThisMonth}</span> סקריפטים החודש
          </div>
        )}

        <button
          onClick={toggleDark}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-white/45 hover:text-white hover:bg-white/8 transition-all duration-200 text-sm font-medium group mb-1"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 group-hover:text-blue-300 transition-colors" />}
          <span>{isDark ? "מצב יום" : "מצב לילה"}</span>
        </button>

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
