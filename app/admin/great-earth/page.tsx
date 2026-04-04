import { Leaf, TrendingUp, FileText, Link } from "lucide-react";
import GreatEarthCountdown from "@/components/GreatEarthCountdown";
import ProjectStatusBars from "@/components/ProjectStatusBar";
import QuickNote from "@/components/QuickNote";

const milestones = [
  { label: "Produktsidor klara", done: true },
  { label: "Kampanjtext klar", done: true },
  { label: "Nyhetsbrev skickat", done: false },
  { label: "Sociala medier publicerade", done: false },
  { label: "Lansering live", done: false },
];

const tasks = [
  { title: "Skriv nyhetsbrevskopia", priority: "high", est: "60min" },
  { title: "Förbered Instagram-inlägg", priority: "high", est: "45min" },
  { title: "SEO meta-beskrivningar", priority: "medium", est: "30min" },
  { title: "Affiliate-länkar uppdaterade", priority: "low", est: "20min" },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-600",
  low: "bg-green-100 text-green-600",
};

export default function GreatEarthPage() {
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
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-emerald-500" /> Uppgifter
            </h2>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.title} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{task.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                    {task.priority === "high" ? "Hög" : task.priority === "medium" ? "Medium" : "Låg"}
                  </span>
                  <span className="text-xs text-gray-400">{task.est}</span>
                </div>
              ))}
            </div>
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

          <QuickNote />
        </div>

        <div className="space-y-4">
          <GreatEarthCountdown deadlineDate="2025-06-01T00:00:00" deadlineLabel="Lansering" />
          <ProjectStatusBars
            projects={[{ name: "Great Earth", progress: 55, color: "from-emerald-400 to-teal-300", tasks: 11, done: 6 }]}
          />
        </div>
      </div>
    </div>
  );
}
