"use client";

import { useState } from "react";
import { LucideIcon, Plus, Loader2 } from "lucide-react";
import QuickNote from "./QuickNote";
import TaskCard from "./TaskCard";
import { useProjectTasks } from "@/hooks/useProjectTasks";

interface ProjectPageProps {
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  barColor: string;
}

export default function ProjectPage({
  name,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  barColor,
}: ProjectPageProps) {
  const { tasks, loading, addTask, updateTask, deleteTask } = useProjectTasks(name);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [newMinutes, setNewMinutes] = useState(30);

  async function handleAdd() {
    if (!newTitle.trim()) return;
    await addTask(newTitle, { priority: newPriority, estimated_minutes: newMinutes });
    setNewTitle("");
    setNewPriority("medium");
    setNewMinutes(30);
    setShowAdd(false);
  }

  const done = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const sorted = [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (b.status === "done" && a.status !== "done") return -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl ${bgColor} flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-purple-900">{name}</h1>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Task list */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-700">
                Uppgifter
                {!loading && total > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-400">{done}/{total} klara</span>
                )}
              </h2>
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {showAdd && (
              <div className="mb-3 space-y-2 p-3 bg-purple-50 rounded-xl">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Ny uppgift..."
                  className="w-full text-sm px-3 py-2 border border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none placeholder-gray-300 bg-white"
                  autoFocus
                />
                <div className="flex gap-2">
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "high" | "medium" | "low")}
                    className="flex-1 text-xs px-2 py-2 border border-purple-200 rounded-xl focus:outline-none bg-white text-gray-600"
                  >
                    <option value="high">Hög prioritet</option>
                    <option value="medium">Medium prioritet</option>
                    <option value="low">Låg prioritet</option>
                  </select>
                  <input
                    type="number"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(parseInt(e.target.value) || 30)}
                    className="w-20 text-xs px-2 py-2 border border-purple-200 rounded-xl focus:outline-none bg-white text-gray-600 text-center"
                    placeholder="min"
                    min={5}
                    step={5}
                  />
                  <button
                    onClick={handleAdd}
                    className="px-3 py-2 bg-purple-400 text-white text-xs rounded-xl hover:bg-purple-500 transition-colors font-medium"
                  >
                    Lägg till
                  </button>
                </div>
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
          <QuickNote currentProject={name} />
        </div>

        {/* Progress */}
        <div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Progress</h2>
            <div className="text-center mb-3">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-pink-500">
                {loading ? "–" : `${progress}%`}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {!loading && (
              <p className="text-xs text-center text-gray-400 mt-2">{done} av {total} uppgifter klara</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
