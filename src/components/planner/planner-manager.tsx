"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { StudyTask } from "@/types/database";
import {
  calculatePlannerMetrics,
  filterAndSortStudyTasks,
} from "@/lib/study-planner";
import { SAMPLE_STUDY_TASKS } from "@/lib/sample-study-tasks";
import { TaskCard } from "./task-card";
import { TaskFormDialog } from "./task-form-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ListTodo,
  Plus,
  RefreshCw,
  Search,
  X,
  Filter,
  Sparkles,
  Loader2,
  AlertCircle,
  Target,
} from "lucide-react";
import { toast } from "sonner";

export function PlannerManager() {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Quick add input
  const [quickTitle, setQuickTitle] = useState("");
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  // Dialog state
  const [editingTask, setEditingTask] = useState<StudyTask | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filters & date
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("study_tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      setTasks(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load study tasks.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Quick Add handler
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed) return;

    try {
      setIsQuickAdding(true);
      const { data, error: insertErr } = await supabase
        .from("study_tasks")
        .insert({
          title: trimmed,
          is_completed: false,
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      setTasks((prev) => [data, ...prev]);
      setQuickTitle("");
      toast.success("Study target added!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not add task.";
      toast.error(msg);
    } finally {
      setIsQuickAdding(false);
    }
  };

  // Toggle complete with optimistic UI update
  const handleToggleComplete = async (id: string, currentCompleted: boolean) => {
    const nextStatus = !currentCompleted;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_completed: nextStatus } : t))
    );

    try {
      const { error: updateErr } = await supabase
        .from("study_tasks")
        .update({ is_completed: nextStatus })
        .eq("id", id);

      if (updateErr) throw updateErr;

      toast.success(
        nextStatus ? "Target marked as completed!" : "Target reopened as pending."
      );
    } catch {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: currentCompleted } : t))
      );
      toast.error("Failed to update status.");
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    try {
      const { error: deleteErr } = await supabase
        .from("study_tasks")
        .delete()
        .eq("id", id);

      if (deleteErr) throw deleteErr;

      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Target removed.");
    } catch {
      toast.error("Failed to delete target.");
    }
  };

  const handleEditTask = (task: StudyTask) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  // Load sample data
  const handleSeedSampleTasks = async () => {
    try {
      setIsSeeding(true);
      const itemsToInsert = SAMPLE_STUDY_TASKS.map((item) => ({
        ...item,
        is_completed: false,
      }));

      const { error: insertErr } = await supabase
        .from("study_tasks")
        .insert(itemsToInsert);

      if (insertErr) throw insertErr;

      toast.success("Loaded 5 sample Nepali curriculum study targets!");
      await fetchTasks();
    } catch {
      toast.error("Failed to load sample tasks.");
    } finally {
      setIsSeeding(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => calculatePlannerMetrics(tasks), [tasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return filterAndSortStudyTasks(tasks, {
      statusFilter,
      searchQuery,
    });
  }, [tasks, statusFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-4 py-10 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-5 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Study planner</Badge>
            <Badge variant="outline">Daily targets · Revision</Badge>
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl">
            Student Study Planner
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#635F69]">
            Manage daily study targets, syllabus revision to-do lists and track
            completion progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <TaskFormDialog onTaskSaved={fetchTasks} />

          {tasks.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleTasks}
              disabled={isSeeding}
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4 text-[#F59E0B]" />
              )}
              <span>Load samples</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={fetchTasks}
            disabled={isLoading}
            title="Refresh tasks"
            aria-label="Refresh tasks"
          >
            <RefreshCw className={isLoading ? "size-5 animate-spin" : "size-5"} />
          </Button>
        </div>
      </div>

      {/* Progress Card Dashboard */}
      <div className="space-y-5 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:p-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="flex items-center gap-2 font-heading text-lg font-extrabold text-[#332F3A]">
              <Target className="size-5 text-[#7C3AED]" />
              <span>Target progress</span>
            </h3>
            <p className="mt-0.5 text-xs text-[#635F69]">
              {metrics.completed} of {metrics.total} targets accomplished
            </p>
          </div>

          <span className="font-heading text-3xl font-black text-[#7C3AED]">
            {metrics.percentage}%
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#EFEBF5] shadow-clayPressed">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] transition-all duration-500"
            style={{ width: `${metrics.percentage}%` }}
          />
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="xs"
              onClick={() => setStatusFilter("all")}
            >
              All ({metrics.total})
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="xs"
              onClick={() => setStatusFilter("pending")}
            >
              Pending ({metrics.pending})
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="xs"
              onClick={() => setStatusFilter("completed")}
            >
              Completed ({metrics.completed})
            </Button>
          </div>

          {searchQuery && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSearchQuery("")}
              className="text-[#635F69] hover:text-[#332F3A]"
            >
              Clear search
            </Button>
          )}
        </div>
      </div>

      {/* Quick Add Form + Search Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Inline Quick Add Input (takes 2 cols) */}
        <form
          onSubmit={handleQuickAdd}
          className="flex items-center gap-2 sm:col-span-2"
        >
          <div className="relative flex-1">
            <Plus className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-[#635F69]" />
            <Input
              placeholder="Quick add target: e.g. Revise Math Chapter 3…"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="pl-12 pr-5 text-sm"
              disabled={isQuickAdding}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!quickTitle.trim() || isQuickAdding}
            className="shrink-0"
          >
            {isQuickAdding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span>Add</span>
            )}
          </Button>
        </form>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-[#635F69]" />
          <Input
            placeholder="Search targets…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-11 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#635F69] hover:text-[#332F3A]"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Task List Area */}
      {isLoading ? (
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-[28px] border border-white/60 bg-white/40 shadow-clayPressed"
            />
          ))}
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-[32px] border border-[#DB2777]/20 bg-[#DB2777]/5 p-10 text-center">
          <AlertCircle className="mx-auto size-9 text-[#DB2777]" />
          <h3 className="font-heading text-lg font-extrabold text-[#DB2777]">
            Failed to load study targets
          </h3>
          <p className="mx-auto max-w-md text-sm text-[#635F69]">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchTasks}>
            <RefreshCw className="size-4" />
            <span>Try again</span>
          </Button>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty Database State */
        <div className="mx-auto my-8 max-w-md space-y-4 rounded-[40px] border border-dashed border-[#7C3AED]/25 bg-white/60 p-10 text-center shadow-clayPressed">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#7C3AED]/10 text-[#7C3AED]">
            <ListTodo className="size-8" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-[#332F3A]">
              No study targets yet
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#635F69]">
              Add daily study goals to stay focused on upcoming SEE exams and
              tuition coursework.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              onClick={handleSeedSampleTasks}
              disabled={isSeeding}
              className="w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load sample targets</span>
            </Button>

            <TaskFormDialog
              onTaskSaved={fetchTasks}
              triggerButton={
                <Button variant="outline" className="w-full sm:w-auto">
                  <Plus className="size-4" />
                  <span>Create target</span>
                </Button>
              }
            />
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Filter Empty State */
        <div className="mx-auto my-6 max-w-md space-y-3 rounded-[40px] border border-dashed border-[#7C3AED]/25 bg-white/60 p-10 text-center shadow-clayPressed">
          <Filter className="mx-auto size-9 text-[#635F69]" />
          <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
            No matching study targets
          </h3>
          <p className="text-sm text-[#635F69]">
            {statusFilter === "completed"
              ? "You haven't completed any targets in this view yet."
              : "No targets match your current filter or search."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
          >
            Show all targets
          </Button>
        </div>
      ) : (
        /* Task List */
        <div className="space-y-3 pt-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              now={currentDate}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <TaskFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={editingTask}
        onTaskSaved={() => {
          setIsEditDialogOpen(false);
          setEditingTask(null);
          fetchTasks();
        }}
      />
    </div>
  );
}
