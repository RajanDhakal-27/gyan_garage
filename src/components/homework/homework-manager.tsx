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
  Clock,
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
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Homework & Assignments
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Task 02 • Must 4
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Track upcoming assignment deadlines, review instructions, and manage school tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isTeacher ? (
            <HomeworkFormDialog onHomeworkSaved={fetchHomework} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRole("teacher")}
              className="gap-1.5 text-xs"
            >
              <Plus className="size-3.5" />
              <span>Switch to Teacher to Assign</span>
            </Button>
          )}

          {homeworkList.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleHomework}
              disabled={isSeeding}
              className="gap-1.5 text-xs"
            >
              {isSeeding ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 text-amber-500" />
              )}
              <span>Load Sample Homework</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchHomework}
            disabled={isLoading}
            title="Refresh homework"
            aria-label="Refresh homework"
          >
            <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search assignments or instructions..."
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
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-foreground">{filteredHomework.length}</strong> of{" "}
            {homeworkList.length} assignments
          </span>
          {overdueCount > 0 && (
            <span className="text-destructive font-medium">
              • {overdueCount} overdue
            </span>
          )}
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
            {isTeacher ? "Teacher (Assign & Edit)" : "Student (View & Complete)"}
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
                <div className="h-12 w-full bg-muted/40 rounded" />
              </div>
              <div className="h-6 w-28 bg-muted/40 rounded self-end" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
          <AlertCircle className="size-8 text-destructive mx-auto" />
          <h3 className="font-semibold text-destructive">Failed to load homework</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchHomework} className="gap-1.5">
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : homeworkList.length === 0 ? (
        /* Empty Database State */
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <FileCheck2 className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              No homework assigned yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Teachers can assign exercises with instructions and deadlines. Or load sample Nepali curriculum homework with one click.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="default"
              onClick={handleSeedSampleHomework}
              disabled={isSeeding}
              className="gap-1.5 shadow-sm w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load Sample Homework</span>
            </Button>

            {isTeacher ? (
              <HomeworkFormDialog
                onHomeworkSaved={fetchHomework}
                triggerButton={
                  <Button variant="outline" className="gap-1.5 w-full sm:w-auto">
                    <Plus className="size-4" />
                    <span>Create Custom Homework</span>
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
      ) : filteredHomework.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3 max-w-md mx-auto my-8">
          <Filter className="size-8 text-muted-foreground mx-auto" />
          <h3 className="font-medium text-foreground">No homework matches your filter</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query, subject, or deadline status.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        /* Homework Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
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
