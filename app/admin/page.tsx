import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Clock, Flame, CheckCircle2 } from "lucide-react";
import QuickNote from "@/components/QuickNote";
import GreatEarthCountdown from "@/components/GreatEarthCountdown";
import ProjectStatusBars from "@/components/ProjectStatusBar";
import TodayTasks from "@/components/TodayTasks";

const topPriorities = [
  { text: "Slutför Great Earth kampanjmaterial", tag: "Brådskande", color: "bg-red-100 text-red-600" },
  { text: "Review PrimeBets Q2-strategi med Max", tag: "Viktigt", color: "bg-orange-100 text-orange-600" },
  { text: "Schemalägg Claras innehållskalender för maj", tag: "Denna vecka", color: "bg-yellow-100 text-yellow-600" },
];

export default function AdminPage() {
  const today = format(new Date(), "EEEE d MMMM", { locale: sv });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-purple-900">
            Hej Sofie! ✨
          </h1>
          <p className="text-sm text-purple-400 mt-0.5">{capitalizedToday}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white rounded-xl px-3 py-2 border border-purple-50 shadow-sm">
          <Clock size={13} />
          <span>
            {new Date().toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: Tasks */}
        <div className="col-span-2 space-y-5">
          {/* Top priorities */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Flame size={15} className="text-orange-400" />
              Topp-prioriteringar
            </h2>
            <div className="space-y-2">
              {topPriorities.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-purple-300 font-black text-sm">
                    {i + 1}.
                  </span>
                  <p className="text-sm text-gray-700 flex-1">{p.text}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.color}`}
                  >
                    {p.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Tasks */}
          <TodayTasks />

          {/* Quick Note */}
          <QuickNote />
        </div>

        {/* Right: Stats */}
        <div className="space-y-5">
          {/* Done today */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-5 border border-purple-100">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={15} className="text-purple-500" />
              <span className="text-xs font-bold text-purple-700">Klart idag</span>
            </div>
            <p className="text-3xl font-black text-purple-800">3</p>
            <p className="text-xs text-purple-500 mt-0.5">av 8 uppgifter</p>
            <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full w-[37.5%] bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
            </div>
          </div>

          {/* Countdown */}
          <GreatEarthCountdown
            deadlineDate="2025-06-01T00:00:00"
            deadlineLabel="Great Earth lansering"
          />

          {/* Project Status */}
          <ProjectStatusBars />
        </div>
      </div>
    </div>
  );
}
