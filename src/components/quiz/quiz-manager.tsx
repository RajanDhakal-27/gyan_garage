"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Quiz } from "@/types/database";
import { useRole } from "@/context/role-context";
import { filterQuizzes, extractQuizSubjects } from "@/lib/quiz";
import { SAMPLE_QUIZZES } from "@/lib/sample-quizzes";
import { QuizCard } from "./quiz-card";
import { QuizFormDialog } from "./quiz-form-dialog";
import { QuizDetailDialog } from "./quiz-detail-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  GraduationCap,
  Filter,
  X,
  RefreshCw,
  Plus,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function QuizManager() {
  const router = useRouter();
  const { isTeacher, setRole } = useRole();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modal states
  const [selectedQuizForDetail, setSelectedQuizForDetail] = useState<Quiz | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("quizzes")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      setQuizzes(data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load quizzes.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleDeleteQuiz = async (id: string) => {
    try {
      const { error: deleteErr } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", id);

      if (deleteErr) throw deleteErr;

      setQuizzes((prev) => prev.filter((item) => item.id !== id));
      toast.success("Quiz removed successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not delete quiz.";
      toast.error(msg);
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (quiz: Quiz) => {
    setSelectedQuizForDetail(quiz);
    setIsDetailDialogOpen(true);
  };

  const handleStartQuiz = (quiz: Quiz) => {
    router.push(`/quizzes/${quiz.id}`);
  };

  const handleSeedSampleQuizzes = async () => {
    try {
      setIsSeeding(true);
      const itemsToInsert = SAMPLE_QUIZZES.map((item) => ({
        ...item,
      }));

      const { error: insertErr } = await supabase
        .from("quizzes")
        .insert(itemsToInsert);

      if (insertErr) throw insertErr;

      toast.success("Loaded 3 sample Nepali curriculum objective quizzes!");
      await fetchQuizzes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sample quizzes.";
      toast.error(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  const availableSubjects = useMemo(() => extractQuizSubjects(quizzes), [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return filterQuizzes(quizzes, {
      searchQuery,
      subject: selectedSubject,
    });
  }, [quizzes, searchQuery, selectedSubject]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedSubject !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("All");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-4 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-5 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Practice arena</Badge>
            <Badge variant="outline">Timed · Auto-graded</Badge>
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl">
            Objective Quizzes & Tests
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#635F69]">
            Build and browse multiple-choice timed tests for SEE and high school
            preparation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isTeacher ? (
            <QuizFormDialog onQuizSaved={fetchQuizzes} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRole("teacher")}
            >
              <Plus className="size-4" />
              <span>Switch to teacher</span>
            </Button>
          )}

          {quizzes.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleQuizzes}
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
            onClick={fetchQuizzes}
            disabled={isLoading}
            title="Refresh quizzes"
            aria-label="Refresh quizzes"
          >
            <RefreshCw className={isLoading ? "size-5 animate-spin" : "size-5"} />
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-[#635F69]" />
          <Input
            placeholder="Search quizzes by title or syllabus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12"
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

        {/* Subject Filter */}
        <div>
          <Select
            value={selectedSubject}
            onValueChange={(val) => setSelectedSubject(val || "All")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Subjects</SelectItem>
              {availableSubjects.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Badges & Counter */}
      <div className="flex flex-col items-start justify-between gap-2 text-xs text-[#635F69] sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            Showing <strong className="text-[#332F3A]">{filteredQuizzes.length}</strong> of{" "}
            {quizzes.length} quizzes
          </span>
          {hasActiveFilters && (
            <Button
              variant="link"
              size="xs"
              onClick={clearFilters}
              className="h-auto px-0 text-[#7C3AED]"
            >
              Reset all filters
            </Button>
          )}
        </div>
        <div className="text-[11px]">
          Mode:{" "}
          <strong className="text-[#332F3A]">
            {isTeacher ? "Teacher · create & manage" : "Student · catalog & practice"}
          </strong>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-52 animate-pulse flex-col justify-between rounded-[32px] border border-white/60 bg-white/40 p-5 shadow-clayPressed"
            >
              <div className="space-y-3">
                <div className="h-5 w-24 rounded-full bg-[#0EA5E9]/10" />
                <div className="h-6 w-3/4 rounded-full bg-[#0EA5E9]/10" />
                <div className="h-10 w-full rounded-2xl bg-[#0EA5E9]/5" />
              </div>
              <div className="h-7 w-28 self-end rounded-full bg-[#0EA5E9]/10" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-[32px] border border-[#DB2777]/20 bg-[#DB2777]/5 p-10 text-center">
          <AlertCircle className="mx-auto size-9 text-[#DB2777]" />
          <h3 className="font-heading text-lg font-extrabold text-[#DB2777]">
            Failed to load quizzes
          </h3>
          <p className="mx-auto max-w-md text-sm text-[#635F69]">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchQuizzes}>
            <RefreshCw className="size-4" />
            <span>Try again</span>
          </Button>
        </div>
      ) : quizzes.length === 0 ? (
        /* Empty Database State */
        <div className="mx-auto my-8 max-w-xl space-y-4 rounded-[40px] border border-dashed border-[#0EA5E9]/25 bg-white/60 p-12 text-center shadow-clayPressed">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#0EA5E9]/10 text-[#0EA5E9]">
            <GraduationCap className="size-8" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-[#332F3A]">
              No quizzes published yet
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#635F69]">
              Teachers can build multiple-choice objective tests with timers — or
              load sample Nepali curriculum quizzes in one click.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              onClick={handleSeedSampleQuizzes}
              disabled={isSeeding}
              className="w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load sample quizzes</span>
            </Button>

            {isTeacher ? (
              <QuizFormDialog
                onQuizSaved={fetchQuizzes}
                triggerButton={
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Plus className="size-4" />
                    <span>Create quiz</span>
                  </Button>
                }
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => setRole("teacher")}
                className="w-full sm:w-auto"
              >
                <GraduationCap className="size-4" />
                <span>Switch to teacher</span>
              </Button>
            )}
          </div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        /* Filter Empty State */
        <div className="mx-auto my-8 max-w-md space-y-3 rounded-[40px] border border-dashed border-[#0EA5E9]/25 bg-white/60 p-10 text-center shadow-clayPressed">
          <Filter className="mx-auto size-9 text-[#635F69]" />
          <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
            No quizzes match your filter
          </h3>
          <p className="text-sm text-[#635F69]">
            Try adjusting your search query or subject filter.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        /* Quizzes Grid */
        <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map((item) => (
            <QuizCard
              key={item.id}
              quiz={item}
              onDelete={handleDeleteQuiz}
              onEdit={handleEditQuiz}
              onViewDetails={handleViewDetails}
              onStartQuiz={handleStartQuiz}
            />
          ))}
        </div>
      )}

      {/* Edit Quiz Dialog */}
      <QuizFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={editingQuiz}
        onQuizSaved={() => {
          setIsEditDialogOpen(false);
          setEditingQuiz(null);
          fetchQuizzes();
        }}
      />

      {/* Quiz Detail Preview Dialog */}
      <QuizDetailDialog
        quiz={selectedQuizForDetail}
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setSelectedQuizForDetail(null);
        }}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
}
