"use client";

import { useState } from "react";
import {
  Sparkles, X, CheckSquare, Square, PlusCircle, Clock,
  ChevronRight, AlertCircle, Lightbulb, FileText, RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { AnalyzedNote } from "@/app/api/analyze-note/route";

const priorityConfig = {
  high:   { label: "Hög",    color: "bg-red-100 text-red-600",    dot: "bg-red-400" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-600", dot: "bg-yellow-400" },
  low:    { label: "Låg",    color: "bg-green-100 text-green-600", dot: "bg-green-400" },
};

const projectColors: Record<string, string> = {
  "Great Earth":    "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Pepper Deals":   "bg-orange-100 text-orange-700 border-orange-200",
  "HomesForYou":    "bg-blue-100 text-blue-700 border-blue-200",
  "GavelDal":       "bg-amber-100 text-amber-700 border-amber-200",
  "PrimeBets":      "bg-violet-100 text-violet-700 border-violet-200",
  "Sociala medier": "bg-pink-100 text-pink-700 border-pink-200",
  "Övrigt":         "bg-gray-100 text-gray-700 border-gray-200",
};

const typeConfig = {
  task:   { icon: ChevronRight, label: "Uppgift",     color: "text-purple-500" },
  update: { icon: RefreshCw,    label: "Uppdatering", color: "text-blue-500" },
  idea:   { icon: Lightbulb,    label: "Idé",         color: "text-yellow-500" },
  note:   { icon: FileText,     label: "Anteckning",  color: "text-gray-500" },
  mixed:  { icon: Sparkles,     label: "Blandat",     color: "text-purple-500" },
};

interface QuickNoteProps {
  currentProject?: string;
}

type Phase = "idle" | "loading" | "result" | "select";

export default function QuickNote({ currentProject }: QuickNoteProps) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AnalyzedNote | null>(null);
  const [selected, setSelected] = useState<boolean[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  async function handleAnalyze() {
    if (!text.trim() || phase === "loading") return;
    setPhase("loading");
    setResult(null);

    try {
      const res = await fetch("/api/analyze-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, currentProject }),
      });
      const data: AnalyzedNote = await res.json();
      setResult(data);
      setSelected(data.tasks.map(() => true));
      setPhase("result");
    } catch {
      setPhase("idle");
    }
  }

  async function saveTasks(taskIndices: number[]) {
    if (!result) return;
    setSaving(true);

    const rows = taskIndices.map((i) => ({
      title: result.tasks[i].title,
      project: result.project,
      priority: result.tasks[i].priority,
      status: "todo" as const,
      estimated_minutes: result.tasks[i].estimated_minutes,
      description: result.tasks[i].notes || null,
    }));

    await supabase.from("tasks").insert(rows);
    await supabase.from("notes").insert({
      raw_text: text,
      structured_text: result.summary,
      category: result.type === "idea" ? "Idé" : result.type === "note" ? "Anteckning" : "Uppgift",
    });

    setSaving(false);
    const count = rows.length;
    setSavedMsg(`${count} uppgift${count !== 1 ? "er" : ""} sparad${count !== 1 ? "e" : ""} i ${result.project}!`);
    setTimeout(() => {
      setText("");
      setResult(null);
      setPhase("idle");
      setSavedMsg("");
    }, 2000);
  }

  function handleAddAll() {
    if (!result) return;
    saveTasks(result.tasks.map((_, i) => i));
  }

  function handleSaveSelected() {
    const indices = selected.map((v, i) => (v ? i : -1)).filter((i) => i >= 0);
    saveTasks(indices);
  }

  function handleDismiss() {
    setText("");
    setResult(null);
    setPhase("idle");
    setSavedMsg("");
  }

  const projColor = result
    ? projectColors[result.project] ?? projectColors["Övrigt"]
    : "";

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
      <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Sparkles size={15} className="text-purple-400" />
        Snabbanteckning
      </h2>

      {/* Textarea — always visible unless saved */}
      {!savedMsg && (
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); if (phase !== "idle") setPhase("idle"); setResult(null); }}
          placeholder="Skriv fritt — AI förstår vad du menar och sorterar åt dig..."
          className="w-full text-sm p-3 bg-purple-50/40 rounded-xl border border-purple-100 focus:border-purple-300 focus:outline-none resize-none placeholder-purple-200 text-gray-700 leading-relaxed"
          rows={3}
          disabled={phase === "loading"}
        />
      )}

      {/* Saved confirmation */}
      {savedMsg && (
        <div className="py-4 text-center">
          <p className="text-sm font-semibold text-emerald-600">✓ {savedMsg}</p>
        </div>
      )}

      {/* Analyze button (idle state) */}
      {phase === "idle" && !savedMsg && (
        <button
          onClick={handleAnalyze}
          disabled={!text.trim()}
          className="mt-2 flex items-center gap-1.5 text-xs px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all disabled:opacity-40 font-medium"
        >
          <Sparkles size={12} />
          Analysera med AI
        </button>
      )}

      {/* Loading */}
      {phase === "loading" && (
        <div className="mt-3 flex items-center gap-2 text-xs text-purple-400 animate-pulse">
          <Sparkles size={13} className="animate-spin" />
          Analyserar...
        </div>
      )}

      {/* Result */}
      {(phase === "result" || phase === "select") && result && (
        <div className="mt-3 space-y-3">
          {/* Header: project + type */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${projColor}`}>
              {result.project}
            </span>
            {(() => {
              const t = typeConfig[result.type];
              return (
                <span className={`text-xs flex items-center gap-1 ${t.color}`}>
                  <t.icon size={11} />
                  {t.label}
                </span>
              );
            })()}
            <span className="text-xs text-gray-400 flex-1 min-w-0 truncate">{result.summary}</span>
          </div>

          {/* Completed items */}
          {result.completed.length > 0 && (
            <div className="bg-emerald-50 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-semibold text-emerald-700 mb-1.5">Verkar vara klart:</p>
              {result.completed.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-emerald-700">
                  <span className="mt-0.5">✅</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {result.tasks.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500">
                Uppgifter att lägga till:
              </p>
              {result.tasks.map((task, i) => {
                const p = priorityConfig[task.priority];
                const isSelect = phase === "select";
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (!isSelect) return;
                      setSelected((prev) => prev.map((v, j) => (j === i ? !v : v)));
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      isSelect
                        ? selected[i]
                          ? "bg-purple-50 border-purple-200 cursor-pointer"
                          : "bg-gray-50 border-gray-100 opacity-50 cursor-pointer"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    {isSelect && (
                      <div className="mt-0.5 shrink-0 text-purple-500">
                        {selected[i] ? <CheckSquare size={15} /> : <Square size={15} className="text-gray-300" />}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700">{task.title}</p>
                      {task.notes && (
                        <p className="text-xs text-gray-400 mt-0.5">{task.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${p.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                        {p.label}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <Clock size={10} />
                        {task.estimated_minutes}min
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Suggestion */}
          {result.suggestion && (
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
              <AlertCircle size={13} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">{result.suggestion}</p>
            </div>
          )}

          {/* Action buttons */}
          {!saving && !savedMsg && (
            <div className="flex flex-wrap gap-2 pt-1">
              {result.tasks.length > 0 && phase === "result" && (
                <>
                  <button
                    onClick={handleAddAll}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium"
                  >
                    <PlusCircle size={12} />
                    Lägg till alla
                  </button>
                  {result.tasks.length > 1 && (
                    <button
                      onClick={() => setPhase("select")}
                      className="flex items-center gap-1.5 text-xs px-3 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-medium"
                    >
                      <CheckSquare size={12} />
                      Välj vilka
                    </button>
                  )}
                </>
              )}
              {phase === "select" && (
                <button
                  onClick={handleSaveSelected}
                  disabled={!selected.some(Boolean)}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-40 transition-colors font-medium"
                >
                  <PlusCircle size={12} />
                  Spara valda ({selected.filter(Boolean).length})
                </button>
              )}
              {result.tasks.length === 0 && (
                <button
                  onClick={async () => {
                    await supabase.from("notes").insert({
                      raw_text: text,
                      structured_text: result.summary,
                      category: result.type === "idea" ? "Idé" : "Anteckning",
                    });
                    setSavedMsg("Anteckning sparad!");
                    setTimeout(() => { setText(""); setResult(null); setPhase("idle"); setSavedMsg(""); }, 2000);
                  }}
                  className="flex items-center gap-1.5 text-xs px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Spara som anteckning
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="flex items-center gap-1.5 text-xs px-3 py-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X size={12} />
                Avfärda
              </button>
            </div>
          )}

          {saving && (
            <p className="text-xs text-purple-500 animate-pulse pt-1">Sparar...</p>
          )}
        </div>
      )}
    </div>
  );
}
