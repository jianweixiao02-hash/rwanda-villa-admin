"use client";

import { useEffect, useState } from "react";
import { getTableData } from "@/app/lib/airtable";

export default function AdminDashboardPage() {
  const [revenue, setRevenue] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAirtableData() {
      try {
        // Fetch real booking data from Airtable
        const bookings = await getTableData("Bookings");

        // Calculate Total Revenue (Sum of 'total' column for Completed bookings)
        const totalRev = bookings
          .filter((b: any) => b.status === "Completed")
          .reduce((sum: number, b: any) => sum + (b.total || 0), 0);

        setRevenue(totalRev);
        setBookingsCount(bookings.length);
      } catch (error) {
        console.error("Failed to load Airtable data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAirtableData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-900">Rwanda No.1 Commercial Villa</h1>
        <p className="mt-2 text-gray-600">AI Smart Management Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500">Total Rooms</h2>
          <p className="mt-4 text-5xl font-bold text-blue-700">5</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500">Bookings</h2>
          <p className="mt-4 text-5xl font-bold text-green-600">
            {loading ? "..." : bookingsCount}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500">Customers</h2>
          <p className="mt-4 text-5xl font-bold text-purple-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-gray-500">Revenue</h2>
          <p className="mt-4 text-5xl font-bold text-orange-500">
            {loading ? "..." : `$${revenue}`}
          </p>
        </div>
      </div>
    </main>
  );
}