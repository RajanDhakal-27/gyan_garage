"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { LearningItem } from "@/types/database";
import { useRole } from "@/context/role-context";
import {
  filterResources,
  extractSubjects,
  extractTopics,
  RESOURCE_TYPES,
} from "@/lib/resources";
import { SAMPLE_RESOURCES } from "@/lib/sample-resources";
import { ResourceCard } from "./resource-card";
import { ResourceFormDialog } from "./resource-form-dialog";
import { ResourceDetailDialog } from "./resource-detail-dialog";
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
  BookOpen,
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

export function ResourceManager() {
  const { isTeacher, setRole } = useRole();
  const [resources, setResources] = useState<LearningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Modal states
  const [selectedResourceForDetail, setSelectedResourceForDetail] =
    useState<LearningItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [editingResource, setEditingResource] = useState<LearningItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("learning_items")
        .select("*")
        .eq("item_type", "resource")
        .order("created_at", { ascending: false });

      if (fetchErr) throw fetchErr;

      setResources(data || []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load learning resources.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDeleteResource = async (id: string) => {
    try {
      const { error: deleteErr } = await supabase
        .from("learning_items")
        .delete()
        .eq("id", id);

      if (deleteErr) throw deleteErr;

      setResources((prev) => prev.filter((item) => item.id !== id));
      toast.success("Resource removed successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not delete resource.";
      toast.error(msg);
    }
  };

  const handleEditResource = (resource: LearningItem) => {
    setEditingResource(resource);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (resource: LearningItem) => {
    setSelectedResourceForDetail(resource);
    setIsDetailDialogOpen(true);
  };

  const handleSeedSampleData = async () => {
    try {
      setIsSeeding(true);
      const itemsToInsert = SAMPLE_RESOURCES.map((item) => ({
        ...item,
        item_type: "resource" as const,
      }));

      const { error: insertErr } = await supabase
        .from("learning_items")
        .insert(itemsToInsert);

      if (insertErr) throw insertErr;

      toast.success("Loaded 5 sample Nepali curriculum resources!");
      await fetchResources();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load sample resources.";
      toast.error(msg);
    } finally {
      setIsSeeding(false);
    }
  };

  // Dynamic filter lists
  const availableSubjects = useMemo(() => extractSubjects(resources), [resources]);
  const availableTopics = useMemo(
    () => extractTopics(resources, selectedSubject),
    [resources, selectedSubject]
  );

  // Filtered resources
  const filteredResources = useMemo(() => {
    return filterResources(resources, {
      searchQuery,
      subject: selectedSubject,
      topic: selectedTopic,
      resourceType: selectedType,
    });
  }, [resources, searchQuery, selectedSubject, selectedTopic, selectedType]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedSubject !== "All" ||
    selectedTopic !== "All" ||
    selectedType !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("All");
    setSelectedTopic("All");
    setSelectedType("All");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7 px-4 py-4 sm:px-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-5 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Resource archive</Badge>
            <Badge variant="outline">Notes · Papers · Videos</Badge>
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl">
            Learning Resource Library
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#635F69]">
            Explore notes, past question papers, video lectures and live class
            links for the Nepali curriculum.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isTeacher ? (
            <ResourceFormDialog onResourceSaved={fetchResources} />
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

          {resources.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleData}
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
            onClick={fetchResources}
            disabled={isLoading}
            title="Refresh resources"
            aria-label="Refresh resources"
          >
            <RefreshCw className={isLoading ? "size-5 animate-spin" : "size-5"} />
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-[#635F69]" />
          <Input
            placeholder="Search notes, topics, or subjects..."
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
            onValueChange={(val) => {
              setSelectedSubject(val || "All");
              setSelectedTopic("All");
            }}
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

        {/* Topic Filter */}
        <div>
          <Select
            value={selectedTopic}
            onValueChange={(val) => setSelectedTopic(val || "All")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Topics</SelectItem>
              {availableTopics.map((top) => (
                <SelectItem key={top} value={top}>
                  {top}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resource Type Filter */}
        <div>
          <Select
            value={selectedType}
            onValueChange={(val) => setSelectedType(val || "All")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Resource Types</SelectItem>
              {RESOURCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
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
            Showing <strong className="text-[#332F3A]">{filteredResources.length}</strong> of{" "}
            {resources.length} resources
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
            {isTeacher ? "Teacher · edit & manage" : "Student · browse & learn"}
          </strong>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex h-48 animate-pulse flex-col justify-between rounded-[32px] border border-white/60 bg-white/40 p-5 shadow-clayPressed"
            >
              <div className="space-y-3">
                <div className="h-5 w-24 rounded-full bg-[#7C3AED]/10" />
                <div className="h-6 w-3/4 rounded-full bg-[#7C3AED]/10" />
                <div className="h-4 w-full rounded-full bg-[#7C3AED]/5" />
              </div>
              <div className="h-7 w-28 self-end rounded-full bg-[#7C3AED]/10" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-[32px] border border-[#DB2777]/20 bg-[#DB2777]/5 p-10 text-center">
          <AlertCircle className="mx-auto size-9 text-[#DB2777]" />
          <h3 className="font-heading text-lg font-extrabold text-[#DB2777]">
            Failed to load resources
          </h3>
          <p className="mx-auto max-w-md text-sm text-[#635F69]">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchResources}>
            <RefreshCw className="size-4" />
            <span>Try again</span>
          </Button>
        </div>
      ) : resources.length === 0 ? (
        /* Empty Database State */
        <div className="mx-auto my-8 max-w-xl space-y-4 rounded-[40px] border border-dashed border-[#7C3AED]/25 bg-white/60 p-12 text-center shadow-clayPressed">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#7C3AED]/10 text-[#7C3AED]">
            <BookOpen className="size-8" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-extrabold text-[#332F3A]">
              No learning resources published yet
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#635F69]">
              Start building the library by adding course notes, past question
              papers or video lesson links — or load sample resources in one
              click.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              onClick={handleSeedSampleData}
              disabled={isSeeding}
              className="w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load sample resources</span>
            </Button>

            {isTeacher ? (
              <ResourceFormDialog
                onResourceSaved={fetchResources}
                triggerButton={
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Plus className="size-4" />
                    <span>Create resource</span>
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
      ) : filteredResources.length === 0 ? (
        /* Filter Empty State */
        <div className="mx-auto my-8 max-w-md space-y-3 rounded-[40px] border border-dashed border-[#7C3AED]/25 bg-white/60 p-10 text-center shadow-clayPressed">
          <Filter className="mx-auto size-9 text-[#635F69]" />
          <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
            No resources match your filter
          </h3>
          <p className="text-sm text-[#635F69]">
            Try adjusting your search query, subject or resource type.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        /* Resource Grid */
        <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((item) => (
            <ResourceCard
              key={item.id}
              resource={item}
              onDelete={handleDeleteResource}
              onEdit={handleEditResource}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Edit Resource Dialog */}
      <ResourceFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={editingResource}
        onResourceSaved={() => {
          setIsEditDialogOpen(false);
          setEditingResource(null);
          fetchResources();
        }}
      />

      {/* Resource Detail Modal */}
      <ResourceDetailDialog
        resource={selectedResourceForDetail}
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setSelectedResourceForDetail(null);
        }}
      />
    </div>
  );
}
