import type { Metadata } from "next";
import "./globals.css";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rwanda NO.1 Commercial Villa",
  description: "AI Smart Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col bg-white antialiased">
        
        {/* Top Navigation Bar */}
        <nav className="w-full bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div className="font-bold text-xl">Rwanda No.1 Villa</div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/rooms" className="hover:underline">Rooms</Link>
            <LanguageSwitcher />
          </div>
        </nav>

        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}