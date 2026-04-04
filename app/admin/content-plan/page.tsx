import { FileText, Calendar } from "lucide-react";
import QuickNote from "@/components/QuickNote";

const months = ["April", "Maj", "Juni"];
const contentTypes = ["Blogg", "Instagram", "TikTok", "Newsletter", "LinkedIn"];

const plan: Record<string, Record<string, string>> = {
  "Pepper Deals": { Blogg: "4 inlägg", Instagram: "12 inlägg", Newsletter: "4 utskick" },
  "Great Earth": { Blogg: "2 inlägg", Instagram: "8 inlägg", TikTok: "4 videos" },
  "HomesForYou": { Blogg: "6 guider", LinkedIn: "8 inlägg" },
  "GavelDal": { Instagram: "6 inlägg", Newsletter: "2 utskick" },
  "PrimeBets": { Blogg: "3 inlägg", Instagram: "4 inlägg" },
};

const upcoming = [
  { date: "5 Apr", title: "Great Earth produktguide", type: "Blogg", project: "Great Earth" },
  { date: "8 Apr", title: "Pepper Deals haul", type: "TikTok", project: "Pepper Deals" },
  { date: "10 Apr", title: "HomesForYou bostadsguide Sthlm", type: "Blogg", project: "HomesForYou" },
  { date: "12 Apr", title: "PrimeBets odds-förklaring", type: "Blogg", project: "PrimeBets" },
  { date: "15 Apr", title: "Newsletter April", type: "Newsletter", project: "Alla" },
];

const typeColors: Record<string, string> = {
  Blogg: "bg-blue-100 text-blue-600",
  Instagram: "bg-pink-100 text-pink-600",
  TikTok: "bg-purple-100 text-purple-600",
  Newsletter: "bg-amber-100 text-amber-600",
  LinkedIn: "bg-indigo-100 text-indigo-600",
};

export default function ContentPlanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <FileText size={20} className="text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-purple-900">Content Plan</h1>
          <p className="text-sm text-gray-400">Publiceringsschema · Alla kanaler</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          {/* Upcoming */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar size={14} className="text-indigo-500" /> Kommande publiceringar
            </h2>
            <div className="space-y-2">
              {upcoming.map((item) => (
                <div key={item.title} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-mono text-gray-400 w-12 shrink-0">{item.date}</span>
                  <p className="text-sm font-medium text-gray-700 flex-1">{item.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type] || "bg-gray-100 text-gray-600"}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-400 w-24 text-right">{item.project}</span>
                </div>
              ))}
            </div>
          </div>

          <QuickNote />
        </div>

        <div className="space-y-4">
          {/* Overview per project */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Per projekt</h2>
            <div className="space-y-4">
              {Object.entries(plan).map(([project, channels]) => (
                <div key={project}>
                  <p className="text-xs font-semibold text-gray-600 mb-1">{project}</p>
                  <div className="space-y-1">
                    {Object.entries(channels).map(([channel, count]) => (
                      <div key={channel} className="flex justify-between text-xs">
                        <span className="text-gray-400">{channel}</span>
                        <span className="font-medium text-gray-600">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
