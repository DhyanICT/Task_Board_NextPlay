import clsx from "clsx";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/task-card";
import { Task } from "@/types/task";

interface BoardColumnProps {
  column: {
    id: string;
    title: string;
    description: string;
    accent: string;
  };
  tasks: Task[];
  updatingTaskId: string | null;
  hasActiveFilters: boolean;
}

export function BoardColumn({ column, tasks, updatingTaskId, hasActiveFilters }: BoardColumnProps) {
  return (
    <div className="flex min-h-[540px] flex-col rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className={clsx("rounded-t-[2rem] border-b border-white/10 bg-gradient-to-r px-5 py-5", column.accent)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{column.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{column.description}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-sm text-white">
            {tasks.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              "flex flex-1 flex-col gap-3 p-4 transition",
              snapshot.isDraggingOver && "bg-cyan-400/5"
            )}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  isUpdating={updatingTaskId === task.id}
                />
              ))
            ) : (
              <div className="flex h-full min-h-[220px] flex-1 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/30 p-6 text-center">
                <div className="max-w-xs space-y-2">
                  <p className="text-sm font-medium text-white">Nothing here yet.</p>
                  <p className="text-sm leading-6 text-slate-400">
                    {hasActiveFilters
                      ? "No tasks match your current search or priority filter."
                      : "Drop a task here or create a new one to keep the board moving."}
                  </p>
                </div>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
