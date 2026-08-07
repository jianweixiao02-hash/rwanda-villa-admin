"use client";

import { useState, useEffect } from "react";
import { translations, Language } from "@/app/translations";

export default function AdminSettingsPage() {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = translations[language];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.settings || "Settings"}</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <p className="text-gray-700">Global system configuration.</p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800"><strong>Villa Name:</strong> Rwanda No.1 Commercial Villa</p>
          <p className="text-blue-800"><strong>Language:</strong> {language === 'en' ? 'English' : 'Chinese'}</p>
        </div>
      </div>
    </div>
  );
}