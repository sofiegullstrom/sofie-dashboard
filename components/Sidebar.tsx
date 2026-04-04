"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  CalendarRange,
  ShoppingBag,
  Home,
  Gavel,
  Leaf,
  Dices,
  AtSign,
  FileText,
  Lightbulb,
  LogOut,
  Sparkles,
} from "lucide-react";

const nav = [
  {
    section: "Tid",
    items: [
      { label: "Idag", href: "/admin", icon: CalendarDays },
      { label: "Vecka", href: "/admin/vecka", icon: CalendarRange },
    ],
  },
  {
    section: "Projekt",
    items: [
      { label: "Pepper Deals", href: "/admin/pepper-deals", icon: ShoppingBag },
      { label: "HomesForYou", href: "/admin/homes-for-you", icon: Home },
      { label: "GavelDal", href: "/admin/gavelsdal", icon: Gavel },
      { label: "Great Earth", href: "/admin/great-earth", icon: Leaf },
      { label: "PrimeBets", href: "/admin/prime-bets", icon: Dices },
    ],
  },
  {
    section: "Innehåll",
    items: [
      { label: "Sociala medier", href: "/admin/sociala-medier", icon: AtSign },
      { label: "Content plan", href: "/admin/content-plan", icon: FileText },
      { label: "Idébank", href: "/admin/ideabank", icon: Lightbulb },
    ],
  },
  {
    section: "Team",
    items: [
      {
        label: "Sara",
        href: "/admin/sara",
        color: "bg-pink-200 text-pink-700",
        avatar: "👩‍💼",
      },
      {
        label: "Clara",
        href: "/admin/clara",
        color: "bg-purple-200 text-purple-700",
        avatar: "👩‍🎨",
      },
      {
        label: "Max",
        href: "/admin/max",
        color: "bg-blue-200 text-blue-700",
        avatar: "👨‍💻",
      },
      {
        label: "Gustav",
        href: "/admin/gustav",
        color: "bg-mint-200 text-emerald-700",
        avatar: "🧑‍📊",
      },
    ],
  },
];

const projectColors: Record<string, string> = {
  "/admin/pepper-deals": "text-orange-500",
  "/admin/homes-for-you": "text-blue-500",
  "/admin/gavelsdal": "text-amber-600",
  "/admin/great-earth": "text-emerald-600",
  "/admin/prime-bets": "text-violet-600",
  "/admin/sociala-medier": "text-pink-500",
  "/admin/content-plan": "text-indigo-500",
  "/admin/ideabank": "text-yellow-500",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/login");
  }

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-purple-50 flex flex-col py-6 px-3 shadow-sm">
      <div className="flex items-center gap-2 px-3 mb-8">
        <Sparkles size={20} className="text-purple-400" />
        <span className="font-bold text-purple-900 text-lg">Sofie</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-hide">
        {nav.map((section) => (
          <div key={section.section}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-300 px-3 mb-1">
              {section.section}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                if ("avatar" in item) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-purple-50 text-purple-700"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                      >
                        <span className="text-base">{item.avatar}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                }

                const Icon = (item as { icon: React.ElementType }).icon;
                const colorClass = projectColors[item.href] || "text-purple-500";

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={isActive ? "text-purple-500" : colorClass}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all mt-4 mx-0"
      >
        <LogOut size={14} />
        Logga ut
      </button>
    </aside>
  );
}
