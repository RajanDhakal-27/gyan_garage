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
  Database,
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
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Learning Resource Library
            </h1>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Task 01 • Must 2
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore notes, past question papers, video lectures, and live class links for Nepali curriculum.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isTeacher ? (
            <ResourceFormDialog onResourceSaved={fetchResources} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRole("teacher")}
              className="gap-1.5 text-xs"
            >
              <Plus className="size-3.5" />
              <span>Switch to Teacher to Add</span>
            </Button>
          )}

          {resources.length === 0 && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedSampleData}
              disabled={isSeeding}
              className="gap-1.5 text-xs"
            >
              {isSeeding ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 text-amber-500" />
              )}
              <span>Load Sample Resources</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={fetchResources}
            disabled={isLoading}
            title="Refresh resources"
            aria-label="Refresh resources"
          >
            <RefreshCw className={isLoading ? "size-4 animate-spin" : "size-4"} />
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search notes, topics, or subjects..."
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
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <strong className="text-foreground">{filteredResources.length}</strong> of{" "}
            {resources.length} resources
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
            {isTeacher ? "Teacher (Edit & Manage)" : "Student (Browse & Learn)"}
          </strong>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-muted bg-muted/20 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted/60 rounded" />
                <div className="h-5 w-3/4 bg-muted/60 rounded" />
                <div className="h-3 w-full bg-muted/40 rounded" />
              </div>
              <div className="h-6 w-28 bg-muted/40 rounded self-end" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center space-y-3">
          <AlertCircle className="size-8 text-destructive mx-auto" />
          <h3 className="font-semibold text-destructive">Failed to load resources</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchResources} className="gap-1.5">
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : resources.length === 0 ? (
        /* Empty Database State */
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <BookOpen className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              No learning resources published yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start building the library by adding course notes, past question papers, or video lesson links. Or load sample Nepali curriculum resources with one click.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="default"
              onClick={handleSeedSampleData}
              disabled={isSeeding}
              className="gap-1.5 shadow-sm w-full sm:w-auto"
            >
              {isSeeding ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>Load Sample Resources</span>
            </Button>

            {isTeacher ? (
              <ResourceFormDialog
                onResourceSaved={fetchResources}
                triggerButton={
                  <Button variant="outline" className="gap-1.5 w-full sm:w-auto">
                    <Plus className="size-4" />
                    <span>Create Custom Resource</span>
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
      ) : filteredResources.length === 0 ? (
        /* Filter Empty State */
        <div className="rounded-2xl border border-dashed border-border p-10 text-center space-y-3 max-w-md mx-auto my-8">
          <Filter className="size-8 text-muted-foreground mx-auto" />
          <h3 className="font-medium text-foreground">No resources match your filter</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query, subject, or resource type.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        /* Resource Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
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
