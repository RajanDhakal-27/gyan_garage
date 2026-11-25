"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Quiz, QuizQuestion } from "@/types/database";
import { validateQuizInput } from "@/lib/quiz";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  HelpCircle,
  Loader2,
  Clock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

const COMMON_SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Nepali"];

interface QuizFormDialogProps {
  onQuizSaved: () => void;
  initialData?: Quiz | null;
  triggerButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function QuizFormDialog({
  onQuizSaved,
  initialData,
  triggerButton,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: QuizFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(val);
    } else {
      setInternalOpen(val);
    }
  };

  const isEditMode = Boolean(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "q_1",
      question: "",
      options: ["", ""],
      correct_answer: "",
      marks: 1,
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubject(initialData.subject || "");
      setDurationMinutes(Math.max(1, Math.round(initialData.duration_seconds / 60)));
      setDescription(initialData.description || "");
      setQuestions(
        Array.isArray(initialData.questions) && initialData.questions.length > 0
          ? initialData.questions
          : [
              {
                id: "q_1",
                question: "",
                options: ["", ""],
                correct_answer: "",
                marks: 1,
              },
            ]
      );
      setErrors({});
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setTitle("");
    setSubject("");
    setDurationMinutes(10);
    setDescription("");
    setQuestions([
      {
        id: `q_${Date.now()}`,
        question: "",
        options: ["", ""],
        correct_answer: "",
        marks: 1,
      },
    ]);
    setErrors({});
  };

  // Question manipulation
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q_${Date.now()}_${prev.length + 1}`,
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      toast.error("A quiz must have at least one question.");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  };

  const updateQuestionPrompt = (qIndex: number, text: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, question: text } : q))
    );
  };

  const updateQuestionOption = (
    qIndex: number,
    optIndex: number,
    val: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.options];
        const prevVal = newOptions[optIndex];
        newOptions[optIndex] = val;
        // If the updated option was the correct answer, update correct_answer too
        const newCorrect = q.correct_answer === prevVal ? val : q.correct_answer;
        return { ...q, options: newOptions, correct_answer: newCorrect };
      })
    );
  };

  const addOptionToQuestion = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        if (q.options.length >= 6) {
          toast.error("Maximum 6 options per question.");
          return q;
        }
        return { ...q, options: [...q.options, ""] };
      })
    );
  };

  const removeOptionFromQuestion = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        if (q.options.length <= 2) {
          toast.error("A question must have at least 2 options.");
          return q;
        }
        const removedVal = q.options[optIndex];
        const newOptions = q.options.filter((_, idx) => idx !== optIndex);
        const newCorrect =
          q.correct_answer === removedVal ? "" : q.correct_answer;
        return { ...q, options: newOptions, correct_answer: newCorrect };
      })
    );
  };

  const setCorrectOption = (qIndex: number, optValue: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, correct_answer: optValue } : q))
    );
  };

  const updateQuestionMarks = (qIndex: number, marksVal: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, marks: Math.max(1, marksVal) } : q))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const durationSeconds = Math.max(1, Math.round(durationMinutes * 60));

    const cleanedQuestions = questions.map((q, i) => ({
      ...q,
      id: q.id || `q_${i + 1}`,
      question: q.question.trim(),
      options: q.options.map((o) => o.trim()).filter(Boolean),
      correct_answer: q.correct_answer.trim(),
      marks: Number(q.marks) || 1,
    }));

    const validation = validateQuizInput({
      title,
      subject,
      description,
      duration_seconds: durationSeconds,
      questions: cleanedQuestions,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      if (isEditMode && initialData) {
        const { error: updateErr } = await supabase
          .from("quizzes")
          .update({
            title: title.trim(),
            subject: subject.trim() || null,
            description: description.trim() || null,
            duration_seconds: durationSeconds,
            questions: cleanedQuestions,
          })
          .eq("id", initialData.id);

        if (updateErr) throw updateErr;
        toast.success("Quiz updated successfully!");
      } else {
        const { error: insertErr } = await supabase.from("quizzes").insert({
          title: title.trim(),
          subject: subject.trim() || null,
          description: description.trim() || null,
          duration_seconds: durationSeconds,
          questions: cleanedQuestions,
        });

        if (insertErr) throw insertErr;
        toast.success("Quiz published successfully!");
      }

      resetForm();
      setOpen(false);
      onQuizSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save quiz.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerButton ? (
        <DialogTrigger render={triggerButton as React.ReactElement} />
      ) : !isControlled ? (
        <DialogTrigger
          render={
            <Button className="gap-1.5 shadow-sm">
              <Plus className="size-4" />
              <span>Create Quiz</span>
            </Button>
          }
        />
      ) : null}

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Quiz" : "Create Objective Quiz"}</DialogTitle>
          <DialogDescription>
            Construct multiple-choice questions, set timer duration, and specify correct answers for auto-scoring.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          {/* Metadata Section */}
          <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="size-3.5" />
              <span>Quiz Details</span>
            </h4>

            {/* Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="quiz_title"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Quiz Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="quiz_title"
                placeholder="e.g. Grade 10 Science: Force & Gravitation"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                required
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Subject & Duration in a grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Subject */}
              <div className="space-y-1.5">
                <label
                  htmlFor="quiz_subject"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Subject
                </label>
                <Input
                  id="quiz_subject"
                  placeholder="e.g. Science"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {COMMON_SUBJECTS.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setSubject(s)}
                      className="rounded border border-muted bg-muted/40 px-1.5 py-0.5 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Minutes */}
              <div className="space-y-1.5">
                <label
                  htmlFor="quiz_duration"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Time Limit (Minutes) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="quiz_duration"
                    type="number"
                    min={1}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) =>
                      setDurationMinutes(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="pl-8"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Saved as {durationMinutes * 60} seconds timer for student attempts.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="quiz_desc"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Description or Syllabus Coverage (Optional)
              </label>
              <Textarea
                id="quiz_desc"
                placeholder="e.g. Unit 1 assessment covering Newton's gravitation laws..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Questions Builder Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Multiple-Choice Questions ({questions.length})
                </h4>
                <p className="text-xs text-muted-foreground">
                  Click the radio circle next to an option to designate it as the correct answer.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                className="gap-1.5 text-xs shadow-2xs"
              >
                <Plus className="size-3.5" />
                <span>Add Question</span>
              </Button>
            </div>

            {errors.questions && (
              <p className="text-xs text-destructive">{errors.questions}</p>
            )}

            <div className="space-y-4">
              {questions.map((q, qIndex) => {
                const questionError = errors[`question_${qIndex}`];
                const optionsError = errors[`question_${qIndex}_options`];
                const correctError = errors[`question_${qIndex}_correct`];

                return (
                  <div
                    key={q.id || qIndex}
                    className="rounded-xl border bg-card p-4 space-y-3.5 shadow-2xs relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-semibold">
                          Q{qIndex + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Objective MCQ
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs">
                          <label
                            htmlFor={`marks_${qIndex}`}
                            className="text-muted-foreground font-medium"
                          >
                            Marks:
                          </label>
                          <Input
                            id={`marks_${qIndex}`}
                            type="number"
                            min={1}
                            max={10}
                            value={q.marks}
                            onChange={(e) =>
                              updateQuestionMarks(
                                qIndex,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="h-7 w-14 text-center text-xs p-1"
                          />
                        </div>

                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeQuestion(qIndex)}
                            className="text-muted-foreground hover:text-destructive"
                            title="Delete question"
                            aria-label={`Delete question ${qIndex + 1}`}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Question Prompt */}
                    <div className="space-y-1">
                      <Input
                        placeholder={`Question ${qIndex + 1} text...`}
                        value={q.question}
                        onChange={(e) => updateQuestionPrompt(qIndex, e.target.value)}
                        className="font-medium text-sm"
                      />
                      {questionError && (
                        <p className="text-xs text-destructive">{questionError}</p>
                      )}
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        Options (select correct answer):
                      </label>

                      {q.options.map((opt, optIndex) => {
                        const isCorrect =
                          Boolean(opt) && q.correct_answer === opt;
                        const optionLetter = String.fromCharCode(65 + optIndex);

                        return (
                          <div
                            key={optIndex}
                            className="flex items-center gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => opt && setCorrectOption(qIndex, opt)}
                              title={
                                isCorrect
                                  ? "Marked as correct"
                                  : "Click to set as correct answer"
                              }
                              className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                                isCorrect
                                  ? "border-emerald-600 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "border-muted-foreground/30 text-muted-foreground hover:border-primary"
                              }`}
                            >
                              {isCorrect ? (
                                <CheckCircle2 className="size-4" />
                              ) : (
                                <span className="text-[10px] font-bold">
                                  {optionLetter}
                                </span>
                              )}
                            </button>

                            <Input
                              placeholder={`Option ${optionLetter}`}
                              value={opt}
                              onChange={(e) =>
                                updateQuestionOption(
                                  qIndex,
                                  optIndex,
                                  e.target.value
                                )
                              }
                              className="h-8 text-xs flex-1"
                            />

                            {q.options.length > 2 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() =>
                                  removeOptionFromQuestion(qIndex, optIndex)
                                }
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            )}
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between pt-1">
                        {q.options.length < 6 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => addOptionToQuestion(qIndex)}
                            className="h-6 text-xs text-primary gap-1 p-0"
                          >
                            <Plus className="size-3" />
                            <span>Add Option</span>
                          </Button>
                        )}

                        {q.correct_answer ? (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium ml-auto flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            <span>Answer: {q.correct_answer}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium ml-auto flex items-center gap-1">
                            <HelpCircle className="size-3" />
                            <span>Select a correct option</span>
                          </span>
                        )}
                      </div>

                      {optionsError && (
                        <p className="text-xs text-destructive">{optionsError}</p>
                      )}
                      {correctError && (
                        <p className="text-xs text-destructive">{correctError}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>{isEditMode ? "Saving Quiz..." : "Publishing Quiz..."}</span>
                </>
              ) : (
                <span>{isEditMode ? "Save Changes" : "Publish Quiz"}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
