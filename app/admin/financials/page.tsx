"use client";

import { useEffect, useState } from "react";
import { getTableData } from "@/app/lib/airtable";
import { translations, Language } from "@/app/translations";

export default function FinancialsPage() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");
  
  // Financial State
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [expensesBreakdown, setExpensesBreakdown] = useState<{[key: string]: number}>({});
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);

    async function fetchFinancials() {
      try {
        // 1. Fetch Bookings (For Revenue)
        const bookings = await getTableData("Bookings");
        const revenue = bookings
          .filter((b: any) => b.status === "Completed" || b.status === "Confirmed")
          .reduce((sum: number, b: any) => sum + (b.total || 0), 0);
        setTotalRevenue(revenue);

        // 2. Fetch Expenses (Break it down by Category)
        const expenseData = await getTableData("Expenses");
        const breakdown: {[key: string]: number} = {};
        expenseData.forEach((exp: any) => {
          const cat = exp.category || "Other";
          breakdown[cat] = (breakdown[cat] || 0) + (exp.amount || 0);
        });
        setExpensesBreakdown(breakdown);

        // 3. Fetch Partners (For calculating the split)
        const partnerData = await getTableData("Partners");
        setPartners(partnerData);

      } catch (error) {
        console.error("Failed to load financials", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFinancials();
  }, []);

  const t = translations[language];
  
  // Calculate Totals
  const totalExpenses = Object.values(expensesBreakdown).reduce((a, b) => a + b, 0);
  const netProfit = totalRevenue - totalExpenses;

  // Expense Mapping to Display Names (Matches your Document)
  const expenseLabels: {[key: string]: string} = {
    "Rent": "EXP-001: Rent",
    "Utilities": "EXP-002: Utilities",
    "Material": "EXP-003: Material Costs",
    "Partner Salary": "EXP-004: Partner Base Salary",
    "Brand Fee": "EXP-005: Brand License Fee (5%)",
    "Advertising": "EXP-007: Advertising",
    "OpEx": "EXP-008: Operating Expenses",
    "Maintenance Reserve": "EXP-009: Maintenance Reserve (3%)",
    "Other": "Other Expenses"
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💰 Financials & Partner Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Calculating real-time financials from Airtable...</p>
      ) : (
        <div className="space-y-8">
          
          {/* 1. Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-lg text-gray-500">Total Revenue (REV)</h2>
              <p className="text-4xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-lg text-gray-500">Total Expenses (EXP)</h2>
              <p className="text-4xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-500">
              <h2 className="text-lg text-gray-500">Net Profit</h2>
              <p className="text-4xl font-bold text-blue-700">${netProfit.toLocaleString()}</p>
            </div>
          </div>

          {/* 2. Detailed Expenses Breakdown (EXP-001 to EXP-010) */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">📊 Expense Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="p-3 text-left font-bold text-gray-700">Account Code</th>
                    <th className="p-3 text-right font-bold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(expensesBreakdown).length === 0 ? (
                    <tr><td colSpan={2} className="p-4 text-center text-gray-500">No expenses recorded yet.</td></tr>
                  ) : (
                    Object.entries(expensesBreakdown).map(([cat, amt]) => (
                      <tr key={cat} className="border-b">
                        <td className="p-3">{expenseLabels[cat] || cat}</td>
                        <td className="p-3 text-right font-medium text-red-600">${amt.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                  {/* Totals Row */}
                  <tr className="border-t-2 border-gray-800 bg-gray-50">
                    <td className="p-3 font-bold">Total Expenses</td>
                    <td className="p-3 text-right font-bold">${totalExpenses.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Partner Profit Sharing */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">🤝 Partner Profit Sharing</h2>
            {partners.length === 0 ? (
              <p className="text-gray-500">No partners found. Add them in the Partners tab.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-blue-50">
                      <th className="p-3 text-left font-bold text-gray-700">Partner Name</th>
                      <th className="p-3 text-left font-bold text-gray-700">Split Rule</th>
                      <th className="p-3 text-right font-bold text-gray-700">Calculated Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((p: any) => {
                      const splitPercent = p.isPaybackCompleted ? 0.35 : 0.20;
                      const share = netProfit > 0 ? netProfit * splitPercent : 0;

                      return (
                        <tr key={p.id} className="border-b">
                          <td className="p-3 font-semibold">{p.name}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              p.isPaybackCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {p.isPaybackCompleted ? "35% (Recovered)" : "20% (Pre-Payback)"}
                            </span>
                          </td>
                          <td className="p-3 text-right font-bold text-green-600">${share.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}