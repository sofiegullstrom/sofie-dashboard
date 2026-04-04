"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TeamMemberPageProps {
  name: string;
  role: string;
  avatar: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  tasks: string[];
  quickReplies: string[];
  bio: string;
}

export default function TeamMemberPage({
  name,
  role,
  avatar,
  color,
  gradientFrom,
  gradientTo,
  tasks,
  quickReplies,
  bio,
}: TeamMemberPageProps) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  async function handleSend(reply: string) {
    await supabase.from("team_messages").insert({
      from_member: name,
      message: "Sofie skickade ett meddelande",
      reply,
      is_read: true,
    });
    setSent(reply);
    setTimeout(() => setSent(null), 3000);
    setMessage("");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-3xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
            {avatar}
          </div>
          <div>
            <h1 className="text-2xl font-black">{name}</h1>
            <p className="text-white/80 text-sm">{role}</p>
          </div>
        </div>
        <p className="mt-3 text-white/90 text-sm leading-relaxed">{bio}</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Current tasks */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Aktuella uppgifter</h2>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: gradientFrom }} />
                  <p className="text-sm text-gray-700">{task}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Skicka meddelande</h2>

            {sent ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm p-3 bg-emerald-50 rounded-xl">
                <CheckCircle size={16} />
                Skickat: &ldquo;{sent}&rdquo;
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {quickReplies.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleSend(r)}
                      className="text-xs text-left px-3 py-2 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors text-gray-600 hover:text-purple-700 border border-transparent hover:border-purple-100"
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && message && handleSend(message)}
                    placeholder={`Skriv till ${name}...`}
                    className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:border-purple-300 focus:outline-none placeholder-gray-300"
                  />
                  <button
                    onClick={() => message && handleSend(message)}
                    disabled={!message}
                    className="px-3 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-40"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50 h-fit">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Stats</h2>
          <div className="space-y-3">
            {[
              { label: "Uppgifter klara", value: "12" },
              { label: "Pågående", value: String(tasks.length) },
              { label: "Betyg snitt", value: "8.2" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-sm font-bold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
