"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations, Language } from "@/app/translations";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");

  // Load the language from local storage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ FIXED: Updated path to match your VS Code folder structure
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        document.cookie = "admin_session=true; path=/; max-age=86400; samesite=lax";
        router.push("/admin");
      } else {
        setError(t.loginError || "Incorrect password. Please try again.");
      }
    } catch (error) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">{t.loginTitle}</h1>
        <p className="text-gray-500 text-center mb-6">{t.loginSubtitle}</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">{t.loginPasswordLabel}</label>
            <input
              type="password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t.loginPasswordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "..." : t.loginButton}
          </button>
        </form>
      </div>
    </main>
  );
}