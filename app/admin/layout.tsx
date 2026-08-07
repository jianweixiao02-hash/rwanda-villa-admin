"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar key={language} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Clean Admin Header */}
        <header className="bg-white shadow-sm p-4 flex justify-end items-center pr-8">
          <LanguageSwitcher />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}