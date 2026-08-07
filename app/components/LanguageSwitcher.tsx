"use client";

import { useState, useEffect } from "react";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<"en" | "zh">("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "zh" | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = (lang: "en" | "zh") => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border border-gray-200">
      <button
        onClick={() => toggleLanguage("en")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition ${
          language === "en" 
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => toggleLanguage("zh")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition ${
          language === "zh" 
            ? "bg-blue-600 text-white shadow-sm" 
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        中文
      </button>
    </div>
  );
}