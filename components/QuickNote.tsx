"use client";

import { useState } from "react";
import { Sparkles, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function QuickNote() {
  const [text, setText] = useState("");
  const [structured, setStructured] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleStructure() {
    if (!text.trim()) return;
    setLoading(true);

    // Simulate AI structuring (replace with real AI call if desired)
    await new Promise((r) => setTimeout(r, 800));

    // Simple heuristic structuring
    const lines = text.trim().split(/\n+/);
    const hasAction = /gör|ring|maila|skriv|kolla|fixa|uppdatera|skapa|prata/i.test(text);
    const hasIdea = /idé|tänker|borde|vad om|tänk|kanske/i.test(text);
    const detectedCategory = hasAction ? "Uppgift" : hasIdea ? "Idé" : "Anteckning";

    const structuredOutput = lines
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => `• ${l}`)
      .join("\n");

    setStructured(structuredOutput);
    setCategory(detectedCategory);
    setLoading(false);
  }

  async function handleSave() {
    if (!text.trim()) return;
    setSaved(false);
    await supabase.from("notes").insert({
      raw_text: text,
      structured_text: structured || text,
      category: category || "Anteckning",
    });
    setSaved(true);
    setText("");
    setStructured("");
    setCategory("");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
      <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Sparkles size={15} className="text-purple-400" />
        Snabbanteckning
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Skriv fritt — AI strukturerar och sorterar åt dig..."
        className="w-full text-sm p-3 bg-purple-50/40 rounded-xl border border-purple-100 focus:border-purple-300 focus:outline-none resize-none placeholder-purple-200 text-gray-700 leading-relaxed"
        rows={4}
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleStructure}
          disabled={loading || !text.trim()}
          className="flex items-center gap-1.5 text-xs px-3 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-50 font-medium"
        >
          <Sparkles size={12} />
          {loading ? "Strukturerar..." : "Strukturera med AI"}
        </button>

        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="flex items-center gap-1.5 text-xs px-3 py-2 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 transition-colors disabled:opacity-50 font-medium"
        >
          <Save size={12} />
          {saved ? "Sparat!" : "Spara"}
        </button>
      </div>

      {structured && (
        <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-emerald-700">
              Strukturerat som: {category}
            </span>
          </div>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {structured}
          </pre>
        </div>
      )}
    </div>
  );
}
