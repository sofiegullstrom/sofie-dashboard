"use client";

import { useState } from "react";
import { X, Edit2, Save, Trash2, Plus, Minus, MessageCircle } from "lucide-react";
import { Task, supabase } from "@/lib/supabase";

interface Props {
  task: Task;
  onClose: () => void;
  onUpdate: (updated: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskDetailModal({ task, onClose, onUpdate, onDelete }: Props) {
  const [tab, setTab] = useState<"detail" | "rating">("detail");
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [comment, setComment] = useState("");
  const [score, setScore] = useState(7);
  const [plusComment, setPlusComment] = useState("");
  const [minusComment, setMinusComment] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleSave() {
    onUpdate({ ...task, title, description });
    setEditMode(false);
  }

  async function handleSaveRating() {
    setSaving(true);
    await supabase.from("ratings").insert({
      task_id: task.id,
      score,
      plus_comment: plusComment || null,
      minus_comment: minusComment || null,
    });
    if (comment.trim()) {
      await supabase.from("notes").insert({
        raw_text: comment,
        category: "Uppgift",
      });
    }
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg mx-4 border border-purple-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          {editMode ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-sm font-bold border-b border-purple-200 focus:outline-none pb-1"
              autoFocus
            />
          ) : (
            <h3 className="font-bold text-gray-800 text-sm flex-1 leading-snug">{title}</h3>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="text-gray-400 hover:text-purple-500 transition-colors">
                <Edit2 size={15} />
              </button>
            )}
            {editMode && (
              <button onClick={handleSave} className="text-green-500 hover:text-green-600 transition-colors">
                <Save size={15} />
              </button>
            )}
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={15} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-xs text-red-600 mb-2 font-medium">Ta bort den här uppgiften?</p>
            <div className="flex gap-2">
              <button
                onClick={() => { onDelete(task.id); onClose(); }}
                className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              >
                Ta bort
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Avbryt
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1">
          {(["detail", "rating"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                tab === t ? "bg-white shadow-sm text-purple-700" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t === "detail" ? "Detaljer" : "Betygsätt"}
            </button>
          ))}
        </div>

        {tab === "detail" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Beskrivning</label>
              {editMode ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 border border-purple-100 rounded-xl focus:outline-none focus:border-purple-300 resize-none"
                  rows={3}
                  placeholder="Lägg till beskrivning..."
                />
              ) : (
                <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 min-h-[52px]">
                  {description || <span className="text-gray-300">Ingen beskrivning</span>}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
                <MessageCircle size={11} /> Kommentar / anteckning
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Lägg till en kommentar (sparas i anteckningar)..."
                className="w-full text-xs p-3 border border-purple-100 rounded-xl focus:outline-none focus:border-purple-300 resize-none placeholder-gray-300"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-gray-50 rounded-xl p-2.5">
                <span className="font-semibold text-gray-700 block mb-0.5">Projekt</span>
                <span className="text-gray-500">{task.project}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-2.5">
                <span className="font-semibold text-gray-700 block mb-0.5">Prioritet</span>
                <span className="text-gray-500">
                  {task.priority === "high" ? "Hög" : task.priority === "medium" ? "Medium" : "Låg"}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-2.5">
                <span className="font-semibold text-gray-700 block mb-0.5">Tid</span>
                <span className="text-gray-500">{task.estimated_minutes}min</span>
              </div>
            </div>

            {comment.trim() && (
              <button
                onClick={() => {
                  supabase.from("notes").insert({ raw_text: comment, category: "Uppgift" });
                  setComment("");
                }}
                className="w-full py-2 bg-purple-50 text-purple-600 text-xs font-medium rounded-xl hover:bg-purple-100 transition-colors"
              >
                Spara kommentar
              </button>
            )}
          </div>
        )}

        {tab === "rating" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScore(Math.max(1, score - 1))}
                className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors"
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 flex justify-center gap-1">
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
            <div className="text-center">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {score}/10
              </span>
            </div>
            <div>
              <label className="text-xs font-semibold text-green-600 mb-1.5 flex items-center gap-1">
                <Plus size={11} /> Vad gick bra?
              </label>
              <textarea
                value={plusComment}
                onChange={(e) => setPlusComment(e.target.value)}
                placeholder="Beskriv vad som fungerade..."
                className="w-full text-xs p-2.5 border border-green-100 rounded-xl focus:outline-none focus:border-green-300 resize-none bg-green-50/30 placeholder-gray-300"
                rows={2}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-pink-600 mb-1.5 flex items-center gap-1">
                <Minus size={11} /> Vad kan förbättras?
              </label>
              <textarea
                value={minusComment}
                onChange={(e) => setMinusComment(e.target.value)}
                placeholder="Beskriv vad som kan göras bättre..."
                className="w-full text-xs p-2.5 border border-pink-100 rounded-xl focus:outline-none focus:border-pink-300 resize-none bg-pink-50/30 placeholder-gray-300"
                rows={2}
              />
            </div>
            <button
              onClick={handleSaveRating}
              disabled={saving}
              className="w-full py-2.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all text-sm disabled:opacity-50"
            >
              {saving ? "Sparar..." : "Spara betyg"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
