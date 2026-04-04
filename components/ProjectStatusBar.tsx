interface Project {
  name: string;
  progress: number;
  color: string;
  tasks: number;
  done: number;
}

const defaultProjects: Project[] = [
  { name: "Pepper Deals", progress: 65, color: "from-orange-300 to-amber-300", tasks: 12, done: 8 },
  { name: "HomesForYou", progress: 40, color: "from-blue-300 to-cyan-300", tasks: 9, done: 4 },
  { name: "GavelDal", progress: 80, color: "from-amber-400 to-yellow-300", tasks: 7, done: 6 },
  { name: "Great Earth", progress: 55, color: "from-emerald-400 to-teal-300", tasks: 11, done: 6 },
  { name: "PrimeBets", progress: 30, color: "from-violet-400 to-purple-300", tasks: 8, done: 2 },
];

export default function ProjectStatusBars({ projects = defaultProjects }: { projects?: Project[] }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
      <h2 className="text-sm font-bold text-gray-700 mb-4">Projektstatus</h2>
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">{project.name}</span>
              <span className="text-xs text-gray-400">
                {project.done}/{project.tasks} uppgifter
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${project.color} rounded-full transition-all duration-700`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
