"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { BoardColumn } from "@/components/board-column";
import { CreateTaskDrawer } from "@/components/create-task-drawer";
import { HeaderBar } from "@/components/header-bar";
import { LoadingBoard } from "@/components/loading-board";
import { StatsStrip } from "@/components/stats-strip";
import { BOARD_COLUMNS } from "@/constants/board";
import { getSupabaseClient } from "@/lib/supabase";
import { CreateTaskInput, Task, TaskPriority, TaskStatus } from "@/types/task";

function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function BoardPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");

  const loadTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    setTasks((data ?? []) as Task[]);
  }, [supabase]);

  const bootstrapSession = useCallback(async () => {
    setErrorMessage(null);
    setLoading(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        throw sessionError;
      }

      let session = sessionData.session;

      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) {
          throw signInError;
        }
        session = signInData.session;
      }

      if (!session?.user?.id) {
        throw new Error("Unable to create a guest session. Check anonymous sign-in in Supabase Auth.");
      }

      setGuestId(session.user.id);
      await loadTasks();
    } catch (error) {
      setErrorMessage(normalizeError(error));
    } finally {
      setLoading(false);
    }
  }, [loadTasks, supabase]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!active) {
        return;
      }
      await bootstrapSession();
    };

    void run();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) {
        return;
      }

      if (session?.user?.id) {
        setGuestId(session.user.id);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [bootstrapSession, supabase]);

  const filteredTasks = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchValue ||
        task.title.toLowerCase().includes(searchValue) ||
        task.description?.toLowerCase().includes(searchValue);
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [priorityFilter, search, tasks]);

  const handleCreateTask = async (input: CreateTaskInput) => {
    setCreating(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: input.title,
            description: input.description || null,
            priority: input.priority,
            due_date: input.due_date,
            status: "todo",
          },
        ])
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      setTasks((current) => [data as Task, ...current]);
    } catch (error) {
      setErrorMessage(normalizeError(error));
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceStatus = result.source.droppableId as TaskStatus;
    const destinationStatus = result.destination.droppableId as TaskStatus;

    if (sourceStatus === destinationStatus) {
      return;
    }

    const taskId = result.draggableId;
    const previousTasks = tasks;

    setUpdatingTaskId(taskId);
    setErrorMessage(null);
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: destinationStatus, updated_at: new Date().toISOString() } : task
      )
    );

    try {
      const { error } = await supabase.from("tasks").update({ status: destinationStatus }).eq("id", taskId);
      if (error) {
        throw error;
      }
    } catch (error) {
      setTasks(previousTasks);
      setErrorMessage(normalizeError(error));
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const hasActiveFilters = Boolean(search.trim()) || priorityFilter !== "all";

  return (
    <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <HeaderBar
        search={search}
        onSearchChange={setSearch}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onOpenCreate={() => setDrawerOpen(true)}
        guestId={guestId}
      />

      {errorMessage ? (
        <div className="flex flex-col items-start gap-3 rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-50 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none text-rose-200" />
            <p>{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => void bootstrapSession()}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      ) : null}

      {loading ? (
        <LoadingBoard />
      ) : (
        <>
          <StatsStrip tasks={tasks} />

          <DragDropContext onDragEnd={(result) => void handleDragEnd(result)}>
            <section className="grid gap-5 xl:grid-cols-4">
              {BOARD_COLUMNS.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  tasks={filteredTasks.filter((task) => task.status === column.id)}
                  updatingTaskId={updatingTaskId}
                  hasActiveFilters={hasActiveFilters}
                />
              ))}
            </section>
          </DragDropContext>
        </>
      )}

      <CreateTaskDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleCreateTask}
        submitting={creating}
      />
    </main>
  );
}
