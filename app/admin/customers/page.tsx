"use client";

import { useState, useEffect } from "react";
import { getTableData } from "@/app/lib/airtable";
import { translations, Language } from "@/app/translations";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
    
    async function fetchData() {
      const data = await getTableData("Customers");
      setCustomers(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const t = translations[language];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.customers || "Customers"} Management</h1>

      {loading ? (
        <p className="text-gray-500">Loading customers from Airtable...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Country</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td className="p-4 text-center text-gray-500" colSpan={5}>No customers found in database.</td></tr>
              ) : (
                customers.map((c: any) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{c.name || "Unknown"}</td>
                    <td className="p-4">{c.email || "N/A"}</td>
                    <td className="p-4">{c.phone || "N/A"}</td>
                    <td className="p-4">{c.country || "N/A"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        c.status === "Active" ? "bg-green-100 text-green-700" :
                        c.status === "VIP" ? "bg-purple-100 text-purple-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {c.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}