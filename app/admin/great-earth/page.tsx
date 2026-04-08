"use client";

import { useState } from "react";
import { Leaf, TrendingUp, Plus, Loader2 } from "lucide-react";
import GreatEarthCountdown from "@/components/GreatEarthCountdown";
import MonthlyGoals from "@/components/MonthlyGoals";
import QuickNote from "@/components/QuickNote";
import TaskCard from "@/components/TaskCard";
import { useProjectTasks } from "@/hooks/useProjectTasks";

const milestones = [
  { label: "Produktsidor klara", done: true },
  { label: "Kampanjtext klar", done: true },
  { label: "Nyhetsbrev skickat", done: false },
  { label: "Sociala medier publicerade", done: false },
  { label: "Lansering live", done: false },
];

export default function GreatEarthPage() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useProjectTasks("Great Earth");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  async function handleAdd() {
    if (!newTitle.trim()) return;
    await addTask(newTitle, { priority: "medium", estimated_minutes: 30 });
    setNewTitle("");
    setShowAdd(false);
  }

  const done = tasks.filter((t) => t.status === "done").length;
  const sorted = [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (b.status === "done" && a.status !== "done") return -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <Leaf size={20} className="text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-purple-900">Great Earth</h1>
          <p className="text-sm text-gray-400">Hälsoprodukter · Affiliate</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Tasks */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">
                Uppgifter
                {!loading && tasks.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-400">{done}/{tasks.length} klara</span>
                )}
              </h2>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-200 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {showAdd && (
              <div className="flex gap-2 mb-3">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Ny uppgift..."
                  className="flex-1 text-sm px-3 py-2 border border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none placeholder-gray-300"
                  autoFocus
                />
                <button
                  onClick={handleAdd}
                  className="px-3 py-2 bg-emerald-400 text-white text-xs rounded-xl hover:bg-emerald-500 font-medium"
                >
                  Lägg till
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-8 text-gray-300">
                <Loader2 size={20} className="animate-spin" />
              </div>
            ) : sorted.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Inga uppgifter. Lägg till en!</p>
            ) : (
              <div className="space-y-2">
                {sorted.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={(id, status) => updateTask(id, { status })}
                    onDelete={deleteTask}
                    onUpdate={(updated) =>
                      updateTask(updated.id, {
                        title: updated.title,
                        description: updated.description,
                        priority: updated.priority,
                        estimated_minutes: updated.estimated_minutes,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> Milstolpar
            </h2>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${m.done ? "bg-emerald-400 border-emerald-400" : "border-gray-200"}`}>
                    {m.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${m.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <QuickNote currentProject="Great Earth" />
        </div>

        <div className="space-y-4">
          <GreatEarthCountdown deadlineDate="2025-06-01T00:00:00" deadlineLabel="Lansering" />
          <MonthlyGoals
            goals={[{ name: "Great Earth", goal: "Nyhetsbrev skickade", current: 2, target: 4, unit: "st", color: "from-emerald-400 to-teal-300" }]}
          />
        </div>
      </div>
    </div>
  );
}
