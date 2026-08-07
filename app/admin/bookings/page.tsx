"use client";

import { useState, useEffect } from "react";
import { getTableData } from "@/app/lib/airtable";
import { translations, Language } from "@/app/translations";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");

  const fetchBookings = async () => {
    setLoading(true);
    const data = await getTableData("Bookings");
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
    fetchBookings();
  }, []);

  const t = translations[language];

  const handleAction = async (action: string, recordId: string, currentStatus: string) => {
    if (!confirm(`Are you sure you want to ${action} this booking?`)) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          table: 'Bookings',
          recordId: recordId,
          data: { status: action === 'approve' ? 'Confirmed' : action === 'cancel' ? 'Cancelled' : currentStatus }
        })
      });

      if (res.ok) {
        fetchBookings();
      } else {
        alert('Failed to update booking.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm('Are you sure you want to permanently delete this booking?')) return;
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', table: 'Bookings', recordId: recordId })
      });
      if (res.ok) {
        fetchBookings();
      } else {
        alert('Failed to delete booking.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.bookings || "Bookings"} Management</h1>

      {loading ? (
        <p className="text-gray-500">Loading real bookings from Airtable...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Room</th>
                <th className="p-4 text-left">Check In</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td className="p-4 text-center text-gray-500" colSpan={6}>No bookings found.</td></tr>
              ) : (
                bookings.map((b: any) => (
                  <tr key={b.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold">{b.customer || "Unknown"}</td>
                    <td className="p-4">{b.room || "N/A"}</td>
                    <td className="p-4">{b.checkIn || "N/A"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        b.status === "Completed" || b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                        b.status === "Cancelled" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {b.status || "New"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-blue-700">${b.total || 0}</td>
                    <td className="p-4 space-x-2">
                      <button 
                        onClick={() => handleAction('approve', b.id, b.status)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction('cancel', b.id, b.status)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleDelete(b.id)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition"
                      >
                        Delete
                      </button>
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