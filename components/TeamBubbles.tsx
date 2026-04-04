"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

const teamMembers = [
  {
    name: "Sara",
    role: "Social Media Manager",
    avatar: "👩‍💼",
    color: "bg-pink-100 border-pink-300",
    bubbleColor: "from-pink-400 to-rose-400",
    textColor: "text-pink-700",
    replies: [
      "På det! Fixar direkt 🎯",
      "Kan vi ta det imorgon?",
      "Behöver mer info om detta",
      "Ser bra ut! Kör på!",
    ],
  },
  {
    name: "Clara",
    role: "Content Creator",
    avatar: "👩‍🎨",
    color: "bg-purple-100 border-purple-300",
    bubbleColor: "from-purple-400 to-violet-400",
    textColor: "text-purple-700",
    replies: [
      "Jag jobbar på det! ✨",
      "Har ett förslag — snackas?",
      "Oklart, kan du förklara?",
      "Done och publicerat!",
    ],
  },
  {
    name: "Max",
    role: "Marketing Manager",
    avatar: "👨‍💻",
    color: "bg-blue-100 border-blue-300",
    bubbleColor: "from-blue-400 to-cyan-400",
    textColor: "text-blue-700",
    replies: [
      "Kollar analytics nu 📊",
      "Budget-godkänt!",
      "Behöver vecka till",
      "Kampanjen live!",
    ],
  },
  {
    name: "Gustav",
    role: "Growth Manager",
    avatar: "🧑‍📊",
    color: "bg-emerald-100 border-emerald-300",
    bubbleColor: "from-emerald-400 to-teal-400",
    textColor: "text-emerald-700",
    replies: [
      "Growth-hack aktiverat 🚀",
      "Siffrorna ser lovande ut!",
      "Testar A/B nu",
      "Rapporten är klar!",
    ],
  },
];

interface ActiveMember {
  name: string;
  role: string;
  avatar: string;
  color: string;
  bubbleColor: string;
  textColor: string;
  replies: string[];
}

export default function TeamBubbles() {
  const [active, setActive] = useState<ActiveMember | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<Record<string, string>>({});
  const [unread] = useState<Record<string, boolean>>({
    Sara: true,
    Gustav: true,
  });

  async function handleReply(member: string, reply: string) {
    await supabase.from("team_messages").insert({
      from_member: member,
      message: "Sofie skickade ett meddelande",
      reply,
      is_read: true,
    });
    setSentMessages((prev) => ({ ...prev, [member]: reply }));
    setTimeout(() => {
      setActive(null);
      setSentMessages((prev) => {
        const next = { ...prev };
        delete next[member];
        return next;
      });
    }, 1500);
  }

  async function handleCustomSend(member: string) {
    if (!customMessage.trim()) return;
    await handleReply(member, customMessage);
    setCustomMessage("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {active && (
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-4 w-64 mb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{active.avatar}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">{active.name}</p>
                <p className="text-xs text-gray-400">{active.role}</p>
              </div>
            </div>
            <button
              onClick={() => setActive(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>

          {sentMessages[active.name] ? (
            <div className="text-center py-3">
              <p className="text-xs text-emerald-600 font-medium">✓ Skickat!</p>
              <p className="text-xs text-gray-500 mt-1">&ldquo;{sentMessages[active.name]}&rdquo;</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">Snabbt svar:</p>
              <div className="space-y-1.5 mb-3">
                {active.replies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleReply(active.name, reply)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors bg-gray-50 hover:bg-purple-50 ${active.textColor} hover:border-purple-200 border border-transparent`}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomSend(active.name)}
                  placeholder="Eget meddelande..."
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-xl border border-gray-200 focus:border-purple-300 focus:outline-none"
                />
                <button
                  onClick={() => handleCustomSend(active.name)}
                  className="p-1.5 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                >
                  <Send size={12} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {teamMembers.map((member) => (
          <button
            key={member.name}
            onClick={() => setActive(active?.name === member.name ? null : member)}
            className="relative flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl shadow-md transition-transform group-hover:scale-110 ${member.color} ${
                active?.name === member.name ? "scale-110 ring-2 ring-purple-300 ring-offset-1" : ""
              }`}
            >
              {member.avatar}
            </div>
            {unread[member.name] && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-pink-400 rounded-full border-2 border-white animate-pulse-dot" />
            )}
            <span className="text-[10px] text-gray-500 font-medium">{member.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
