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
  Clock,
  Layers,
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
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Objective Quizzes & Tests
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Task 03 • Must 3
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Construct and browse multiple-choice timed tests for SEE and high school preparation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isTeacher ? (
            <QuizFormDialog onQuizSaved={fetchQuizzes} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRole("teacher")}
              className="gap-1.5 text-xs"
            >
              <Plus className="size-3.5" />
              <span>Switch to Teacher to Create</span>
            </Button>
          )}

          {quizzes.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleQuizzes}
              disabled={isSeeding}
              className="gap-1.5 text-xs"
            >
              {isSeeding ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 text-amber-500" />
              )}
              <span>Load Sample Quizzes</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchQuizzes}
            disabled={isLoading}
            title="Refresh quizzes"
            aria-label="Refresh quizzes"
          >
            <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search quizzes by title or syllabus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
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
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-foreground">{filteredQuizzes.length}</strong> of{" "}
            {quizzes.length} quizzes
          </span>
          {hasActiveFilters && (
            <Button
              variant="link"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-0 text-xs text-primary"
            >
              Reset all filters
            </Button>
          )}
        </div>
        <div className="text-[11px]">
          Current Mode:{" "}
          <strong className="text-foreground">
            {isTeacher ? "Teacher (Create & Manage)" : "Student (Catalog & Practice)"}
          </strong>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl border border-muted bg-muted/20 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted/60 rounded" />
                <div className="h-5 w-3/4 bg-muted/60 rounded" />
                <div className="h-10 w-full bg-muted/40 rounded" />
              </div>
              <div className="h-6 w-28 bg-muted/40 rounded self-end" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
          <AlertCircle className="size-8 text-destructive mx-auto" />
          <h3 className="font-semibold text-destructive">Failed to load quizzes</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchQuizzes} className="gap-1.5">
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : quizzes.length === 0 ? (
        /* Empty Database State */
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <GraduationCap className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              No quizzes published yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Teachers can build multiple-choice objective tests with timers. Or load sample Nepali curriculum quizzes with one click.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="default"
              onClick={handleSeedSampleQuizzes}
              disabled={isSeeding}
              className="gap-1.5 shadow-sm w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load Sample Quizzes</span>
            </Button>

            {isTeacher ? (
              <QuizFormDialog
                onQuizSaved={fetchQuizzes}
                triggerButton={
                  <Button variant="outline" className="gap-1.5 w-full sm:w-auto">
                    <Plus className="size-4" />
                    <span>Create Custom Quiz</span>
                  </Button>
                }
              />
            ) : (
              <Button
                variant="outline"
                onClick={() => setRole("teacher")}
                className="gap-1.5 w-full sm:w-auto"
              >
                <GraduationCap className="size-4" />
                <span>Switch to Teacher View</span>
              </Button>
            )}
          </div>
        </div>
      ) : filteredQuizzes.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3 max-w-md mx-auto my-8">
          <Filter className="size-8 text-muted-foreground mx-auto" />
          <h3 className="font-medium text-foreground">No quizzes match your filter</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query or subject filter.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        /* Quizzes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
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
