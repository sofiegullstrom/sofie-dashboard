import { LucideIcon } from "lucide-react";
import QuickNote from "./QuickNote";

interface ProjectPageProps {
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  progress: number;
  barColor: string;
  tasks: { title: string; priority: "high" | "medium" | "low"; est: string }[];
}

const priorityConfig = {
  high: { label: "Hög", color: "bg-red-100 text-red-600" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-600" },
  low: { label: "Låg", color: "bg-green-100 text-green-600" },
};

export default function ProjectPage({
  name,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  progress,
  barColor,
  tasks,
}: ProjectPageProps) {
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
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Uppgifter</h2>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.title} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 flex-1">{task.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[task.priority].color}`}>
                    {priorityConfig[task.priority].label}
                  </span>
                  <span className="text-xs text-gray-400">{task.est}</span>
                </div>
              ))}
            </div>
          </div>
          <QuickNote />
        </div>

        <div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Progress</h2>
            <div className="text-center mb-3">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-pink-500">
                {progress}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor} rounded-full transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
