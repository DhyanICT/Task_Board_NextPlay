import { CheckCheck, Clock3, ListTodo, TriangleAlert } from "lucide-react";
import { Task } from "@/types/task";
import { isTaskOverdue } from "@/lib/task-utils";

interface StatsStripProps {
  tasks: Task[];
}

export function StatsStrip({ tasks }: StatsStripProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const inFlight = tasks.filter((task) => task.status === "in_progress" || task.status === "in_review").length;
  const overdue = tasks.filter(isTaskOverdue).length;

  const stats = [
    {
      label: "Total tasks",
      value: total,
      icon: ListTodo,
      tone: "from-cyan-400/15 to-cyan-300/5 text-cyan-100",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCheck,
      tone: "from-emerald-400/15 to-emerald-300/5 text-emerald-100",
    },
    {
      label: "Active work",
      value: inFlight,
      icon: Clock3,
      tone: "from-violet-400/15 to-fuchsia-300/5 text-violet-100",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: TriangleAlert,
      tone: "from-rose-400/15 to-orange-300/5 text-rose-100",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article
            key={stat.label}
            className={`rounded-3xl border border-white/10 bg-gradient-to-br ${stat.tone} p-5 shadow-glow backdrop-blur-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-3 text-white">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
