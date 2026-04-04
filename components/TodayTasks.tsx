"use client";

import { useState } from "react";
import { Plus, CalendarDays } from "lucide-react";
import TaskCard from "./TaskCard";
import { Task } from "@/lib/supabase";

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Skriva kampanjtext för Great Earth nyhetsbrev",
    description: "Fokus på hållbarhet och produktförmåner. 300-400 ord.",
    project: "Great Earth",
    priority: "high",
    status: "in_progress",
    estimated_minutes: 60,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Granska Saras Instagramkalender för maj",
    project: "Sociala medier",
    priority: "medium",
    status: "todo",
    estimated_minutes: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Uppdatera PrimeBets affiliate-länklista",
    project: "PrimeBets",
    priority: "low",
    status: "todo",
    estimated_minutes: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Möte med Max om Q2-kampanjbudget",
    description: "Gå igenom siffrorna för Pepper Deals och GavelDal",
    project: "Pepper Deals",
    priority: "high",
    status: "todo",
    estimated_minutes: 45,
    created_at: new Date().toISOString(),
  },
];

export default function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  function handleStatusChange(id: string, status: Task["status"]) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  function handleAddTask() {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      project: "Övrigt",
      priority: "medium",
      status: "todo",
      estimated_minutes: 30,
      created_at: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
    setShowAddForm(false);
  }

  const totalMinutes = tasks
    .filter((t) => t.status !== "done")
    .reduce((sum, t) => sum + t.estimated_minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <CalendarDays size={15} className="text-purple-400" />
          Dagens uppgifter
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            ~{hours > 0 ? `${hours}h ` : ""}{mins}min kvar
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-6 h-6 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Ny uppgift..."
            className="flex-1 text-sm px-3 py-2 border border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none placeholder-gray-300"
            autoFocus
          />
          <button
            onClick={handleAddTask}
            className="px-3 py-2 bg-purple-400 text-white text-xs rounded-xl hover:bg-purple-500 transition-colors font-medium"
          >
            Lägg till
          </button>
        </div>
      )}

      <div className="space-y-2">
        {tasks
          .sort((a, b) => {
            const order = { high: 0, medium: 1, low: 2 };
            return order[a.priority] - order[b.priority];
          })
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))}
      </div>
    </div>
  );
}
