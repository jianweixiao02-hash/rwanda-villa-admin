"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// ✅ FIXED: Using strict @/ path for Vercel Linux compatibility
import { rooms } from "@/app/data/rooms";
import { translations, Language } from "@/app/translations";

export default function RoomsPage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = translations[language];

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-black mb-8 text-center">{t.roomsTitle}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition flex flex-col h-full">
            <div className="h-32 bg-gray-300 rounded-lg mb-4 flex items-center justify-center text-gray-500 text-sm">
              {room.name} Image
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">{room.name}</h2>
            <p className="text-gray-600 mb-2">Room: {room.roomNumber}</p>
            <p className="text-gray-700 mb-1">{t.roomsCapacity}: {room.capacity} {t.roomsGuests}</p>
            <p className="text-gray-600 mb-4 text-sm">{room.description.substring(0, 60)}...</p>
            <div className="mt-auto">
              <p className="text-xl font-bold text-blue-700 mb-3">{room.price.toLocaleString()} {room.currency} {t.roomsNight}</p>
              <Link href={`/rooms/${room.id}`} className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                {t.roomsViewDetails}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}