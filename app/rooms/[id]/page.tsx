"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { rooms } from "@/app/data/rooms";
import { translations, Language } from "@/app/translations";
import { createRecord } from "@/app/lib/airtable"; // This connects to your DB

export default function RoomDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const room = rooms.find((r) => r.id === id);

  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  if (!room) {
    notFound();
  }

  const t = translations[language];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================================
  // 🚀 THE REAL LOGIC: Writing the booking to Airtable
  // ==========================================================
  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 1. Validate the dates (Optional but good practice)
      if (!formData.checkIn || !formData.checkOut) {
        throw new Error("Please select both check-in and check-out dates.");
      }

      // 2. Call the Airtable helper function to create a new record
      const newBooking = await createRecord("Bookings", {
        customer: formData.name,
        room: room.name,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests),
        status: "Pending", // Default status for new bookings
        total: 0, // We will calculate price later via a different flow
      });

      // 3. Success feedback to the user
      setMessage(`✅ Booking confirmed! Your booking ID is: ${newBooking.id}`);
      
      // 4. Clear the form after success
      setFormData({ 
        name: "", 
        email: "", 
        phone: "", 
        checkIn: "", 
        checkOut: "", 
        guests: 1 
      });

    } catch (error: any) {
      console.error("Booking Error:", error);
      setMessage(`❌ Booking failed: ${error.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        
        <Link href="/rooms" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; {t.navRooms}
        </Link>

        <h1 className="text-3xl font-bold text-black mb-2">{room.name}</h1>
        <p className="text-gray-600 mb-6">
          {t.roomsStatus}: <span className="text-green-600 font-medium">{room.status}</span>
        </p>

        <div className="w-full h-64 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300 flex items-center justify-center text-blue-500 font-semibold mb-8">
          {room.name} Image
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-black mb-4">Details</h2>
            <div className="space-y-3 text-gray-700">
              <p><span className="font-bold text-black">Room Number:</span> {room.roomNumber}</p>
              <p><span className="font-bold text-black">{t.roomsCapacity}:</span> {room.capacity} {t.roomsGuests}</p>
              <p><span className="font-bold text-black">Floor:</span> {room.floor}</p>
              <p className="mt-4">{room.description}</p>
            </div>
            <div className="mt-6">
              <h3 className="font-bold text-black mb-2">Amenities:</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {room.amenities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <p className="text-3xl font-bold text-blue-700 mb-1">
              {room.price.toLocaleString()} {room.currency}
            </p>
            <p className="text-gray-500 text-sm mb-6">{t.roomsNight}</p>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Check In</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full p-2 border rounded bg-white"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Check Out</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full p-2 border rounded bg-white"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Guests</label>
                <input 
                  type="number" 
                  min="1" 
                  max={room.capacity}
                  required 
                  className="w-full p-2 border rounded bg-white"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-2 border rounded bg-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  required 
                  className="w-full p-2 border rounded bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input 
                  type="tel" 
                  required 
                  className="w-full p-2 border rounded bg-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? "Booking..." : "Book Now"}
              </button>

              {message && (
                <p className={`text-center font-medium mt-4 ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}