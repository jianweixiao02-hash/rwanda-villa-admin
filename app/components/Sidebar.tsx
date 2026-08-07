"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { translations, Language } from "@/app/translations";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = translations[language];

  // 🚀 THE LOGOUT LOGIC
  const handleLogout = () => {
    // 1. Delete the admin authentication cookie
    document.cookie = "admin_session=; path=/; max-age=0;";
    // 2. Redirect the user to the public home page
    router.push("/");
  };

  const menuItems = [
    { name: t.dashboard, href: "/admin" },
    { name: t.financials, href: "/admin/financials" },
    { name: t.bookings, href: "/admin/bookings" },
    { name: t.rooms, href: "/admin/rooms" },
    { name: t.customers, href: "/admin/customers" },
    { name: t.employees, href: "/admin/employees" },
    { name: t.cleaning, href: "/admin/cleaning" },
    { name: t.maintenance, href: "/admin/maintenance" },
    { name: t.knowledgeBase, href: "/admin/knowledge-base" },
    { name: t.aiAssistant, href: "/admin/ai" },
    { name: t.reports, href: "/admin/reports" },
    { name: t.settings, href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-blue-800">
        <h1 className="text-2xl font-bold">Rwanda No.1</h1>
        <p className="text-sm text-blue-300">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-800 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 👇 LOGOUT BUTTON ADDED AT THE BOTTOM 👇 */}
      <div className="p-4 border-t border-blue-800 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-medium transition text-center"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}