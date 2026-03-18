"use client";

import { FormEvent, useEffect, useState } from "react";
import clsx from "clsx";
import { CalendarDays, FileText, Flag, X } from "lucide-react";
import { CreateTaskInput, TaskPriority } from "@/types/task";

interface CreateTaskDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  submitting: boolean;
}

const initialState = {
  title: "",
  description: "",
  priority: "normal" as TaskPriority,
  due_date: "",
};

export function CreateTaskDrawer({ open, onClose, onSubmit, submitting }: CreateTaskDrawerProps) {
  const [form, setForm] = useState(initialState);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setValidationError("Please add a task title.");
      return;
    }

    setValidationError(null);

    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      due_date: form.due_date || null,
    });

    setForm(initialState);
    onClose();
  };

  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-xl transform flex-col border-l border-white/10 bg-slate-950/95 shadow-2xl transition duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-sm text-cyan-200">Create a new card</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Add task to the board</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
          <label className="space-y-2">
            <span className="text-sm font-medium text-white">Title</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <FileText className="h-4 w-4 text-slate-400" />
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Design polished review state"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-white">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              placeholder="Add details, acceptance criteria, or notes."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-white">Priority</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Flag className="h-4 w-4 text-slate-400" />
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, priority: event.target.value as TaskPriority }))
                  }
                  className="w-full bg-transparent text-sm text-white outline-none"
                >
                  <option value="low" className="bg-slate-900">
                    Low
                  </option>
                  <option value="normal" className="bg-slate-900">
                    Normal
                  </option>
                  <option value="high" className="bg-slate-900">
                    High
                  </option>
                </select>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-white">Due date</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <CalendarDays className="h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(event) => setForm((current) => ({ ...current, due_date: event.target.value }))}
                  className="w-full bg-transparent text-sm text-white outline-none"
                />
              </div>
            </label>
          </div>

          {validationError ? (
            <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {validationError}
            </p>
          ) : null}

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:text-white"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
