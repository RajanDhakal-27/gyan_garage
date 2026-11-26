"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { LearningItem } from "@/types/database";
import { useRole } from "@/context/role-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Plus,
  RefreshCw,
  Sparkles,
  Copy,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

const SAMPLE_PAPERS: Partial<LearningItem>[] = [
  {
    title: "SEE Board Examination — Compulsory Mathematics (Model Set A)",
    item_type: "resource",
    resource_type: "Question Paper",
    subject: "Mathematics",
    topic: "Full Syllabus (Arithmetic, Algebra, Geometry, Trigonometry, Statistics)",
    description: "Official model question set formatted according to CDC specifications with full marks 75 and 3 hours duration.",
    external_url: "https://moecdc.gov.np",
  },
  {
    title: "Secondary Science & Technology — Pre-Board Terminal Examination",
    item_type: "resource",
    resource_type: "Question Paper",
    subject: "Science",
    topic: "Physics & Chemistry Comprehensive Units",
    description: "Structured question paper covering Mechanics, Heat & Light, Wave Motion, Periodic Table, and Organic Compounds.",
    external_url: "https://moecdc.gov.np",
  },
  {
    title: "Compulsory English Model Paper — Reading Comprehension & Writing",
    item_type: "resource",
    resource_type: "Question Paper",
    subject: "English",
    topic: "Reading Prose, Grammar Transformation, Essay Writing",
    description: "Standardized evaluation paper including poem interpretation, unseen passage analysis, and report drafting.",
    external_url: "https://moecdc.gov.np",
  },
  {
    title: "Social Studies & Contemporary Society — Annual Model Exam",
    item_type: "resource",
    resource_type: "Question Paper",
    subject: "Social Studies",
    topic: "Constitution, Civic Duties, National Heritage, Geography",
    description: "Comprehensive question set containing critical thinking problems, map work guidelines, and historical analysis.",
    external_url: "https://moecdc.gov.np",
  },
  {
    title: "Optional Mathematics — Advanced Coordinate Geometry & Vectors",
    item_type: "resource",
    resource_type: "Question Paper",
    subject: "Mathematics",
    topic: "Matrices, Trigonometry, Coordinate Geometry, Vectors, Transformations",
    description: "Model set focusing on high-level problem solving, vector proofs, and trigonometric identities.",
    external_url: "https://moecdc.gov.np",
  },
];

function QuestionPapersContent() {
  const { isTeacher } = useRole();
  const [papers, setPapers] = useState<LearningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [isSeeding, setIsSeeding] = useState(false);

  // New Paper Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newTopic, setNewTopic] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPapers = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("learning_items")
        .select("*")
        .eq("item_type", "resource")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filter items whose resource_type indicates a paper or exam
      const questionItems = (data || []).filter((item) => {
        const type = (item.resource_type || "").toLowerCase();
        const title = item.title.toLowerCase();
        return (
          type.includes("paper") ||
          type.includes("question") ||
          type.includes("exam") ||
          title.includes("model paper") ||
          title.includes("question paper") ||
          title.includes("examination")
        );
      });

      setPapers(questionItems);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load question papers.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  // Seed sample question papers
  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      const { error } = await supabase.from("learning_items").insert(SAMPLE_PAPERS);
      if (error) throw error;
      toast.success("Sample model question papers added!");
      fetchPapers();
    } catch {
      toast.error("Failed to seed question papers.");
    } finally {
      setIsSeeding(false);
    }
  };

  // Add new paper
  const handleAddPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Paper title is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("learning_items").insert({
        title: newTitle.trim(),
        item_type: "resource",
        resource_type: "Question Paper",
        subject: newSubject.trim(),
        topic: newTopic.trim() || undefined,
        description: newDescription.trim() || undefined,
        external_url: newUrl.trim() || undefined,
      });

      if (error) throw error;

      toast.success("Question paper archived successfully.");
      setIsAddOpen(false);
      setNewTitle("");
      setNewTopic("");
      setNewUrl("");
      setNewDescription("");
      fetchPapers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save paper.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete question paper "${title}"?`)) return;
    try {
      const { error } = await supabase.from("learning_items").delete().eq("id", id);
      if (error) throw error;
      setPapers((prev) => prev.filter((p) => p.id !== id));
      toast.success("Question paper deleted.");
    } catch {
      toast.error("Failed to delete paper.");
    }
  };

  const subjects = useMemo(() => {
    const set = new Set<string>();
    papers.forEach((p) => {
      if (p.subject) set.add(p.subject);
    });
    return ["All", ...Array.from(set).sort()];
  }, [papers]);

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.topic && p.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSubject =
        selectedSubject === "All" || p.subject?.toLowerCase() === selectedSubject.toLowerCase();

      return matchesSearch && matchesSubject;
    });
  }, [papers, searchQuery, selectedSubject]);

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-7">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 rounded-[36px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl sm:p-8 lg:flex-row lg:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Examination vault</Badge>
              <Badge variant="outline">Past papers · Model sets</Badge>
            </div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl">
              Question Papers Archive
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#635F69]">
              Authentic terminal examinations, board model question sets and
              assessment rubrics for rigorous exam readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {papers.length === 0 && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeed}
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
            {isTeacher && (
              <Button size="sm" onClick={() => setIsAddOpen(true)}>
                <Plus className="size-4" />
                Archive paper
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={fetchPapers}
              disabled={isLoading}
              title="Refresh papers"
              aria-label="Refresh papers"
            >
              <RefreshCw className={isLoading ? "size-5 animate-spin" : "size-5"} />
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-[#635F69]" />
            <Input
              placeholder="Search by paper title, curriculum topic, year…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-5 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {subjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full px-4 py-2 font-heading text-xs font-extrabold transition-all duration-200",
                  selectedSubject === sub
                    ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                    : "border border-white/70 bg-white/60 text-[#635F69] shadow-clayPressed hover:-translate-y-0.5 hover:text-[#7C3AED]"
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Question Papers List */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-[32px] border border-white/60 bg-white/40 p-12 text-xs text-[#635F69] shadow-clayPressed">
            <Loader2 className="size-4 animate-spin" />
            Opening examination archive…
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="mx-auto max-w-md space-y-4 rounded-[40px] border border-dashed border-[#7C3AED]/25 bg-white/60 p-10 text-center shadow-clayPressed">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-[#7C3AED]/10 text-[#7C3AED]">
              <FileText className="size-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                No question papers located
              </h3>
              <p className="text-sm text-[#635F69]">
                No matching model question papers or past examination sets
                found.
              </p>
            </div>
            {papers.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeed}
                disabled={isSeeding}
              >
                <Sparkles className="size-4 text-[#F59E0B]" />
                Load official model papers
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPapers.map((paper, index) => (
              <div
                key={paper.id}
                className="flex flex-col justify-between gap-4 rounded-[32px] border border-white/70 bg-white/70 p-5 shadow-clayCard backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-clayDeep sm:flex-row sm:items-center"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-xs font-extrabold text-[#7C3AED]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge variant="outline">
                      {paper.subject || "Examination"}
                    </Badge>
                    <Badge variant="secondary">Model set</Badge>
                  </div>

                  <h3 className="font-heading text-lg font-extrabold leading-snug text-[#332F3A]">
                    {paper.title}
                  </h3>

                  {paper.topic && (
                    <p className="text-xs text-[#635F69]">
                      <span className="font-bold text-[#332F3A]">Coverage:</span>{" "}
                      {paper.topic}
                    </p>
                  )}

                  {paper.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-[#635F69]">
                      {paper.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {paper.external_url ? (
                    <a
                      href={paper.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm">
                        <FileText className="size-4" />
                        View paper
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toast.info(
                          "Physical examination paper cataloged in academic library."
                        )
                      }
                    >
                      <FileText className="size-4" />
                      Paper details
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      if (paper.external_url) {
                        navigator.clipboard.writeText(paper.external_url);
                        toast.success("Paper link copied to clipboard.");
                      } else {
                        navigator.clipboard.writeText(paper.title);
                        toast.success("Paper title copied.");
                      }
                    }}
                    title="Copy link"
                    aria-label="Copy paper link"
                  >
                    <Copy className="size-4" />
                  </Button>

                  {isTeacher && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(paper.id, paper.title)}
                      className="text-[#635F69] hover:bg-[#DB2777]/10 hover:text-[#DB2777]"
                      title="Delete paper"
                      aria-label={`Delete ${paper.title}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Teacher Add Paper Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Archive question paper</DialogTitle>
              <DialogDescription>
                Catalog an official board question paper, mock set or unit
                evaluation paper.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddPaper} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label
                  htmlFor="paper-title"
                  className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
                >
                  Paper title *
                </label>
                <Input
                  id="paper-title"
                  required
                  placeholder="e.g. Class 10 Compulsory Mathematics Model Set 2080"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label
                    htmlFor="paper-subject"
                    className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
                  >
                    Subject *
                  </label>
                  <Input
                    id="paper-subject"
                    required
                    placeholder="e.g. Mathematics"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="paper-topic"
                    className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
                  >
                    Curriculum topic
                  </label>
                  <Input
                    id="paper-topic"
                    placeholder="e.g. Full syllabus"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="paper-url"
                  className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
                >
                  PDF / document link
                </label>
                <Input
                  id="paper-url"
                  type="url"
                  placeholder="https://example.com/question-paper.pdf"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="paper-description"
                  className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
                >
                  Description & rubrics
                </label>
                <textarea
                  id="paper-description"
                  rows={3}
                  placeholder="Time limit: 3 hours. Marks breakdown, instructions and reference keys…"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-2xl border border-white/60 bg-[#EFEBF5] px-5 py-4 text-sm text-[#332F3A] shadow-clayPressed outline-none transition-shadow placeholder:text-[#635F69]/70 focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  Save question paper
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function QuestionPapersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#7C3AED]" />
        </div>
      }
    >
      <QuestionPapersContent />
    </Suspense>
  );
}
