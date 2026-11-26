"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LearningItem, Quiz, StudyTask } from "@/types/database";
import { useRole } from "@/context/role-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  Clock,
  Award,
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

      // Load tasks
      const { data: tasksData } = await supabase
        .from("study_tasks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      // Load resources
      const { data: resData } = await supabase
        .from("learning_items")
        .select("*")
        .eq("item_type", "resource")
        .order("created_at", { ascending: false })
        .limit(4);

      // Load quizzes
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

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Desk Header */}
        <div className="border-b border-border/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Academic Workdesk
              </span>
              <span className="text-border">/</span>
              <Badge variant="outline" className="font-mono text-xs">
                {grade || "Grade 10"}
              </Badge>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Scholar Study Desk
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Your personalized study repository, active revision targets, question bank, and precision timer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
              className="font-mono text-xs"
            >
              Adjust Grade
            </Button>
            <Link href="/tools">
              <Button size="sm" className="font-mono text-xs gap-1.5">
                <Timer className="size-3.5" />
                Launch Study Tools
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Active Targets</span>
              <CheckCircle2 className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              {pendingTasksCount}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {studyTasks.length} recorded in current planner
            </p>
          </Card>

          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Practice Tests</span>
              <GraduationCap className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              {quizzes.length}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Ready for timed self-evaluation
            </p>
          </Card>

          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Curated Archive</span>
              <BookOpen className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              {recentResources.length}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Textbooks, notes, & video lessons
            </p>
          </Card>

          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Stationery Tools</span>
              <Timer className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              0.01s
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Monotonic precision stopwatch & timer
            </p>
          </Card>
        </div>

        {/* Main Grid: Targets on Left, Curated on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Study Targets (Planner) - 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-primary font-bold">01.</span>
                <h2 className="font-serif text-2xl font-medium">Daily Study Targets</h2>
              </div>
              <Link
                href="/tools"
                className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
              >
                Full Planner <ChevronRight className="size-3" />
              </Link>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleQuickAddTask} className="flex gap-2">
              <Input
                placeholder="Log a new topic or target (e.g., Revise Trigonometry formulas)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="font-mono text-xs bg-card"
                disabled={isAddingTask}
              />
              <Button
                type="submit"
                disabled={isAddingTask || !newTaskTitle.trim()}
                className="font-mono text-xs shrink-0 gap-1.5"
              >
                {isAddingTask ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Plus className="size-3.5" />
                )}
                Add Target
              </Button>
            </form>

            {/* Task List */}
            <div className="divide-y divide-border/60 border border-border/80 bg-card">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground font-mono text-xs flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Accessing study ledger...
                </div>
              ) : studyTasks.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    No active study targets logged.
                  </p>
                  <p className="font-serif text-sm italic">
                    Add your first target above to structure today's revision.
                  </p>
                </div>
              ) : (
                studyTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "p-4 flex items-center justify-between gap-4 transition-colors hover:bg-muted/40",
                      task.is_completed && "opacity-60 bg-muted/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task)}
                        className="text-primary hover:text-primary/80 transition-colors shrink-0"
                        title={task.is_completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {task.is_completed ? (
                          <CheckCircle2 className="size-5 text-primary" />
                        ) : (
                          <Circle className="size-5 text-muted-foreground" />
                        )}
                      </button>
                      <span
                        className={cn(
                          "font-mono text-xs sm:text-sm text-foreground",
                          task.is_completed && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.target_date && (
                      <span className="font-mono text-[10px] text-muted-foreground uppercase shrink-0">
                        {task.target_date}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Quick Navigation Utility Grid */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                <span className="font-mono text-xs text-primary font-bold">02.</span>
                <h3 className="font-serif text-xl font-medium">Quick Academic Portals</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/library"
                  className="group block p-4 border border-border/80 bg-card hover:border-primary transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <BookOpen className="size-5 text-primary" />
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-serif text-base font-medium">Learning Library</h4>
                  <p className="font-mono text-[11px] text-muted-foreground line-clamp-2">
                    Browse all subject materials, reference guides, and notes.
                  </p>
                </Link>

                <Link
                  href="/question-papers"
                  className="group block p-4 border border-border/80 bg-card hover:border-primary transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <FileText className="size-5 text-primary" />
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-serif text-base font-medium">Question Papers</h4>
                  <p className="font-mono text-[11px] text-muted-foreground line-clamp-2">
                    Archived past board papers, model sets, and exam rubrics.
                  </p>
                </Link>

                <Link
                  href="/quizzes"
                  className="group block p-4 border border-border/80 bg-card hover:border-primary transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <GraduationCap className="size-5 text-primary" />
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-serif text-base font-medium">Practice & Quiz</h4>
                  <p className="font-mono text-[11px] text-muted-foreground line-clamp-2">
                    Timed objective tests with auto-scoring and reviews.
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Materials & Timed Tests */}
          <div className="space-y-6">
            {/* Recent Resources */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">03.</span>
                  <h3 className="font-serif text-xl font-medium">Curated Library</h3>
                </div>
                <Link
                  href="/library"
                  className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                >
                  Catalog <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="divide-y divide-border/60 border border-border/80 bg-card">
                {isLoading ? (
                  <div className="p-6 text-center text-muted-foreground font-mono text-xs">
                    Loading resources...
                  </div>
                ) : recentResources.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground font-mono text-xs">
                    No resources cataloged yet.
                  </div>
                ) : (
                  recentResources.map((item) => (
                    <div key={item.id} className="p-3.5 space-y-1 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
                          {item.subject || "General"}
                        </span>
                        <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5">
                          {item.resource_type || "Resource"}
                        </Badge>
                      </div>
                      <h4 className="font-serif text-sm font-medium line-clamp-1">
                        {item.title}
                      </h4>
                      {item.topic && (
                        <p className="font-mono text-[10px] text-muted-foreground">
                          Topic: {item.topic}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quizzes Available */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary font-bold">04.</span>
                  <h3 className="font-serif text-xl font-medium">Timed Quizzes</h3>
                </div>
                <Link
                  href="/quizzes"
                  className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight className="size-3" />
                </Link>
              </div>

              <div className="divide-y divide-border/60 border border-border/80 bg-card">
                {quizzes.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground font-mono text-xs">
                    No quizzes authored yet.
                  </div>
                ) : (
                  quizzes.map((q) => (
                    <Link
                      key={q.id}
                      href={`/quizzes/${q.id}`}
                      className="block p-3.5 hover:bg-muted/40 transition-colors space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-primary uppercase font-medium">
                          {q.subject || "Evaluation"}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {Math.round(q.duration_seconds / 60)}m
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                        {q.title}
                      </h4>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {q.questions?.length || 0} questions • Click to begin session
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Study Target Focus Box */}
            <div className="p-4 border border-border/80 bg-secondary/50 space-y-2">
              <div className="flex items-center gap-2">
                <Timer className="size-4 text-primary" />
                <span className="font-mono text-xs uppercase font-semibold text-primary">
                  Monotonic Precision Timing
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                Need to time an examination set or Pomodoro interval? The stopwatch runs with millisecond accuracy across background tabs.
              </p>
              <Link href="/tools" className="inline-block pt-1">
                <Button size="sm" variant="outline" className="font-mono text-xs">
                  Open Stopwatch & Timer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
