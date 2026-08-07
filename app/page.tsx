"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { translations, Language } from "./translations";

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Get the correct translations based on current language
  const t = translations[language];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-100 py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
          {t.homeTitle}
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          {t.homeSubtitle}
        </p>
        <Link href="/rooms" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition inline-block">
          {t.homeCta}
        </Link>
      </section>
    </main>
  );
}