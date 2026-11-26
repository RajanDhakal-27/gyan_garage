"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { LearningItem } from "@/types/database";
import { useRole } from "@/context/role-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  Download,
  Copy,
  Calendar,
  Layers,
  BookOpen,
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
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Official Examination Vault
              </span>
              <span className="text-border">/</span>
              <span className="font-mono text-xs text-muted-foreground">Past Papers & Model Sets</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Question Papers Archive
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Authentic terminal examinations, board model question sets, and assessment rubrics for rigorous exam readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {papers.length === 0 && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeed}
                disabled={isSeeding}
                className="font-mono text-xs gap-1.5"
              >
                {isSeeding ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                Seed Model Sets
              </Button>
            )}
            {isTeacher && (
              <Button
                size="sm"
                onClick={() => setIsAddOpen(true)}
                className="font-mono text-xs gap-1.5"
              >
                <Plus className="size-3.5" />
                Archive Question Paper
              </Button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by paper title, curriculum topic, year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 font-mono text-xs bg-card"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {subjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={cn(
                  "px-3 py-1.5 text-xs font-mono transition-colors shrink-0 border",
                  selectedSubject === sub
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border/80 hover:border-primary/50"
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Question Papers List */}
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground font-mono text-xs flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Opening examination archive...
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="border border-border/80 bg-card p-12 text-center space-y-4">
            <FileText className="size-8 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-medium">No question papers located</h3>
              <p className="font-mono text-xs text-muted-foreground">
                No matching model question papers or past examination sets found.
              </p>
            </div>
            {papers.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeed}
                disabled={isSeeding}
                className="font-mono text-xs gap-1.5"
              >
                <Sparkles className="size-3.5" />
                Load Official Model Papers
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/60 border border-border/80 bg-card">
            {filteredPapers.map((paper, index) => (
              <div
                key={paper.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-primary font-bold">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {paper.subject || "Examination"}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      Model Set
                    </Badge>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-foreground">
                    {paper.title}
                  </h3>

                  {paper.topic && (
                    <p className="font-mono text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">Coverage:</span> {paper.topic}
                    </p>
                  )}

                  {paper.description && (
                    <p className="font-mono text-xs text-secondary-ink line-clamp-2">
                      {paper.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  {paper.external_url ? (
                    <a
                      href={paper.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="font-mono text-xs gap-1.5">
                        <FileText className="size-3.5" />
                        View Paper
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info("Physical examination paper cataloged in academic library.")}
                      className="font-mono text-xs gap-1.5"
                    >
                      <FileText className="size-3.5" />
                      Paper Details
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon-xs"
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
                  >
                    <Copy className="size-3.5 text-muted-foreground" />
                  </Button>

                  {isTeacher && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(paper.id, paper.title)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete paper"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Teacher Add Paper Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="border-border/80 bg-background max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-medium">
                Archive Question Paper
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-muted-foreground">
                Catalog an official board question paper, mock set, or unit evaluation paper.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddPaper} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-mono text-xs font-semibold text-foreground">
                  Paper Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Class 10 Compulsory Mathematics Model Set 2080"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="font-mono text-xs bg-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-semibold text-foreground">
                    Subject *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Mathematics"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="font-mono text-xs bg-card"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-semibold text-foreground">
                    Curriculum Topic
                  </label>
                  <Input
                    placeholder="e.g. Full Syllabus / SEE Prep"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="font-mono text-xs bg-card"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-semibold text-foreground">
                  PDF / Document Link
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/question-paper.pdf"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="font-mono text-xs bg-card"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs font-semibold text-foreground">
                  Description & Rubrics
                </label>
                <textarea
                  rows={3}
                  placeholder="Time limit: 3 hours. Marks breakdown, instructions, and reference keys..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full border border-border/80 bg-card p-2 font-mono text-xs rounded-none focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  className="font-mono text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-mono text-xs gap-1.5"
                >
                  {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                  Save Question Paper
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <QuestionPapersContent />
    </Suspense>
  );
}
