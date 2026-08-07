"use client";

import { useState, useEffect, useRef } from "react";
import { translations, Language } from "@/app/translations";

export default function AdminAIPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load language
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language | null;
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const t = translations[language];

  // 🚀 THE AI CHAT LOGIC
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add user message to the chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Send the message to our existing /api/ai route
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      // 3. Add AI response to the chat
      if (data.success) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', content: "⚠️ Error: " + (data.error || "Could not reach AI.") }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', content: "⚠️ Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-100">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🤖 {t.aiAssistant || "AI Assistant"}</h1>
        <p className="text-gray-500">Chat with your Coze AI receptionist.</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              <p className="text-lg">👋 Start a conversation with your AI.</p>
              <p className="text-sm">Ask about room availability, pricing, or policies.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] p-4 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-4 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask the AI something..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}