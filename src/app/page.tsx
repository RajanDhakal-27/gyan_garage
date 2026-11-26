"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LearningItem } from "@/types/database";
import { useRole } from "@/context/role-context";
import { TravellingNotebook } from "@/components/home/travelling-notebook";
import { SelfDrawingDiagram } from "@/components/home/self-drawing-diagram";
import { OversizedWordmark } from "@/components/home/oversized-wordmark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  FileText,
  GraduationCap,
  Timer,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  School,
  Check,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Curriculum notes",
    description: "CDC-aligned notes, proofs and summaries for every chapter.",
    tint: "from-[#A78BFA] to-[#7C3AED]",
  },
  {
    icon: GraduationCap,
    title: "Timed practice",
    description: "Self-grading quizzes with instant scores and grade bands.",
    tint: "from-[#67E8F9] to-[#0EA5E9]",
  },
  {
    icon: Timer,
    title: "Study tools",
    description: "Stopwatch, focus timer and target tracker built for sprints.",
    tint: "from-[#6EE7B7] to-[#10B981]",
  },
  {
    icon: FileText,
    title: "Question papers",
    description: "Model papers and past questions organised by year.",
    tint: "from-[#FCD34D] to-[#F59E0B]",
  },
];

const SUBJECT_INDEX = [
  {
    name: "Compulsory & Opt Mathematics",
    code: "MATH.10",
    topics: "Trigonometry, Coordinate Geometry, Vectors, Statistics",
    resourceCount: "4 Materials",
    tint: "bg-[#7C3AED]/10 text-[#7C3AED]",
  },
  {
    name: "Science & Technology",
    code: "SCI.10",
    topics: "Gravitation, Pressure, Optics, Chemical Reactions",
    resourceCount: "6 Materials",
    tint: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  },
  {
    name: "Compulsory English",
    code: "ENG.10",
    topics: "Model Question Papers, Grammar, Free Writing Essays",
    resourceCount: "5 Materials",
    tint: "bg-[#DB2777]/10 text-[#DB2777]",
  },
  {
    name: "Social Studies & Governance",
    code: "SOC.10",
    topics: "Constitution of Nepal 2072, Federalism, Historical Milestones",
    resourceCount: "3 Materials",
    tint: "bg-[#10B981]/10 text-[#10B981]",
  },
];

export default function HomePage() {
  const { role, grade, isTeacher } = useRole();
  const [featuredResources, setFeaturedResources] = useState<LearningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const { data } = await supabase
          .from("learning_items")
          .select("*")
          .eq("item_type", "resource")
          .order("created_at", { ascending: false })
          .limit(6);
        setFeaturedResources(data || []);
      } catch (err) {
        console.error("Failed to load featured resources", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#332F3A]">
      <TravellingNotebook />

      {/* Hero */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="space-y-7 lg:col-span-7">
            <Badge variant="outline" className="gap-2 px-4 py-2">
              <Sparkles className="size-4 text-[#F59E0B]" />
              Kathmandu, Nepal · Grade 6–12
            </Badge>

            <h1 className="font-heading text-4xl leading-[1.05] font-black tracking-tight text-[#332F3A] sm:text-6xl lg:text-7xl">
              A softer way to{" "}
              <span className="text-[#7C3AED]">learn, practice</span> and grow.
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-[#635F69] sm:text-lg">
              Curriculum-verified notes, CDC model question papers, timed
              practice tests and playful study tools — all in one calm,
              clutter-free space built for Nepali students and teachers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={isTeacher ? "/dashboard/teacher" : "/dashboard/student"}>
                <Button size="lg">
                  <span>Enter {isTeacher ? "Teacher Studio" : "Student Desk"}</span>
                  <ArrowRight className="size-5" />
                </Button>
              </Link>

              <Link href="/library">
                <Button variant="outline" size="lg">
                  <BookOpen className="size-5" />
                  <span>Browse Library</span>
                </Button>
              </Link>

              <Link href="/tools">
                <Button variant="secondary" size="lg">
                  <Timer className="size-5" />
                  <span>Study Tools</span>
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs text-[#635F69] shadow-clayCard backdrop-blur-md">
              <span className="inline-block size-2.5 animate-pulse rounded-full bg-[#10B981]" />
              <span>
                Currently set up as{" "}
                <strong className="font-heading font-extrabold text-[#332F3A]">
                  {role}
                </strong>{" "}
                · {isTeacher ? "Educator" : grade}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <SelfDrawingDiagram />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-clayDeep"
              >
                <div
                  className={`mb-5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.tint} text-white shadow-clayButton transition-transform duration-300 group-hover:-rotate-6`}
                >
                  <Icon className="size-7" />
                </div>
                <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#635F69]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Editorial principle */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="overflow-hidden rounded-[48px] border border-white/70 bg-white/60 p-6 shadow-clayDeep backdrop-blur-xl sm:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-5 lg:col-span-6">
              <Badge variant="secondary">
                <Layers className="size-3.5" />
                The Garage Principle
              </Badge>
              <h2 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl">
                Learning materials organised with intent, clarity and rigor.
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-[#635F69] sm:text-base">
                <p>
                  Too often, study routines get scattered across unstructured
                  playlists, random Drive links and unverified mock questions.
                </p>
                <p>
                  Gyan Garage brings notes, past papers, self-grading tests and
                  study clocks into a single tactile layout — everything sorted
                  by subject, chapter and academic level.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-6">
              {[
                "Curriculum-aligned CDC notes & proofs",
                "Timed tests with automated grading",
                "Focus stopwatch with lap recording",
                "Homework assignments with deadlines",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[24px] border border-white/60 bg-[#EFEBF5]/70 p-4 shadow-clayPressed"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981]">
                    <Check className="size-4 stroke-[3]" />
                  </span>
                  <span className="text-sm font-medium text-[#332F3A]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured resources */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Badge variant="secondary">
              <Sparkles className="size-3.5" />
              Recently catalogued
            </Badge>
            <h2 className="font-heading text-3xl font-black tracking-tight text-[#332F3A]">
              Selected learning resources
            </h2>
          </div>

          <Link
            href="/library"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2.5 font-heading text-sm font-extrabold text-[#7C3AED] shadow-clayCard backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>View all</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-[32px] border border-white/60 bg-white/40 shadow-clayPressed"
              />
            ))}
          </div>
        ) : featuredResources.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[40px] border border-dashed border-[#7C3AED]/25 bg-white/50 p-12 text-center shadow-clayPressed">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-[#7C3AED]/10 text-[#7C3AED]">
              <BookOpen className="size-8" />
            </span>
            <h3 className="font-heading text-xl font-extrabold">
              No materials catalogued yet
            </h3>
            <p className="max-w-sm text-sm text-[#635F69]">
              Visit the library to publish your first notes, papers or video
              links.
            </p>
            <Link href="/library">
              <Button size="sm">Go to Library</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredResources.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-clayDeep"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {item.subject || "General"}
                    </Badge>
                    <Badge variant="outline">
                      {item.resource_type || "Resource"}
                    </Badge>
                  </div>

                  <h4 className="line-clamp-2 font-heading text-lg leading-snug font-extrabold text-[#332F3A]">
                    {item.title}
                  </h4>

                  {item.topic && (
                    <p className="line-clamp-2 text-sm text-[#635F69]">
                      {item.topic}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-end">
                  {item.external_url ? (
                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#7C3AED]/10 px-4 py-2 font-heading text-xs font-extrabold text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/15"
                    >
                      <span>Open link</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <Link
                      href="/library"
                      className="inline-flex items-center gap-1 rounded-full bg-[#7C3AED]/10 px-4 py-2 font-heading text-xs font-extrabold text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/15"
                    >
                      View details
                      <ChevronRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Subject index */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mb-8 space-y-2">
          <Badge variant="secondary">
            <School className="size-3.5" />
            Curriculum index
          </Badge>
          <h2 className="font-heading text-3xl font-black tracking-tight text-[#332F3A]">
            Explore by subject
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SUBJECT_INDEX.map((subj) => (
            <div
              key={subj.code}
              className="group flex flex-col justify-between rounded-[32px] border border-white/70 bg-white/70 p-7 shadow-clayCard backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-clayDeep"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 font-heading text-[11px] font-extrabold tracking-wide ${subj.tint}`}
                  >
                    {subj.code}
                  </span>
                  <span className="text-xs text-[#635F69]">
                    {subj.resourceCount}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-extrabold text-[#332F3A]">
                  {subj.name}
                </h3>

                <p className="text-sm leading-relaxed text-[#635F69]">
                  {subj.topics}
                </p>
              </div>

              <div className="mt-5 border-t border-[#7C3AED]/10 pt-4">
                <Link
                  href={`/library?subject=${encodeURIComponent(
                    subj.name.split(" ")[0]
                  )}`}
                  className="inline-flex items-center gap-1.5 font-heading text-sm font-extrabold text-[#7C3AED] transition-transform duration-200 group-hover:translate-x-1"
                >
                  Explore notes & papers
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study tools banner */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-[48px] bg-gradient-to-br from-[#A78BFA] via-[#7C3AED] to-[#6D28D9] p-8 shadow-clayDeep sm:p-14">
          <div className="absolute -top-16 -right-10 size-56 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 size-64 rounded-full bg-[#DB2777]/25 blur-3xl" />

          <div className="relative max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-heading text-xs font-extrabold tracking-wide text-white backdrop-blur-md">
              <Timer className="size-4" />
              Precision study clock
            </span>
            <h2 className="font-heading text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              A stopwatch, focus timer and syllabus tracker that feel good to
              use.
            </h2>
            <p className="text-sm leading-relaxed text-white/85 sm:text-base">
              Built with monotonic timing for deep study sprints, revision
              intervals and past-paper speed runs.
            </p>
          </div>

          <div className="relative mt-8 flex flex-wrap items-center gap-3">
            <Link href="/tools?tab=stopwatch">
              <Button
                size="lg"
                className="bg-white text-[#6D28D9] shadow-[0_8px_20px_rgba(51,47,58,0.25),inset_-2px_-2px_6px_rgba(196,181,253,0.45),inset_2px_2px_6px_rgba(255,255,255,0.9)] hover:bg-white"
              >
                <Timer className="size-5" />
                Launch stopwatch
              </Button>
            </Link>
            <Link href="/tools?tab=timer">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
              >
                Countdown timer
              </Button>
            </Link>
            <Link href="/tools?tab=targets">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/15 hover:text-white"
              >
                Study targets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <OversizedWordmark />
    </div>
  );
}
