"use client";

import { useState } from "react";
import { Clock, ChevronUp, ChevronDown, Star } from "lucide-react";
import { Task } from "@/lib/supabase";
import RatingModal from "./RatingModal";

const priorityConfig = {
  high: { label: "Hög", color: "bg-red-100 text-red-600", dot: "bg-red-400" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-600", dot: "bg-yellow-400" },
  low: { label: "Låg", color: "bg-green-100 text-green-600", dot: "bg-green-400" },
};

const projectColors: Record<string, string> = {
  "Pepper Deals": "border-l-orange-300",
  "HomesForYou": "border-l-blue-300",
  "GavelDal": "border-l-amber-400",
  "Great Earth": "border-l-emerald-400",
  "PrimeBets": "border-l-violet-400",
};

interface TaskCardProps {
  task: Task;
  onStatusChange?: (id: string, status: Task["status"]) => void;
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [showRating, setShowRating] = useState(false);
  const priority = priorityConfig[task.priority];
  const borderColor = projectColors[task.project] || "border-l-purple-300";

  return (
    <>
      <div
        className={`bg-white rounded-2xl p-4 border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-shadow`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${priority.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                {priority.label}
              </span>
              <span className="text-xs text-gray-400">{task.project}</span>
            </div>
            <h3 className={`text-sm font-semibold text-gray-800 ${task.status === "done" ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              <span>{task.estimated_minutes}min</span>
            </div>
            <button
              onClick={() => setShowRating(true)}
              className="p-1 text-yellow-400 hover:text-yellow-500 transition-colors"
              title="Betygsätt"
            >
              <Star size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {(["todo", "in_progress", "done"] as Task["status"][]).map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange?.(task.id, s)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                task.status === s
                  ? s === "done"
                    ? "bg-green-100 text-green-700 font-medium"
                    : s === "in_progress"
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "bg-gray-100 text-gray-700 font-medium"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {s === "todo" ? "Att göra" : s === "in_progress" ? "Pågår" : "Klar"}
            </button>
          ))}
        </div>
      </div>

      {showRating && (
        <RatingModal taskId={task.id} taskTitle={task.title} onClose={() => setShowRating(false)} />
      )}
    </>
  );
}
