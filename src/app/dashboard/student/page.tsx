"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LearningItem, Quiz, StudyTask } from "@/types/database";
import { useRole } from "@/context/role-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Timer,
  CheckCircle2,
  Circle,
  Plus,
  ArrowRight,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

export default function StudentDashboard() {
  const { grade, setIsOnboardingOpen } = useRole();

  const [studyTasks, setStudyTasks] = useState<StudyTask[]>([]);
  const [recentResources, setRecentResources] = useState<LearningItem[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick add task
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: tasksData } = await supabase
        .from("study_tasks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      const { data: resData } = await supabase
        .from("learning_items")
        .select("*")
        .eq("item_type", "resource")
        .order("created_at", { ascending: false })
        .limit(4);

      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      setStudyTasks(tasksData || []);
      setRecentResources(resData || []);
      setQuizzes(quizData || []);
    } catch (err) {
      console.error("Failed to load student dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleTask = async (task: StudyTask) => {
    const updatedStatus = !task.is_completed;
    setStudyTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_completed: updatedStatus } : t))
    );

    try {
      const { error } = await supabase
        .from("study_tasks")
        .update({ is_completed: updatedStatus })
        .eq("id", task.id);

      if (error) throw error;
      toast.success(updatedStatus ? "Target marked complete!" : "Target reopened.");
    } catch {
      toast.error("Failed to update study task.");
      loadData();
    }
  };

  const handleQuickAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setIsAddingTask(true);
      const { data, error } = await supabase
        .from("study_tasks")
        .insert({
          title: newTaskTitle.trim(),
          is_completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setStudyTasks((prev) => [data, ...prev]);
        setNewTaskTitle("");
        toast.success("Study target noted.");
      }
    } catch {
      toast.error("Failed to add target.");
    } finally {
      setIsAddingTask(false);
    }
  };

  const pendingTasksCount = studyTasks.filter((t) => !t.is_completed).length;

  const metrics = [
    {
      label: "Active targets",
      value: pendingTasksCount,
      hint: `${studyTasks.length} in your planner`,
      icon: CheckCircle2,
      tint: "from-[#A78BFA] to-[#7C3AED]",
    },
    {
      label: "Practice tests",
      value: quizzes.length,
      hint: "Ready for timed practice",
      icon: GraduationCap,
      tint: "from-[#67E8F9] to-[#0EA5E9]",
    },
    {
      label: "Curated archive",
      value: recentResources.length,
      hint: "Notes, papers & videos",
      icon: BookOpen,
      tint: "from-[#6EE7B7] to-[#10B981]",
    },
    {
      label: "Precision tools",
      value: "0.01s",
      hint: "Stopwatch & focus timer",
      icon: Timer,
      tint: "from-[#FCD34D] to-[#F59E0B]",
    },
  ];

  const portals = [
    {
      href: "/library",
      title: "Learning library",
      description: "Browse all subject materials, reference guides and notes.",
      icon: BookOpen,
      tint: "from-[#A78BFA] to-[#7C3AED]",
    },
    {
      href: "/question-papers",
      title: "Question papers",
      description: "Archived board papers, model sets and exam rubrics.",
      icon: FileText,
      tint: "from-[#67E8F9] to-[#0EA5E9]",
    },
    {
      href: "/quizzes",
      title: "Practice & quiz",
      description: "Timed objective tests with auto-scoring and reviews.",
      icon: GraduationCap,
      tint: "from-[#F9A8D4] to-[#DB2777]",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Academic workdesk</Badge>
              <Badge variant="outline">{grade || "Grade 10"}</Badge>
            </div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl lg:text-5xl">
              Scholar Study Desk
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#635F69] sm:text-base">
              Your personal study repository, active revision targets, question
              bank and focus timer — all in one soft space.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
            >
              Adjust grade
            </Button>
            <Link href="/tools">
              <Button size="sm">
                <Timer className="size-4" />
                Launch study tools
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-clayDeep"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#635F69]">
                    {metric.label}
                  </span>
                  <span
                    className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.tint} text-white shadow-clayButton`}
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
                <div className="font-heading text-3xl font-black tracking-tight text-[#332F3A]">
                  {metric.value}
                </div>
                <p className="mt-1 text-xs text-[#635F69]">{metric.hint}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Targets */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-black tracking-tight text-[#332F3A]">
                  Daily study targets
                </h2>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1 rounded-full bg-[#7C3AED]/10 px-3.5 py-2 font-heading text-xs font-extrabold text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/15"
                >
                  Full planner
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>

              <form onSubmit={handleQuickAddTask} className="mb-5 flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Log a new target (e.g. Revise trigonometry formulas)…"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  disabled={isAddingTask}
                  aria-label="New study target"
                />
                <Button
                  type="submit"
                  disabled={isAddingTask || !newTaskTitle.trim()}
                  className="shrink-0"
                >
                  {isAddingTask ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  Add target
                </Button>
              </form>

              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-3xl bg-[#EFEBF5] p-8 text-sm text-[#635F69]">
                    <Loader2 className="size-4 animate-spin" />
                    Loading your study ledger…
                  </div>
                ) : studyTasks.length === 0 ? (
                  <div className="rounded-3xl bg-[#EFEBF5] p-8 text-center">
                    <p className="text-sm font-medium text-[#332F3A]">
                      No active study targets yet.
                    </p>
                    <p className="mt-1 text-xs text-[#635F69]">
                      Add your first target above to structure today&apos;s revision.
                    </p>
                  </div>
                ) : (
                  studyTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200",
                        task.is_completed
                          ? "bg-[#EFEBF5]/60 opacity-60"
                          : "bg-[#EFEBF5]/80 hover:bg-[#EFEBF5]"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task)}
                          className={cn(
                            "shrink-0 cursor-pointer transition-colors",
                            task.is_completed
                              ? "text-[#10B981]"
                              : "text-[#635F69] hover:text-[#7C3AED]"
                          )}
                          title={task.is_completed ? "Mark incomplete" : "Mark complete"}
                        >
                          {task.is_completed ? (
                            <CheckCircle2 className="size-6" />
                          ) : (
                            <Circle className="size-6" />
                          )}
                        </button>
                        <span
                          className={cn(
                            "truncate text-sm font-medium text-[#332F3A]",
                            task.is_completed && "text-[#635F69] line-through"
                          )}
                        >
                          {task.title}
                        </span>
                      </div>

                      {task.target_date && (
                        <span className="shrink-0 text-[11px] text-[#635F69]">
                          {task.target_date}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Portals */}
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-black tracking-tight text-[#332F3A]">
                Quick academic portals
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {portals.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <Link
                      key={portal.href}
                      href={portal.href}
                      className="group rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-clayCard backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-clayDeep"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${portal.tint} text-white shadow-clayButton`}
                        >
                          <Icon className="size-5" />
                        </span>
                        <ArrowRight className="size-4 text-[#635F69] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#7C3AED]" />
                      </div>
                      <h4 className="font-heading text-base font-extrabold text-[#332F3A]">
                        {portal.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#635F69]">
                        {portal.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                  Curated library
                </h3>
                <Link
                  href="/library"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                >
                  Catalog
                  <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  <p className="rounded-2xl bg-[#EFEBF5] p-5 text-center text-xs text-[#635F69]">
                    Loading resources…
                  </p>
                ) : recentResources.length === 0 ? (
                  <p className="rounded-2xl bg-[#EFEBF5] p-5 text-center text-xs text-[#635F69]">
                    No resources catalogued yet.
                  </p>
                ) : (
                  recentResources.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-1 rounded-2xl px-3.5 py-3 transition-colors hover:bg-[#EFEBF5]/70"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#7C3AED]">
                          {item.subject || "General"}
                        </span>
                        <Badge variant="outline">{item.resource_type || "Resource"}</Badge>
                      </div>
                      <h4 className="line-clamp-1 text-sm font-bold text-[#332F3A]">
                        {item.title}
                      </h4>
                      {item.topic && (
                        <p className="text-[11px] text-[#635F69]">Topic: {item.topic}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                  Timed quizzes
                </h3>
                <Link
                  href="/quizzes"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                >
                  View all
                  <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {quizzes.length === 0 ? (
                  <p className="rounded-2xl bg-[#EFEBF5] p-5 text-center text-xs text-[#635F69]">
                    No quizzes authored yet.
                  </p>
                ) : (
                  quizzes.map((q) => (
                    <Link
                      key={q.id}
                      href={`/quizzes/${q.id}`}
                      className="group block space-y-1 rounded-2xl px-3.5 py-3 transition-colors hover:bg-[#EFEBF5]/70"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#0EA5E9]">
                          {q.subject || "Evaluation"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[#635F69]">
                          <Clock className="size-3" />
                          {Math.round(q.duration_seconds / 60)}m
                        </span>
                      </div>
                      <h4 className="line-clamp-1 text-sm font-bold text-[#332F3A] transition-colors group-hover:text-[#7C3AED]">
                        {q.title}
                      </h4>
                      <p className="text-[11px] text-[#635F69]">
                        {q.questions?.length || 0} questions · tap to begin
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#6D28D9] p-6 shadow-clayDeep">
              <div className="absolute -top-10 -right-6 size-32 rounded-full bg-white/20 blur-2xl" />
              <div className="relative space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Timer className="size-4" />
                  <span className="font-heading text-xs font-extrabold uppercase tracking-wide">
                    Focus timer
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/85">
                  Time an exam set or a Pomodoro sprint — the stopwatch stays
                  accurate even across background tabs.
                </p>
                <Link href="/tools" className="inline-block pt-2">
                  <Button
                    size="sm"
                    className="bg-white text-[#6D28D9] hover:bg-white"
                  >
                    Open stopwatch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
