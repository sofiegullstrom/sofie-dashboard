"use client";

import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface RatingModalProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
}

export default function RatingModal({ taskId, taskTitle, onClose }: RatingModalProps) {
  const [score, setScore] = useState(7);
  const [plusComment, setPlusComment] = useState("");
  const [minusComment, setMinusComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await supabase.from("ratings").insert({
      task_id: taskId,
      score,
      plus_comment: plusComment,
      minus_comment: minusComment,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-sm">Betygsätt uppgift</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{taskTitle}</p>

        {/* Score */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setScore(Math.max(1, score - 1))}
            className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors"
          >
            <Minus size={14} />
          </button>
          <div className="flex-1 flex justify-center gap-1.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setScore(n)}
                className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  n <= score
                    ? "bg-gradient-to-br from-purple-400 to-pink-400 text-white scale-110"
                    : "bg-gray-100 text-gray-400 hover:bg-purple-50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={() => setScore(Math.min(10, score + 1))}
            className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="text-center mb-5">
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            {score}/10
          </span>
        </div>

        {/* Plus */}
        <div className="mb-3">
          <label className="flex items-center gap-1 text-xs font-semibold text-green-600 mb-1">
            <Plus size={12} /> Vad gick bra?
          </label>
          <textarea
            value={plusComment}
            onChange={(e) => setPlusComment(e.target.value)}
            placeholder="Beskriv vad som fungerade..."
            className="w-full text-xs p-2.5 border border-green-100 rounded-xl focus:border-green-300 focus:outline-none resize-none bg-green-50/30 placeholder-gray-300"
            rows={2}
          />
        </div>

        {/* Minus */}
        <div className="mb-5">
          <label className="flex items-center gap-1 text-xs font-semibold text-pink-600 mb-1">
            <Minus size={12} /> Vad kan förbättras?
          </label>
          <textarea
            value={minusComment}
            onChange={(e) => setMinusComment(e.target.value)}
            placeholder="Beskriv vad som kan göras bättre..."
            className="w-full text-xs p-2.5 border border-pink-100 rounded-xl focus:border-pink-300 focus:outline-none resize-none bg-pink-50/30 placeholder-gray-300"
            rows={2}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all text-sm disabled:opacity-50"
        >
          {saving ? "Sparar..." : "Spara betyg"}
        </button>
      </div>
    </div>
  );
}
