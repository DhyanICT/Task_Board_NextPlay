import { Draggable } from "@hello-pangea/dnd";
import clsx from "clsx";
import { CalendarDays, GripVertical } from "lucide-react";
import { dueDateClasses, formatCreatedAt, formatDueDate, formatPriority, getDueDateState, priorityClasses } from "@/lib/task-utils";
import { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  index: number;
  isUpdating: boolean;
}

export function TaskCard({ task, index, isUpdating }: TaskCardProps) {
  const dueState = getDueDateState(task.due_date);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={clsx(
            "group rounded-3xl border border-white/10 bg-slate-950/70 p-4 shadow-glow transition duration-200",
            snapshot.isDragging && "rotate-[1deg] border-cyan-300/40 shadow-2xl",
            isUpdating && "opacity-70"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white md:text-base">{task.title}</h3>
              {task.description ? (
                <p
                  className="text-sm leading-6 text-slate-300"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-slate-500">No extra details added yet.</p>
              )}
            </div>

            <button
              type="button"
              aria-label="Drag task"
              className="cursor-grab rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-400 transition group-hover:text-white"
              {...provided.dragHandleProps}
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className={clsx("rounded-full border px-2.5 py-1 text-xs font-medium", priorityClasses(task.priority))}>
              {formatPriority(task.priority)}
            </span>
            <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", dueDateClasses(dueState))}>
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDueDate(task.due_date)}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Created {formatCreatedAt(task.created_at)}</span>
            {isUpdating ? <span className="text-cyan-200">Saving...</span> : null}
          </div>
        </article>
      )}
    </Draggable>
  );
}
