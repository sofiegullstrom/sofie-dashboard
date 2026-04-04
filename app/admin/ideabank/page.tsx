"use client";

import { useState } from "react";
import { Lightbulb, Plus, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";

const sampleIdeas = [
  { id: "1", title: "Great Earth podcast-serie om hållbarhet", project: "Great Earth", tags: ["content", "audio"], created_at: "2025-04-01" },
  { id: "2", title: "Pepper Deals app med push-notiser för deals", project: "Pepper Deals", tags: ["tech", "ux"], created_at: "2025-04-02" },
  { id: "3", title: "HomesForYou virtuella stadsvisningar", project: "HomesForYou", tags: ["video", "interaktivt"], created_at: "2025-04-03" },
  { id: "4", title: "PrimeBets live-odds TikTok med Sara", project: "PrimeBets", tags: ["socialt", "live"], created_at: "2025-04-03" },
];

const tagColors = ["bg-purple-100 text-purple-600", "bg-pink-100 text-pink-600", "bg-blue-100 text-blue-600", "bg-emerald-100 text-emerald-600", "bg-yellow-100 text-yellow-600"];

export default function IdeaBankPage() {
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProject, setNewProject] = useState("");
  const [newTags, setNewTags] = useState("");

  async function handleAdd() {
    if (!newTitle.trim()) return;
    const idea = {
      id: Date.now().toString(),
      title: newTitle,
      project: newProject || "Övrigt",
      tags: newTags ? newTags.split(",").map((t) => t.trim()) : [],
      created_at: new Date().toISOString().split("T")[0],
    };
    setIdeas((prev) => [idea, ...prev]);
    await supabase.from("ideas").insert({
      title: newTitle,
      project: newProject || null,
      tags: idea.tags,
    });
    setNewTitle("");
    setNewProject("");
    setNewTags("");
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-100 flex items-center justify-center">
            <Lightbulb size={20} className="text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-purple-900">Idébank</h1>
            <p className="text-sm text-gray-400">Alla projektidéer på ett ställe</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors text-sm font-medium"
        >
          <Plus size={14} /> Ny idé
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-100">
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Idéns titel..."
              className="w-full text-sm px-3 py-2 border border-yellow-200 rounded-xl focus:border-yellow-400 focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="Projekt (valfritt)"
                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-300 focus:outline-none"
              />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="Taggar (kommaseparerat)"
                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-300 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-yellow-400 text-white text-sm rounded-xl hover:bg-yellow-500 transition-colors font-medium"
              >
                Spara idé
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-500 text-sm hover:bg-gray-50 rounded-xl transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {ideas.map((idea, i) => (
          <div key={idea.id} className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-50 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                <Lightbulb size={14} className="text-yellow-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 leading-snug">{idea.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{idea.project} · {idea.created_at}</p>
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {idea.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagColors[ti % tagColors.length]}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
