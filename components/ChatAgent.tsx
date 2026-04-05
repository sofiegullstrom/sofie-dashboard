"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getContextFromPath(pathname: string): string {
  if (pathname.includes("pepper-deals")) return "Pepper Deals";
  if (pathname.includes("homes-for-you")) return "HomesForYou";
  if (pathname.includes("gavelsdal")) return "GavelDal";
  if (pathname.includes("great-earth")) return "Great Earth";
  if (pathname.includes("prime-bets")) return "PrimeBets";
  if (pathname.includes("sociala-medier")) return "Sociala medier";
  if (pathname.includes("content-plan")) return "Innehållsplan";
  if (pathname.includes("ideabank")) return "Idébank";
  if (pathname.includes("vecka")) return "Veckoplanning";
  if (pathname.includes("sara")) return "Team: Sara";
  if (pathname.includes("clara")) return "Team: Clara";
  if (pathname.includes("max")) return "Team: Max";
  if (pathname.includes("gustav")) return "Team: Gustav";
  return "Dashboard";
}

export default function ChatAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const context = getContextFromPath(pathname);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hej! Jag är din AI-assistent för **${context}**. Vad kan jag hjälpa dig med?`,
      }]);
    }
  }, [open, context, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, context }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.content }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Något gick fel. Kontrollera att ANTHROPIC_API_KEY är satt i Vercel." }]);
    }
    setLoading(false);
  }

  return (
    <div className="fixed bottom-6 left-20 z-40">
      {open && (
        <div className="absolute bottom-14 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-white" />
              <span className="text-white text-xs font-bold">AI-agent · {context}</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-3 space-y-2 scrollbar-hide bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mr-1.5 shrink-0 mt-0.5">
                    <Bot size={10} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] text-xs px-3 py-2 rounded-2xl leading-relaxed ${
                    m.role === "user"
                      ? "bg-purple-500 text-white rounded-br-sm"
                      : "bg-white text-gray-700 rounded-bl-sm shadow-sm border border-gray-100"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mr-1.5 shrink-0">
                  <Bot size={10} className="text-white" />
                </div>
                <div className="bg-white text-gray-400 text-xs px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <span className="animate-pulse">Tänker...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Skriv ett meddelande..."
              className="flex-1 text-xs px-3 py-2 bg-gray-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-300 placeholder-gray-300"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-11 h-11 rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
          open
            ? "bg-gray-700 text-white"
            : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
        }`}
        title="AI-assistent"
      >
        {open ? <X size={18} /> : <MessageSquare size={18} />}
      </button>
    </div>
  );
}
