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

const SUBJECT_INDEX = [
  {
    name: "Compulsory & Opt Mathematics",
    code: "MATH.10",
    topics: "Trigonometry, Coordinate Geometry, Vectors, Statistics",
    resourceCount: "4 Materials",
  },
  {
    name: "Science & Technology",
    code: "SCI.10",
    topics: "Gravitation, Pressure, Optics, Chemical Reactions",
    resourceCount: "6 Materials",
  },
  {
    name: "Compulsory English",
    code: "ENG.10",
    topics: "Model Question Papers, Grammar, Free Writing Essays",
    resourceCount: "5 Materials",
  },
  {
    name: "Social Studies & Governance",
    code: "SOC.10",
    topics: "Constitution of Nepal 2072, Federalism, Historical Milestones",
    resourceCount: "3 Materials",
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
    <div className="relative min-h-screen bg-[#EFE9DD] text-[#141C2B] overflow-x-hidden">
      {/* Travelling Notebook Signature Object */}
      <TravellingNotebook />

      {/* Hero Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-[rgba(20,28,43,0.16)]">
        <div className="max-w-4xl space-y-6">
          {/* Section Marker */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#767E8C]">
            <span>[ § G.G. ARCHIVE • VOL. 01 ]</span>
            <span>•</span>
            <span>KATHMANDU, NEPAL</span>
          </div>

          {/* Main Headline with Editorial Serif & Italics */}
          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#141C2B] leading-[1.08]">
            An editorial learning library for <span className="italic font-medium">ambitious</span> scholars & teachers.
          </h1>

          {/* Monospaced Subhead */}
          <p className="font-mono text-xs sm:text-sm text-[#4A5364] max-w-2xl leading-relaxed">
            Curriculum-verified study notes, CDC model question papers, timed examination simulations, and monotonic productivity tools. Designed as a unified academic stationery desk rather than a generic portal.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link href={isTeacher ? "/dashboard/teacher" : "/dashboard/student"}>
              <Button size="lg" className="gap-2 text-xs">
                <span>Enter {isTeacher ? "Teacher Studio" : "Student Desk"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <Link href="/library">
              <Button variant="outline" size="lg" className="gap-2 text-xs">
                <span>Browse Learning Library</span>
                <BookOpen className="size-4" />
              </Button>
            </Link>

            <Link href="/tools">
              <Button variant="secondary" size="lg" className="gap-2 text-xs">
                <span>Open Study Tools</span>
                <Timer className="size-4" />
              </Button>
            </Link>
          </div>

          {/* Active Profile Pill */}
          <div className="pt-2 flex items-center gap-2 font-mono text-[11px] text-[#767E8C]">
            <span className="size-2 bg-[#2C4A8F] rounded-full inline-block animate-pulse" />
            <span>Currently configured as: <strong className="text-[#141C2B] uppercase">{role}</strong> ({isTeacher ? "Educator" : grade})</span>
          </div>
        </div>
      </section>

      {/* Two-Column Editorial Section: Diagram & Manifesto */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 border-b border-[rgba(20,28,43,0.16)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Self Drawing Diagram (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <SelfDrawingDiagram />
          </div>

          {/* Right Column: Editorial Overview (7 cols) */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <div className="font-mono text-xs uppercase tracking-widest text-[#767E8C]">
              [ § 02 — THE ARCHIVE PRINCIPLE ]
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl font-normal tracking-tight text-[#141C2B]">
              Learning materials organized with <span className="italic">intent</span>, clarity, and rigor.
            </h2>

            <div className="space-y-4 font-mono text-xs text-[#4A5364] leading-relaxed">
              <p>
                Too often, educational tools fragment a student&apos;s routine across unstructured YouTube playlists, scattered Google Drive links, and unverified mock questions.
              </p>
              <p>
                GYAN GARAGE brings notes, past examination papers, self-grading tests, and study clocks into a single tactile layout. Everything is categorized by subject, chapter, and academic level.
              </p>
            </div>

            {/* Academic Features Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="flex items-start gap-2 border border-[rgba(20,28,43,0.14)] p-3 bg-[#E5DED0]/50">
                <Check className="size-4 text-[#2C4A8F] shrink-0 mt-0.5" />
                <span>Curriculum-aligned CDC notes & proofs</span>
              </div>
              <div className="flex items-start gap-2 border border-[rgba(20,28,43,0.14)] p-3 bg-[#E5DED0]/50">
                <Check className="size-4 text-[#2C4A8F] shrink-0 mt-0.5" />
                <span>Timed test with automated grading</span>
              </div>
              <div className="flex items-start gap-2 border border-[rgba(20,28,43,0.14)] p-3 bg-[#E5DED0]/50">
                <Check className="size-4 text-[#2C4A8F] shrink-0 mt-0.5" />
                <span>Monotonic lap-recording stopwatch</span>
              </div>
              <div className="flex items-start gap-2 border border-[rgba(20,28,43,0.14)] p-3 bg-[#E5DED0]/50">
                <Check className="size-4 text-[#2C4A8F] shrink-0 mt-0.5" />
                <span>Homework assignments with deadlines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources Table / Editorial Rows */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 border-b border-[rgba(20,28,43,0.16)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#767E8C]">
              [ § 03 — RECENTLY CATALOGUED MATERIALS ]
            </span>
            <h2 className="font-editorial text-3xl font-normal text-[#141C2B]">
              Selected Learning Resources
            </h2>
          </div>

          <Link href="/library" className="font-mono text-xs text-[#2C4A8F] hover:underline flex items-center gap-1">
            <span>View all in Learning Library</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Structured Editorial Rows (Not generic rounded cards!) */}
        {isLoading ? (
          <div className="border border-[rgba(20,28,43,0.16)] divide-y divide-[rgba(20,28,43,0.12)]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 h-16 bg-[#E5DED0]/20 animate-pulse" />
            ))}
          </div>
        ) : featuredResources.length === 0 ? (
          <div className="border border-dashed border-[rgba(20,28,43,0.2)] p-12 text-center space-y-3 bg-[#E5DED0]/30">
            <BookOpen className="size-8 text-[#767E8C] mx-auto" />
            <h3 className="font-editorial text-lg font-bold">No catalogued materials found yet</h3>
            <p className="font-mono text-xs text-[#4A5364]">
              Visit the library to publish your first notes, papers, or video links.
            </p>
            <Link href="/library">
              <Button size="sm">Go to Library</Button>
            </Link>
          </div>
        ) : (
          <div className="border border-[rgba(20,28,43,0.16)] divide-y divide-[rgba(20,28,43,0.14)] bg-[#EFE9DD]">
            {featuredResources.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-[#E5DED0]/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <span className="font-mono text-xs text-[#767E8C] w-6 shrink-0 pt-0.5 sm:pt-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#2C4A8F] font-semibold">
                        {item.subject || "GENERAL"}
                      </span>
                      {item.topic && (
                        <span className="font-mono text-[10px] text-[#767E8C]">
                          • {item.topic}
                        </span>
                      )}
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
                        {item.resource_type || "Resource"}
                      </Badge>
                    </div>

                    <h4 className="font-editorial text-base sm:text-lg font-medium text-[#141C2B] truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center font-mono text-xs">
                  {item.external_url ? (
                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 border border-[rgba(20,28,43,0.2)] bg-[#E5DED0] px-3 py-1 text-xs text-[#141C2B] hover:border-[#2C4A8F] hover:text-[#2C4A8F] transition-colors"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    <Link
                      href="/library"
                      className="text-xs text-[#2C4A8F] hover:underline"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Subject Index Grid */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 border-b border-[rgba(20,28,43,0.16)]">
        <div className="space-y-1 mb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#767E8C]">
            [ § 04 — CURRICULUM SYLLABUS INDEX ]
          </span>
          <h2 className="font-editorial text-3xl font-normal text-[#141C2B]">
            Academic Subject Exploration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECT_INDEX.map((subj) => (
            <div
              key={subj.code}
              className="border border-[rgba(20,28,43,0.16)] bg-[#E5DED0]/50 p-6 space-y-3 hover:border-[#2C4A8F] transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-[#767E8C] uppercase">
                <span>{subj.code}</span>
                <span>{subj.resourceCount}</span>
              </div>

              <h3 className="font-editorial text-xl font-bold text-[#141C2B]">
                {subj.name}
              </h3>

              <p className="font-mono text-xs text-[#4A5364] leading-relaxed">
                {subj.topics}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-[rgba(20,28,43,0.1)] font-mono text-xs">
                <Link
                  href={`/library?subject=${encodeURIComponent(subj.name.split(" ")[0])}`}
                  className="text-[#2C4A8F] hover:underline"
                >
                  Explore Notes & Papers →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study Tools Banner */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="border border-[#141C2B] bg-[#E5DED0] p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[#767E8C]">
              [ § 05 — PRECISION STUDY CLOCK ]
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-[#141C2B]">
              High-accuracy stopwatch, countdown timer, and syllabus target tracker.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#4A5364] leading-relaxed">
              Designed with monotonic performance timing for deep study sprints, revision intervals, and past question paper speed tests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/tools?tab=stopwatch">
              <Button size="lg" className="gap-2 text-xs">
                <span>Launch Stopwatch</span>
                <Timer className="size-4" />
              </Button>
            </Link>
            <Link href="/tools?tab=timer">
              <Button variant="outline" size="lg" className="gap-2 text-xs">
                <span>Countdown Timer</span>
              </Button>
            </Link>
            <Link href="/tools?tab=targets">
              <Button variant="secondary" size="lg" className="gap-2 text-xs">
                <span>Study Targets</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Oversized Editorial Wordmark spread across bottom */}
      <OversizedWordmark />
    </div>
  );
}
