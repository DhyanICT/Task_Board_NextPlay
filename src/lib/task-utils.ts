import { format, isBefore, isToday } from "date-fns";
import { Task, TaskPriority } from "@/types/task";

export function formatPriority(priority: TaskPriority): string {
  switch (priority) {
    case "high":
      return "High";
    case "low":
      return "Low";
    default:
      return "Normal";
  }
}

export function priorityClasses(priority: TaskPriority): string {
  switch (priority) {
    case "high":
      return "border-rose-400/30 bg-rose-400/10 text-rose-100";
    case "low":
      return "border-sky-400/30 bg-sky-400/10 text-sky-100";
    default:
      return "border-violet-400/30 bg-violet-400/10 text-violet-100";
  }
}

export function getDueDateState(dueDate: string | null): "none" | "today" | "soon" | "overdue" | "later" {
  if (!dueDate) {
    return "none";
  }

  const date = new Date(`${dueDate}T12:00:00`);
  const now = new Date();
  const soonThreshold = new Date();
  soonThreshold.setDate(soonThreshold.getDate() + 3);

  if (isToday(date)) {
    return "today";
  }

  if (isBefore(date, new Date(now.getFullYear(), now.getMonth(), now.getDate()))) {
    return "overdue";
  }

  if (isBefore(date, soonThreshold)) {
    return "soon";
  }

  return "later";
}

export function dueDateClasses(state: ReturnType<typeof getDueDateState>): string {
  switch (state) {
    case "overdue":
      return "border-rose-400/30 bg-rose-500/10 text-rose-100";
    case "today":
      return "border-amber-400/30 bg-amber-500/10 text-amber-50";
    case "soon":
      return "border-orange-400/30 bg-orange-500/10 text-orange-50";
    case "later":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-50";
    default:
      return "border-slate-700 bg-slate-800/70 text-slate-300";
  }
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) {
    return "No due date";
  }

  return format(new Date(`${dueDate}T12:00:00`), "MMM d");
}

export function formatCreatedAt(timestamp: string): string {
  return format(new Date(timestamp), "MMM d, yyyy");
}

export function isTaskOverdue(task: Task): boolean {
  return getDueDateState(task.due_date) === "overdue";
}
