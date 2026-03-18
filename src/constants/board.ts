import { TaskPriority, TaskStatus } from "@/types/task";

export const BOARD_COLUMNS: Array<{
  id: TaskStatus;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    id: "todo",
    title: "To Do",
    description: "Ideas and upcoming work",
    accent: "from-sky-400/25 to-cyan-300/10",
  },
  {
    id: "in_progress",
    title: "In Progress",
    description: "Tasks actively being built",
    accent: "from-violet-400/25 to-fuchsia-300/10",
  },
  {
    id: "in_review",
    title: "In Review",
    description: "QA, polish, and feedback",
    accent: "from-amber-400/25 to-orange-300/10",
  },
  {
    id: "done",
    title: "Done",
    description: "Shipped and completed work",
    accent: "from-emerald-400/25 to-green-300/10",
  },
];

export const PRIORITY_OPTIONS: TaskPriority[] = ["low", "normal", "high"];
