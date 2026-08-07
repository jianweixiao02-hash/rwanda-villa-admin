"use client";

import { useState, useEffect } from "react";
import { getTableData } from "@/app/lib/airtable";
import { translations, Language } from "@/app/translations";

export default function AdminCleaningPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
    getTableData("CleaningTasks").then(setData).finally(() => setLoading(false));
  }, []);

  const t = translations[language];
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.cleaning || "Cleaning"} Management</h1>
      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full"><thead className="bg-blue-600 text-white"><tr><th className="p-4">Room</th><th className="p-4">Cleaner</th><th className="p-4">Status</th></tr></thead><tbody>
            {data.map((r: any) => <tr key={r.id} className="border-b"><td className="p-4">{r.room}</td><td className="p-4">{r.cleaner}</td><td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">{r.status}</span></td></tr>)}
          </tbody></table>
        </div>
      )}
    </div>
  );
}