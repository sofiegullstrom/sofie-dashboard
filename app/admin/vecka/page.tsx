import { CalendarRange, Clock } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { sv } from "date-fns/locale";

const weekTasks = [
  { day: "Måndag", tasks: ["Great Earth kampanjtext", "Review Sara kalender"] },
  { day: "Tisdag", tasks: ["Möte med Max om budget", "PrimeBets länklista"] },
  { day: "Onsdag", tasks: ["HomesForYou SEO-analys", "Content plan Clara"] },
  { day: "Torsdag", tasks: ["GavelDal produktuppdatering", "Veckorapport"] },
  { day: "Fredag", tasks: ["Strategimöte", "Planering nästa vecka"] },
];

export default function VeckaPage() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = weekTasks.map((d, i) => ({
    ...d,
    date: format(addDays(weekStart, i), "d MMM", { locale: sv }),
    isToday: i === (new Date().getDay() + 6) % 7,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-purple-900 flex items-center gap-2">
          <CalendarRange size={22} className="text-purple-400" />
          Veckans plan
        </h1>
        <p className="text-sm text-purple-400 mt-0.5">
          Vecka {format(weekStart, "w", { locale: sv })} · {format(weekStart, "d MMM", { locale: sv })} –{" "}
          {format(addDays(weekStart, 4), "d MMM", { locale: sv })}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {days.map((day) => (
          <div
            key={day.day}
            className={`rounded-2xl p-4 border transition-all ${
              day.isToday
                ? "bg-purple-50 border-purple-200 shadow-md"
                : "bg-white border-purple-50 shadow-sm"
            }`}
          >
            <p
              className={`text-xs font-bold mb-0.5 ${
                day.isToday ? "text-purple-700" : "text-gray-500"
              }`}
            >
              {day.day}
            </p>
            <p className="text-xs text-gray-400 mb-3">{day.date}</p>
            <ul className="space-y-1.5">
              {day.tasks.map((task) => (
                <li
                  key={task}
                  className="text-xs text-gray-600 bg-white/80 rounded-lg px-2 py-1.5 border border-gray-100"
                >
                  {task}
                </li>
              ))}
            </ul>
            {day.isToday && (
              <div className="mt-3 flex items-center gap-1 text-[10px] text-purple-500 font-medium">
                <Clock size={10} />
                Idag
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
