"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Bell } from "lucide-react";
import { useState, useEffect } from "react";

interface MobileTopBarProps {
  onThemeChange?: (isDark: boolean) => void;
}

export default function MobileTopBar({ onThemeChange }: MobileTopBarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("viewil_theme");
    setIsDark(theme === "dark");
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("viewil_theme", next ? "dark" : "light");
    onThemeChange?.(next);
  };

  return (
    <header
      className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3"
      style={{ background: "linear-gradient(90deg, #0F172A 0%, #1E3A5F 100%)" }}
      dir="rtl"
    >
      {/* Logo (right side in RTL) */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo-transparent.png" alt="ViewIL" width={28} height={28} className="shrink-0" />
        <span className="text-white text-sm font-bold tracking-wide">ViewIL</span>
      </Link>

      {/* Actions (left side in RTL) */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-95 transition relative">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
