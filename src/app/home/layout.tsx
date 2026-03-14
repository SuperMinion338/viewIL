"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FileText, Zap, Calendar, Clock, BarChart2, TrendingUp, User } from "lucide-react";

const toolItems = [
  { id: "script",      href: "/home?tool=script",      label: "סקריפטים", icon: FileText   },
  { id: "hooks",       href: "/home?tool=hooks",       label: "פתיחות",   icon: Zap        },
  { id: "calendar",    href: "/home?tool=calendar",    label: "לוח תוכן", icon: Calendar   },
  { id: "time",        href: "/home?tool=time",        label: "שעות שיא", icon: Clock      },
  { id: "performance", href: "/home?tool=performance", label: "ביצועים",  icon: BarChart2  },
  { id: "income",      href: "/home/income",           label: "הכנסות",   icon: TrendingUp },
  { id: "profile",     href: "/home/profile",          label: "פרופיל",   icon: User       },
];

function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTool = searchParams.get("tool") ?? "script";

  return (
    <nav
      className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 flex md:hidden z-50 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
      dir="rtl"
    >
      {toolItems.map(({ id, href, label, icon: Icon }) => {
        const isToolItem = href.startsWith("/home?tool=");
        const isActive = isToolItem
          ? pathname === "/home" && activeTool === id
          : pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={id}
            href={href}
            className={`relative flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
              isActive ? "text-blue-600" : "text-gray-400"
            }`}
          >
            {isActive && (
              <span className="absolute top-0 inset-x-1/4 h-0.5 bg-blue-600 rounded-full" />
            )}
            <Icon className="w-[18px] h-[18px]" />
            <span className="text-[9px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>
    </>
  );
}
