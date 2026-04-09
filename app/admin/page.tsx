import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CheckCircle2 } from "lucide-react";
import QuickNote from "@/components/QuickNote";
import GreatEarthCountdown from "@/components/GreatEarthCountdown";
import MonthlyGoals from "@/components/MonthlyGoals";
import TodayTasks from "@/components/TodayTasks";
import TopPriorities from "@/components/TopPriorities";

export default function AdminPage() {
  const today = format(new Date(), "EEEE d MMMM", { locale: sv });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-purple-900">Hej Sofie! ✨</h1>
        <p className="text-sm text-purple-400 mt-0.5">{capitalizedToday}</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <TopPriorities />
          <TodayTasks />
          <QuickNote />
        </div>

        <div className="space-y-5">
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

          <GreatEarthCountdown />
          <MonthlyGoals />
        </div>
      </div>
    </div>
  );
}
