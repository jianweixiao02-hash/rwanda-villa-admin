"use client";

import { useState, useEffect } from "react";
import { translations, Language } from "@/app/translations";

export default function AdminKnowledgeBasePage() {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = translations[language];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.knowledgeBase || "Knowledge Base"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">SOP-001: Daily Floor Mopping</div>
        <div className="bg-white p-4 rounded shadow">Price List: Monthly Rental Rates</div>
      </div>
    </div>
  );
}