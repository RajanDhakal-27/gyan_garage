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
  CheckCircle2,
  Circle,
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
import { cn } from "cn";

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
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Student Study Planner
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Task 05 • Must 5
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your daily study targets, syllabus revision to-do lists, and track completion progress.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <TaskFormDialog onTaskSaved={fetchTasks} />

          {tasks.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleTasks}
              disabled={isSeeding}
              className="gap-1.5 text-xs"
            >
              {isSeeding ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 text-amber-500" />
              )}
              <span>Load Sample Targets</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchTasks}
            disabled={isLoading}
            title="Refresh tasks"
            aria-label="Refresh tasks"
          >
            <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
          </Button>
        </div>
      </div>

      {/* Progress Card Dashboard */}
      <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <span>Target Progress</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {metrics.completed} of {metrics.total} targets accomplished
            </p>
          </div>

          <span className="text-2xl font-extrabold text-primary">
            {metrics.percentage}%
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${metrics.percentage}%` }}
          />
        </div>

        {/* Filter Controls Bar */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="h-7 text-xs px-2.5"
            >
              All ({metrics.total})
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
              className="h-7 text-xs px-2.5"
            >
              Pending ({metrics.pending})
            </Button>
            <Button
              variant={statusFilter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
              className="h-7 text-xs px-2.5"
            >
              Completed ({metrics.completed})
            </Button>
          </div>

          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear search
            </Button>
          )}
        </div>
      </div>

      {/* Quick Add Form + Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Inline Quick Add Input (takes 2 cols) */}
        <form onSubmit={handleQuickAdd} className="sm:col-span-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Quick add target: e.g. Revise Math Chapter 3..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="pl-8 text-sm"
              disabled={isQuickAdding}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!quickTitle.trim() || isQuickAdding}
            className="shrink-0 h-9"
          >
            {isQuickAdding ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <span>Add</span>
            )}
          </Button>
        </form>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search targets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-7 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3" />
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
              className="h-16 rounded-xl border border-muted bg-muted/20 animate-pulse p-4"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
          <AlertCircle className="size-8 text-destructive mx-auto" />
          <h3 className="font-semibold text-destructive">Failed to load study targets</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchTasks} className="gap-1.5">
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty Database State */
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <ListTodo className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              No study targets yet
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add your daily study goals to stay focused on upcoming SEE exams and tuition coursework.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="default"
              onClick={handleSeedSampleTasks}
              disabled={isSeeding}
              className="gap-1.5 shadow-sm w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load Sample Targets</span>
            </Button>

            <TaskFormDialog
              onTaskSaved={fetchTasks}
              triggerButton={
                <Button variant="outline" className="gap-1.5 w-full sm:w-auto">
                  <Plus className="size-4" />
                  <span>Create Custom Target</span>
                </Button>
              }
            />
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3 max-w-md mx-auto my-6">
          <Filter className="size-8 text-muted-foreground mx-auto" />
          <h3 className="font-medium text-foreground">No matching study targets</h3>
          <p className="text-xs text-muted-foreground">
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
            Show All Targets
          </Button>
        </div>
      ) : (
        /* Task List */
        <div className="space-y-2.5 pt-2">
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
