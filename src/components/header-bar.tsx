import { Filter, Plus, Search, Sparkles, UserCircle2 } from "lucide-react";
import { TaskPriority } from "@/types/task";

interface HeaderBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: TaskPriority | "all";
  onPriorityFilterChange: (value: TaskPriority | "all") => void;
  onOpenCreate: () => void;
  guestId: string | null;
}

export function HeaderBar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onOpenCreate,
  guestId,
}: HeaderBarProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-glow backdrop-blur-xl">
      <div className="bg-hero-radial px-6 py-8 md:px-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Guest-ready Kanban board built for the assessment
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Beautiful task planning with fast drag-and-drop flow.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Create tasks, organize work across four stages, and keep everything isolated per guest session with Supabase Auth and RLS.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
              <UserCircle2 className="h-4 w-4 text-cyan-200" />
              {guestId ? `Guest workspace active: ${guestId.slice(0, 8)}...` : "Creating guest workspace..."}
            </div>
          </div>

          <div className="grid w-full gap-3 md:grid-cols-[1.2fr_180px_auto] xl:max-w-3xl">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 shadow-inner">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by title or description"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 shadow-inner">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(event) => onPriorityFilterChange(event.target.value as TaskPriority | "all")}
                className="w-full bg-transparent text-sm text-white outline-none"
              >
                <option value="all" className="bg-slate-900">
                  All priorities
                </option>
                <option value="high" className="bg-slate-900">
                  High priority
                </option>
                <option value="normal" className="bg-slate-900">
                  Normal priority
                </option>
                <option value="low" className="bg-slate-900">
                  Low priority
                </option>
              </select>
            </label>

            <button
              onClick={onOpenCreate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              type="button"
            >
              <Plus className="h-4 w-4" />
              New task
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
