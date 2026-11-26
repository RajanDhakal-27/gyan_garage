"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { LearningItem } from "@/types/database";
import { useRole } from "@/context/role-context";
import {
  filterAndSortHomework,
  extractHomeworkSubjects,
  getDueStatus,
} from "@/lib/homework";
import { SAMPLE_HOMEWORK } from "@/lib/sample-homework";
import { HomeworkCard } from "./homework-card";
import { HomeworkFormDialog } from "./homework-form-dialog";
import { HomeworkDetailDialog } from "./homework-detail-dialog";
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
  FileCheck2,
  Filter,
  X,
  RefreshCw,
  Plus,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function HomeworkManager() {
  const { isTeacher, setRole } = useRole();
  const [homeworkList, setHomeworkList] = useState<LearningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modal states
  const [selectedHomeworkForDetail, setSelectedHomeworkForDetail] =
    useState<LearningItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [editingHomework, setEditingHomework] = useState<LearningItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "overdue">("all");
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const fetchHomework = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("learning_items")
        .select("*")
        .eq("item_type", "homework")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      setHomeworkList(data || []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load homework assignments.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  const handleDeleteHomework = async (id: string) => {
    try {
      const { error: deleteErr } = await supabase
        .from("learning_items")
        .delete()
        .eq("id", id);

      if (deleteErr) throw deleteErr;

      setHomeworkList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Homework assignment removed.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not delete homework.";
      toast.error(msg);
    }
  };

  const handleEditHomework = (item: LearningItem) => {
    setEditingHomework(item);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (item: LearningItem) => {
    setSelectedHomeworkForDetail(item);
    setIsDetailDialogOpen(true);
  };

  const handleSeedSampleHomework = async () => {
    try {
      setIsSeeding(true);
      const itemsToInsert = SAMPLE_HOMEWORK.map((item) => ({
        ...item,
        item_type: "homework" as const,
      }));

      const { error: insertErr } = await supabase
        .from("learning_items")
        .insert(itemsToInsert);

      if (insertErr) throw insertErr;

      toast.success("Loaded 4 sample Nepali curriculum homework assignments!");
      await fetchHomework();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load sample homework.";
      toast.error(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  const availableSubjects = useMemo(
    () => extractHomeworkSubjects(homeworkList),
    [homeworkList]
  );

  const filteredHomework = useMemo(() => {
    return filterAndSortHomework(homeworkList, {
      searchQuery,
      subject: selectedSubject,
      statusFilter,
      now: currentDate,
    });
  }, [homeworkList, searchQuery, selectedSubject, statusFilter, currentDate]);

  const overdueCount = useMemo(() => {
    if (!currentDate) return 0;
    return homeworkList.filter(
      (item) => getDueStatus(item.due_at, currentDate).status === "overdue"
    ).length;
  }, [homeworkList, currentDate]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedSubject !== "All" ||
    statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("All");
    setStatusFilter("all");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-4 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-5 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Assignment board</Badge>
            <Badge variant="outline">Deadlines · Instructions</Badge>
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl">
            Homework & Assignments
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#635F69]">
            Track upcoming deadlines, review instructions and manage school
            tasks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isTeacher ? (
            <HomeworkFormDialog onHomeworkSaved={fetchHomework} />
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

          {homeworkList.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleHomework}
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
            onClick={fetchHomework}
            disabled={isLoading}
            title="Refresh homework"
            aria-label="Refresh homework"
          >
            <RefreshCw className={isLoading ? "size-5 animate-spin" : "size-5"} />
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-[#635F69]" />
          <Input
            placeholder="Search assignments or instructions..."
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

        {/* Status Filter */}
        <div>
          <Select
            value={statusFilter}
            onValueChange={(val) =>
              setStatusFilter((val as "all" | "pending" | "overdue") || "all")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deadlines</SelectItem>
              <SelectItem value="pending">Upcoming & Due Soon</SelectItem>
              <SelectItem value="overdue">
                Overdue {overdueCount > 0 ? `(${overdueCount})` : ""}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Badges & Counter */}
      <div className="flex flex-col items-start justify-between gap-2 text-xs text-[#635F69] sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            Showing <strong className="text-[#332F3A]">{filteredHomework.length}</strong> of{" "}
            {homeworkList.length} assignments
          </span>
          {overdueCount > 0 && (
            <span className="font-medium text-[#DB2777]">
              · {overdueCount} overdue
            </span>
          )}
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
            {isTeacher ? "Teacher · assign & edit" : "Student · view & complete"}
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
                <div className="h-5 w-24 rounded-full bg-[#10B981]/10" />
                <div className="h-6 w-3/4 rounded-full bg-[#10B981]/10" />
                <div className="h-12 w-full rounded-2xl bg-[#10B981]/5" />
              </div>
              <div className="h-7 w-28 self-end rounded-full bg-[#10B981]/10" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-[32px] border border-[#DB2777]/20 bg-[#DB2777]/5 p-10 text-center">
          <AlertCircle className="mx-auto size-9 text-[#DB2777]" />
          <h3 className="font-heading text-lg font-extrabold text-[#DB2777]">
            Failed to load homework
          </h3>
          <p className="mx-auto max-w-md text-sm text-[#635F69]">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchHomework}>
            <RefreshCw className="size-4" />
            <span>Try again</span>
          </Button>
        </div>
      ) : homeworkList.length === 0 ? (
        /* Empty Database State */
        <div className="mx-auto my-8 max-w-xl space-y-4 rounded-[40px] border border-dashed border-[#10B981]/25 bg-white/60 p-12 text-center shadow-clayPressed">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#10B981]/10 text-[#10B981]">
            <FileCheck2 className="size-8" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-[#332F3A]">
              No homework assigned yet
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#635F69]">
              Teachers can assign exercises with instructions and deadlines — or
              load sample curriculum homework in one click.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              onClick={handleSeedSampleHomework}
              disabled={isSeeding}
              className="w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load sample homework</span>
            </Button>

            {isTeacher ? (
              <HomeworkFormDialog
                onHomeworkSaved={fetchHomework}
                triggerButton={
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Plus className="size-4" />
                    <span>Create homework</span>
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
      ) : filteredHomework.length === 0 ? (
        /* Filter Empty State */
        <div className="mx-auto my-8 max-w-md space-y-3 rounded-[40px] border border-dashed border-[#10B981]/25 bg-white/60 p-10 text-center shadow-clayPressed">
          <Filter className="mx-auto size-9 text-[#635F69]" />
          <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
            No homework matches your filter
          </h3>
          <p className="text-sm text-[#635F69]">
            Try adjusting your search query, subject or deadline status.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        /* Homework Grid */
        <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredHomework.map((item) => (
            <HomeworkCard
              key={item.id}
              homework={item}
              now={currentDate}
              onDelete={handleDeleteHomework}
              onEdit={handleEditHomework}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Edit Homework Dialog */}
      <HomeworkFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={editingHomework}
        onHomeworkSaved={() => {
          setIsEditDialogOpen(false);
          setEditingHomework(null);
          fetchHomework();
        }}
      />

      {/* Homework Detail Dialog */}
      <HomeworkDetailDialog
        homework={selectedHomeworkForDetail}
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setSelectedHomeworkForDetail(null);
        }}
      />
    </div>
  );
}
