"use client";

import { useState, useEffect } from "react";
import { translations, Language } from "@/app/translations";

export default function AdminReportsPage() {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = translations[language];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.reports || "Reports"}</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">Revenue: $1,250</div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">Expenses: $500</div>
      </div>
    </div>
  );
}