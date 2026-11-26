"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LearningItem, Quiz } from "@/types/database";
import { useRole } from "@/context/role-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileCheck2,
  GraduationCap,
  FileText,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  FolderPlus,
  Loader2,
} from "lucide-react";

export default function TeacherDashboard() {
  const { gradesTaught, setIsOnboardingOpen } = useRole();

  const [resources, setResources] = useState<LearningItem[]>([]);
  const [homeworks, setHomeworks] = useState<LearningItem[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: items } = await supabase
        .from("learning_items")
        .select("*")
        .order("created_at", { ascending: false });

      const allItems = items || [];
      setResources(allItems.filter((i) => i.item_type === "resource"));
      setHomeworks(allItems.filter((i) => i.item_type === "homework"));

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

  const metrics = [
    {
      label: "Published resources",
      value: resources.length,
      hint: "Notes, videos & textbooks",
      icon: BookOpen,
      tint: "from-[#A78BFA] to-[#7C3AED]",
    },
    {
      label: "Active quizzes",
      value: quizzes.length,
      hint: "Timed evaluations",
      icon: GraduationCap,
      tint: "from-[#67E8F9] to-[#0EA5E9]",
    },
    {
      label: "Homework tasks",
      value: homeworks.length,
      hint: "Assignments with deadlines",
      icon: FileCheck2,
      tint: "from-[#6EE7B7] to-[#10B981]",
    },
    {
      label: "Question papers",
      value: questionPapersCount,
      hint: "Past exams & model sets",
      icon: FileText,
      tint: "from-[#FCD34D] to-[#F59E0B]",
    },
  ];

  const actions = [
    {
      href: "/library",
      title: "Publish material",
      description:
        "Upload chapters, PDF links, video lectures and revision summaries.",
      icon: BookOpen,
      tint: "from-[#A78BFA] to-[#7C3AED]",
    },
    {
      href: "/homework",
      title: "Assign homework",
      description:
        "Set problem sets, exercise due dates and submission guidelines.",
      icon: FileCheck2,
      tint: "from-[#6EE7B7] to-[#10B981]",
    },
    {
      href: "/quizzes",
      title: "Author quizzes",
      description:
        "Create multiple-choice questions with marks, notes and timers.",
      icon: GraduationCap,
      tint: "from-[#67E8F9] to-[#0EA5E9]",
    },
    {
      href: "/question-papers",
      title: "Question bank",
      description:
        "Index previous papers, terminal mocks and answer keys.",
      icon: FileText,
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
              <Badge variant="secondary">Educator studio</Badge>
              {gradesTaught && gradesTaught.length > 0 ? (
                gradesTaught.map((g) => (
                  <Badge key={g} variant="outline">
                    {g}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline">Secondary levels</Badge>
              )}
            </div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl lg:text-5xl">
              Curriculum & Instruction Studio
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#635F69] sm:text-base">
              Publish subject syllabi, author timed diagnostic quizzes, manage
              assignments and curate past question papers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
            >
              Update taught grades
            </Button>
            <Link href="/library">
              <Button size="sm">
                <FolderPlus className="size-4" />
                Publish resource
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

        {/* Actions */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl font-black tracking-tight text-[#332F3A]">
            Curriculum management
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-clayCard backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-clayDeep"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.tint} text-white shadow-clayButton`}
                    >
                      <Icon className="size-6" />
                    </span>
                    <ArrowRight className="size-4 text-[#635F69] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#7C3AED]" />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                    {action.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#635F69]">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Feeds */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-xl font-black tracking-tight text-[#332F3A]">
                Recent teaching materials
              </h3>
              <Link
                href="/library"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
              >
                Manage all
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {isLoading ? (
                <p className="flex items-center justify-center gap-2 rounded-2xl bg-[#EFEBF5] p-6 text-xs text-[#635F69]">
                  <Loader2 className="size-4 animate-spin" />
                  Loading teaching archive…
                </p>
              ) : resources.length === 0 ? (
                <div className="rounded-2xl bg-[#EFEBF5] p-6 text-center">
                  <p className="text-xs text-[#635F69]">
                    No learning materials published yet.
                  </p>
                  <Link href="/library" className="mt-3 inline-block">
                    <Button size="sm" variant="outline">
                      Publish first material
                    </Button>
                  </Link>
                </div>
              ) : (
                resources.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-[#EFEBF5]/70"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#7C3AED]">
                          {r.subject || "General"}
                        </span>
                        <Badge variant="outline">
                          {r.resource_type || "Resource"}
                        </Badge>
                      </div>
                      <h4 className="truncate text-sm font-bold text-[#332F3A]">
                        {r.title}
                      </h4>
                      {r.topic && (
                        <p className="text-[11px] text-[#635F69]">Topic: {r.topic}</p>
                      )}
                    </div>

                    {r.external_url && (
                      <a
                        href={r.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-full p-2 text-[#635F69] transition-colors hover:bg-[#7C3AED]/10 hover:text-[#7C3AED]"
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

          <div className="rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-xl font-black tracking-tight text-[#332F3A]">
                Assignments & quizzes
              </h3>
              <Link
                href="/homework"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
              >
                Homework
                <ChevronRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {homeworks.length === 0 && quizzes.length === 0 ? (
                <p className="rounded-2xl bg-[#EFEBF5] p-6 text-center text-xs text-[#635F69]">
                  No active assignments or quizzes yet.
                </p>
              ) : (
                <>
                  {homeworks.slice(0, 3).map((hw) => (
                    <div
                      key={hw.id}
                      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-[#EFEBF5]/70"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#10B981]">
                            Assignment
                          </span>
                          <span className="text-[10px] text-[#635F69]">
                            {hw.subject}
                          </span>
                        </div>
                        <h4 className="truncate text-sm font-bold text-[#332F3A]">
                          {hw.title}
                        </h4>
                        {hw.due_at && (
                          <p className="text-[11px] text-[#635F69]">
                            Due: {new Date(hw.due_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link href="/homework">
                        <Button size="xs" variant="ghost">
                          Inspect
                        </Button>
                      </Link>
                    </div>
                  ))}

                  {quizzes.slice(0, 3).map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-[#EFEBF5]/70"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-[10px] font-extrabold uppercase tracking-wide text-[#0EA5E9]">
                            Timed quiz
                          </span>
                          <span className="text-[10px] text-[#635F69]">{q.subject}</span>
                        </div>
                        <h4 className="truncate text-sm font-bold text-[#332F3A]">
                          {q.title}
                        </h4>
                        <p className="text-[11px] text-[#635F69]">
                          {q.questions?.length || 0} questions ·{" "}
                          {Math.round(q.duration_seconds / 60)}m
                        </p>
                      </div>
                      <Link href={`/quizzes/${q.id}`}>
                        <Button size="xs" variant="ghost">
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
