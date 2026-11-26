"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LearningItem, Quiz } from "@/types/database";
import { useRole } from "@/context/role-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileCheck2,
  GraduationCap,
  FileText,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Users,
  Layers,
  Sparkles,
  ClipboardList,
  FolderPlus,
  Loader2,
  School,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

export default function TeacherDashboard() {
  const { gradesTaught, setIsOnboardingOpen } = useRole();

  const [resources, setResources] = useState<LearningItem[]>([]);
  const [homeworks, setHomeworks] = useState<LearningItem[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Load learning items (resources and homework)
      const { data: items } = await supabase
        .from("learning_items")
        .select("*")
        .order("created_at", { ascending: false });

      const allItems = items || [];
      setResources(allItems.filter((i) => i.item_type === "resource"));
      setHomeworks(allItems.filter((i) => i.item_type === "homework"));

      // Load quizzes
      const { data: quizData } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      setQuizzes(quizData || []);
    } catch (err) {
      console.error("Failed to load teacher dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const questionPapersCount = resources.filter(
    (r) =>
      r.resource_type?.toLowerCase().includes("paper") ||
      r.resource_type?.toLowerCase().includes("question")
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Studio Header */}
        <div className="border-b border-border/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Educator Studio
              </span>
              <span className="text-border">/</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {gradesTaught && gradesTaught.length > 0 ? (
                  gradesTaught.map((g) => (
                    <Badge key={g} variant="outline" className="font-mono text-xs">
                      {g}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="font-mono text-xs">
                    Secondary Levels
                  </Badge>
                )}
              </div>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Curriculum & Instruction Studio
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Publish subject syllabi, author timed diagnostic quizzes, manage assignments, and curate past question papers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
              className="font-mono text-xs"
            >
              Update Taught Grades
            </Button>
            <Link href="/library">
              <Button size="sm" className="font-mono text-xs gap-1.5">
                <FolderPlus className="size-3.5" />
                Publish Resource
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Published Resources</span>
              <BookOpen className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              {resources.length}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Study notes, videos & textbooks
            </p>
          </Card>

          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Active Quizzes</span>
              <GraduationCap className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              {quizzes.length}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Objective timed evaluations
            </p>
          </Card>

          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Homework Tasks</span>
              <FileCheck2 className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              {homeworks.length}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Assignments with deadlines
            </p>
          </Card>

          <Card className="border-border/80 p-5 space-y-2 bg-card">
            <div className="flex items-center justify-between text-muted-foreground font-mono text-xs uppercase">
              <span>Question Papers</span>
              <FileText className="size-4 text-primary" />
            </div>
            <div className="font-serif text-3xl font-medium text-foreground">
              {questionPapersCount}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              Past exams & model question sets
            </p>
          </Card>
        </div>

        {/* Studio Operations / Action Launchers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/80 pb-2">
            <span className="font-mono text-xs text-primary font-bold">01.</span>
            <h2 className="font-serif text-2xl font-medium">Curriculum Management Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/library"
              className="p-5 border border-border/80 bg-card hover:border-primary transition-colors space-y-3 group block"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="size-6 text-primary" />
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-medium">Publish Material</h3>
              <p className="font-mono text-xs text-muted-foreground">
                Upload chapters, PDF links, video lectures, and revision summaries.
              </p>
            </Link>

            <Link
              href="/homework"
              className="p-5 border border-border/80 bg-card hover:border-primary transition-colors space-y-3 group block"
            >
              <div className="flex items-center justify-between">
                <FileCheck2 className="size-6 text-primary" />
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-medium">Assign Homework</h3>
              <p className="font-mono text-xs text-muted-foreground">
                Set problem sets, exercise due dates, and student submission guidelines.
              </p>
            </Link>

            <Link
              href="/quizzes"
              className="p-5 border border-border/80 bg-card hover:border-primary transition-colors space-y-3 group block"
            >
              <div className="flex items-center justify-between">
                <GraduationCap className="size-6 text-primary" />
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-medium">Author Quizzes</h3>
              <p className="font-mono text-xs text-muted-foreground">
                Create multiple-choice questions with marks, explanation notes, and timers.
              </p>
            </Link>

            <Link
              href="/question-papers"
              className="p-5 border border-border/80 bg-card hover:border-primary transition-colors space-y-3 group block"
            >
              <div className="flex items-center justify-between">
                <FileText className="size-6 text-primary" />
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-serif text-lg font-medium">Question Bank</h3>
              <p className="font-mono text-xs text-muted-foreground">
                Index previous examination papers, terminal mocks, and answer keys.
              </p>
            </Link>
          </div>
        </div>

        {/* Content Feeds: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Teaching Materials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-primary font-bold">02.</span>
                <h3 className="font-serif text-xl font-medium">Recent Teaching Materials</h3>
              </div>
              <Link
                href="/library"
                className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
              >
                Manage All <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-border/60 border border-border/80 bg-card">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground font-mono text-xs">
                  Loading teaching archive...
                </div>
              ) : resources.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    No learning materials published.
                  </p>
                  <Link href="/library">
                    <Button size="sm" variant="outline" className="font-mono text-xs mt-2">
                      Publish First Material
                    </Button>
                  </Link>
                </div>
              ) : (
                resources.slice(0, 5).map((r) => (
                  <div key={r.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-primary uppercase font-bold">
                          {r.subject || "General"}
                        </span>
                        <Badge variant="outline" className="font-mono text-[10px] py-0 px-1.5">
                          {r.resource_type || "Resource"}
                        </Badge>
                      </div>
                      <h4 className="font-serif text-sm font-medium">{r.title}</h4>
                      {r.topic && (
                        <p className="font-mono text-[11px] text-muted-foreground">
                          Topic: {r.topic}
                        </p>
                      )}
                    </div>

                    {r.external_url && (
                      <a
                        href={r.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors shrink-0 p-1"
                        title="Open external link"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Homework & Quizzes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-primary font-bold">03.</span>
                <h3 className="font-serif text-xl font-medium">Assignments & Quizzes</h3>
              </div>
              <Link
                href="/homework"
                className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
              >
                Homework View <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-border/60 border border-border/80 bg-card">
              {homeworks.length === 0 && quizzes.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground font-mono text-xs">
                  No active assignments or quizzes yet.
                </div>
              ) : (
                <>
                  {homeworks.slice(0, 3).map((hw) => (
                    <div key={hw.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-primary uppercase font-bold">
                            Assignment
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {hw.subject}
                          </span>
                        </div>
                        <h4 className="font-serif text-sm font-medium">{hw.title}</h4>
                        {hw.due_at && (
                          <p className="font-mono text-[11px] text-muted-foreground">
                            Due: {new Date(hw.due_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link href="/homework">
                        <Button size="sm" variant="ghost" className="font-mono text-xs">
                          Inspect
                        </Button>
                      </Link>
                    </div>
                  ))}

                  {quizzes.slice(0, 3).map((q) => (
                    <div key={q.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-primary uppercase font-bold">
                            Timed Quiz
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {q.subject}
                          </span>
                        </div>
                        <h4 className="font-serif text-sm font-medium">{q.title}</h4>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {q.questions?.length || 0} Questions • {Math.round(q.duration_seconds / 60)}m
                        </p>
                      </div>
                      <Link href={`/quizzes/${q.id}`}>
                        <Button size="sm" variant="ghost" className="font-mono text-xs">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
