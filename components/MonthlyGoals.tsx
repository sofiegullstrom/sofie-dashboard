import { Target } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ProjectGoal {
  name: string;
  goal: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

const defaultGoals: ProjectGoal[] = [
  { name: "Pepper Deals", goal: "Affiliate-klick", current: 1240, target: 2000, unit: "klick", color: "from-orange-300 to-amber-300" },
  { name: "HomesForYou", goal: "Leads genererade", current: 18, target: 40, unit: "leads", color: "from-blue-300 to-cyan-300" },
  { name: "GavelDal", goal: "Inlägg publicerade", current: 8, target: 10, unit: "st", color: "from-amber-400 to-yellow-300" },
  { name: "Great Earth", goal: "Nyhetsbrev skickade", current: 2, target: 4, unit: "st", color: "from-emerald-400 to-teal-300" },
  { name: "PrimeBets", goal: "Nya prenumeranter", current: 340, target: 1000, unit: "st", color: "from-violet-400 to-purple-300" },
];

export default function MonthlyGoals({ goals = defaultGoals }: { goals?: ProjectGoal[] }) {
  const month = format(new Date(), "MMMM", { locale: sv });
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
      <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
        <Target size={14} className="text-purple-400" />
        Mål {capitalizedMonth}
      </h2>
      <div className="space-y-4">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          const isNearGoal = pct >= 80;
          return (
            <div key={g.name}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-gray-700">{g.name}</span>
                <span className={`text-xs font-bold ${isNearGoal ? "text-emerald-500" : "text-gray-400"}`}>
                  {pct}%
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-1.5">
                {g.goal}: {g.current.toLocaleString("sv-SE")} / {g.target.toLocaleString("sv-SE")} {g.unit}
              </div>
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
    </div>
  );
}
