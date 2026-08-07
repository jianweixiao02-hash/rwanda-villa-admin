"use client";

import { useState, useEffect } from "react";
import { getTableData } from "@/app/lib/airtable";
import { translations, Language } from "@/app/translations";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
    
    async function fetchData() {
      const data = await getTableData("Rooms");
      setRooms(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const t = translations[language];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.rooms || "Rooms"} Management</h1>

      {loading ? (
        <p className="text-gray-500">Loading rooms from Airtable...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Room Name</th>
                <th className="p-4 text-left">Room Number</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Capacity</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr><td className="p-4 text-center text-gray-500" colSpan={5}>No rooms found in database.</td></tr>
              ) : (
                rooms.map((r: any) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{r.roomName || r.name || "Unknown"}</td>
                    <td className="p-4">{r.roomNumber || "N/A"}</td>
                    <td className="p-4 font-bold text-blue-700">${r.price || 0}</td>
                    <td className="p-4">{r.capacity || 0}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        r.status === "Available" ? "bg-green-100 text-green-700" :
                        r.status === "Occupied" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {r.status || "N/A"}
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