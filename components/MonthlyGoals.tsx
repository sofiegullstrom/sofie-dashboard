"use client";

import { useEffect, useState } from "react";
import { Target, Pencil, Check, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { supabase } from "@/lib/supabase";

interface ProjectGoal {
  id: string;
  project: string;
  goal_description: string;
  current_value: number;
  target_value: number;
  unit: string;
  color: string;
  month_year: string;
}

const COLORS: Record<string, string> = {
  "Pepper Deals": "from-orange-300 to-amber-300",
  "HomesForYou":  "from-blue-300 to-cyan-300",
  "GavelDal":     "from-amber-400 to-yellow-300",
  "Great Earth":  "from-emerald-400 to-teal-300",
  "PrimeBets":    "from-violet-400 to-purple-300",
};

export default function MonthlyGoals() {
  const [goals, setGoals] = useState<ProjectGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null); // goal id
  const [editCurrent, setEditCurrent] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [saving, setSaving] = useState(false);

  const monthYear = format(new Date(), "yyyy-MM");
  const monthLabel = format(new Date(), "MMMM", { locale: sv });
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("monthly_goals")
        .select("*")
        .eq("month_year", monthYear)
        .order("project");

      if (data && data.length > 0) {
        setGoals(data);
      } else {
        // First visit this month — seed from previous month or defaults
        const { data: prev } = await supabase
          .from("monthly_goals")
          .select("*")
          .order("month_year", { ascending: false })
          .limit(5);

        const seeded = prev && prev.length > 0
          ? prev.map((g: ProjectGoal) => ({ ...g, id: crypto.randomUUID(), month_year: monthYear, current_value: 0, updated_at: new Date().toISOString() }))
          : [
              { id: crypto.randomUUID(), project: "Pepper Deals", goal_description: "Affiliate-klick",    current_value: 0, target_value: 2000, unit: "klick", color: COLORS["Pepper Deals"], month_year: monthYear },
              { id: crypto.randomUUID(), project: "HomesForYou",  goal_description: "Leads genererade",   current_value: 0, target_value: 40,   unit: "leads", color: COLORS["HomesForYou"],  month_year: monthYear },
              { id: crypto.randomUUID(), project: "GavelDal",     goal_description: "Inlägg publicerade", current_value: 0, target_value: 10,   unit: "st",    color: COLORS["GavelDal"],     month_year: monthYear },
              { id: crypto.randomUUID(), project: "Great Earth",  goal_description: "Nyhetsbrev skickade",current_value: 0, target_value: 4,    unit: "st",    color: COLORS["Great Earth"],  month_year: monthYear },
              { id: crypto.randomUUID(), project: "PrimeBets",    goal_description: "Nya prenumeranter",  current_value: 0, target_value: 1000, unit: "st",    color: COLORS["PrimeBets"],    month_year: monthYear },
            ];

        await supabase.from("monthly_goals").upsert(seeded);
        setGoals(seeded);
      }
      setLoading(false);
    }
    load();
  }, [monthYear]);

  function startEdit(goal: ProjectGoal) {
    setEditing(goal.id);
    setEditCurrent(String(goal.current_value));
    setEditTarget(String(goal.target_value));
  }

  async function saveEdit(goal: ProjectGoal) {
    const current = parseInt(editCurrent) || 0;
    const target = parseInt(editTarget) || goal.target_value;
    setSaving(true);
    await supabase
      .from("monthly_goals")
      .update({ current_value: current, target_value: target, updated_at: new Date().toISOString() })
      .eq("id", goal.id);
    setGoals((prev) =>
      prev.map((g) => g.id === goal.id ? { ...g, current_value: current, target_value: target } : g)
    );
    setSaving(false);
    setEditing(null);
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
      <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
        <Target size={14} className="text-purple-400" />
        Mål {capitalizedMonth}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-gray-300">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current_value / g.target_value) * 100));
            const isNear = pct >= 80;
            const isEditing = editing === g.id;

            return (
              <div key={g.id} className="group">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-medium text-gray-700">{g.project}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isNear ? "text-emerald-500" : "text-gray-400"}`}>
                      {pct}%
                    </span>
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(g)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-purple-500"
                        title="Redigera mål"
                      >
                        <Pencil size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 shrink-0">{g.goal_description}:</span>
                    <input
                      type="number"
                      value={editCurrent}
                      onChange={(e) => setEditCurrent(e.target.value)}
                      className="w-20 text-xs px-2 py-1 border border-purple-200 rounded-lg focus:outline-none text-center"
                      placeholder="Nuv."
                      autoFocus
                    />
                    <span className="text-xs text-gray-400">/</span>
                    <input
                      type="number"
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className="w-20 text-xs px-2 py-1 border border-purple-200 rounded-lg focus:outline-none text-center"
                      placeholder="Mål"
                    />
                    <span className="text-xs text-gray-400">{g.unit}</span>
                    <button
                      onClick={() => saveEdit(g)}
                      disabled={saving}
                      className="p-1 text-green-500 hover:text-green-600 disabled:opacity-50"
                    >
                      <Check size={13} />
                    </button>
                    <button onClick={() => setEditing(null)} className="p-1 text-gray-300 hover:text-gray-500">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-xs text-gray-400 mb-1.5 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => startEdit(g)}
                    title="Klicka för att redigera"
                  >
                    {g.goal_description}: {g.current_value.toLocaleString("sv-SE")} / {g.target_value.toLocaleString("sv-SE")} {g.unit}
                  </div>
                )}

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${g.color} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
