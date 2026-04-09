"use client";

import { useEffect, useState } from "react";
import { Flame, CheckCircle2, Loader2 } from "lucide-react";
import { supabase, Task } from "@/lib/supabase";
import TaskDetailModal from "./TaskDetailModal";

export default function TopPriorities() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Task | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("priority", "high")
        .neq("status", "done")
        .order("created_at", { ascending: true })
        .limit(3);
      setTasks(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function markDone(id: string) {
    await supabase.from("tasks").update({ status: "done" }).eq("id", id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleUpdate(updated: Task) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    supabase.from("tasks").update({
      title: updated.title,
      description: updated.description,
      priority: updated.priority,
      estimated_minutes: updated.estimated_minutes,
    }).eq("id", updated.id);
    setSelected(null);
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    supabase.from("tasks").delete().eq("id", id);
    setSelected(null);
  }

  const urgencyLabel = (project: string) => {
    const map: Record<string, { tag: string; color: string }> = {
      "Great Earth":    { tag: "Brådskande",   color: "bg-red-100 text-red-600" },
      "Pepper Deals":   { tag: "Viktigt",       color: "bg-orange-100 text-orange-600" },
      "PrimeBets":      { tag: "Denna vecka",   color: "bg-yellow-100 text-yellow-600" },
      "HomesForYou":    { tag: "Denna vecka",   color: "bg-yellow-100 text-yellow-600" },
      "GavelDal":       { tag: "Viktigt",       color: "bg-orange-100 text-orange-600" },
      "Sociala medier": { tag: "Denna vecka",   color: "bg-yellow-100 text-yellow-600" },
    };
    return map[project] ?? { tag: "Hög prio", color: "bg-red-100 text-red-600" };
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
        <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Flame size={15} className="text-orange-400" />
          Topp-prioriteringar
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-5 text-gray-300">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            Inga högt prioriterade uppgifter just nu 🎉
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task, i) => {
              const { tag, color } = urgencyLabel(task.project);
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 group cursor-pointer"
                  onClick={() => setSelected(task)}
                >
                  <span className="text-purple-300 font-black text-sm shrink-0">{i + 1}.</span>
                  <p className="text-sm text-gray-700 flex-1 group-hover:text-purple-700 transition-colors">
                    {task.title}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${color}`}>
                    {tag}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); markDone(task.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-300 hover:text-green-500 shrink-0"
                    title="Markera som klar"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <TaskDetailModal
          task={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
