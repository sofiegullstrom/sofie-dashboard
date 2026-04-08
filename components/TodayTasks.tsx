"use client";

import { useState } from "react";
import { Plus, CalendarDays, Loader2 } from "lucide-react";
import TaskCard from "./TaskCard";
import { Task } from "@/lib/supabase";
import { useProjectTasks } from "@/hooks/useProjectTasks";

export default function TodayTasks() {
  const { tasks, loading, addTask, updateTask, deleteTask } = useProjectTasks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newProject, setNewProject] = useState("Övrigt");

  async function handleAdd() {
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, { priority: "medium", estimated_minutes: 30 });
    setNewTaskTitle("");
    setNewProject("Övrigt");
    setShowAddForm(false);
  }

  const activeTasks = tasks.filter((t) => t.status !== "done");
  const totalMinutes = activeTasks.reduce((s, t) => s + t.estimated_minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const sorted = [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (b.status === "done" && a.status !== "done") return -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <CalendarDays size={15} className="text-purple-400" />
          Alla uppgifter
          {!loading && (
            <span className="text-xs font-normal text-gray-400 ml-1">
              {tasks.filter((t) => t.status === "done").length}/{tasks.length} klara
            </span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          {!loading && activeTasks.length > 0 && (
            <span className="text-xs text-gray-400">
              ~{hours > 0 ? `${hours}h ` : ""}{mins}min kvar
            </span>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Ny uppgift..."
            className="flex-1 min-w-0 text-sm px-3 py-2 border border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none placeholder-gray-300"
            autoFocus
          />
          <select
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            className="text-xs px-2 py-2 border border-purple-200 rounded-xl focus:outline-none text-gray-600"
          >
            {["Övrigt","Great Earth","Pepper Deals","HomesForYou","GavelDal","PrimeBets","Sociala medier"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-purple-400 text-white text-xs rounded-xl hover:bg-purple-500 transition-colors font-medium"
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
        <p className="text-xs text-gray-400 text-center py-6">Inga uppgifter ännu. Lägg till en!</p>
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
  );
}
