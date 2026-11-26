"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole, UserRole } from "@/context/role-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

const STUDENT_GRADES = [
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10 (SEE)",
  "Grade 11",
  "Grade 12",
  "Other / Tuition",
];

const TEACHER_GRADES = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Other / Coaching",
];

export function OnboardingDialog() {
  const router = useRouter();
  const { isOnboardingOpen, setIsOnboardingOpen, completeOnboarding } = useRole();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [selectedGrade, setSelectedGrade] = useState("Grade 10 (SEE)");
  const [selectedGradesTaught, setSelectedGradesTaught] = useState<string[]>([
    "Grade 9",
    "Grade 10",
  ]);
  const [userName, setUserName] = useState("");

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const toggleTeacherGrade = (grade: string) => {
    setSelectedGradesTaught((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  const handleFinish = () => {
    if (selectedRole === "teacher" && selectedGradesTaught.length === 0) {
      toast.error("Please select at least one grade you teach.");
      return;
    }

    completeOnboarding({
      role: selectedRole,
      grade: selectedRole === "student" ? selectedGrade : undefined,
      gradesTaught: selectedRole === "teacher" ? selectedGradesTaught : undefined,
      name: userName.trim() || undefined,
    });

    toast.success(
      `Welcome to Gyan Garage as a ${
        selectedRole === "teacher" ? "Teacher" : "Student"
      }!`
    );

    // Redirect to respective dashboard
    if (selectedRole === "teacher") {
      router.push("/dashboard/teacher");
    } else {
      router.push("/dashboard/student");
    }
  };

  return (
    <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
      <DialogContent className="max-w-xl sm:max-w-xl">
        <div className="space-y-5">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="secondary">
                <Sparkles className="size-3.5" />
                Academic onboarding
              </Badge>
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#635F69]">
                Step {step} of 2
              </span>
            </div>

            <DialogTitle className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
              {step === 1
                ? "How will you use Gyan Garage?"
                : selectedRole === "student"
                  ? "Which grade are you studying in?"
                  : "Which grades do you teach?"}
            </DialogTitle>

            <DialogDescription>
              {step === 1
                ? "Select your primary role. This customizes your academic workspace, library recommendations and tools."
                : selectedRole === "student"
                  ? "Choose your current academic grade level so we can organize your question papers and syllabus notes."
                  : "Select one or multiple classes to tailor your teaching resources and assignments."}
            </DialogDescription>
          </DialogHeader>

          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div className="space-y-5 py-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Option A: Student */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("student")}
                  className={cn(
                    "group relative flex cursor-pointer flex-col justify-between rounded-[28px] border p-5 text-left outline-none transition-all duration-300",
                    selectedRole === "student"
                      ? "-translate-y-1 border-[#7C3AED]/40 bg-white/90 shadow-clayCard"
                      : "border-white/60 bg-white/50 shadow-clayPressed hover:-translate-y-1 hover:bg-white/70"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton">
                        <BookOpen className="size-5" />
                      </span>
                      {selectedRole === "student" && (
                        <span className="flex size-6 items-center justify-center rounded-full bg-[#10B981] text-white shadow-clayButton">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-xl font-extrabold text-[#332F3A]">
                      Student
                    </h3>
                    <p className="text-xs leading-relaxed text-[#635F69]">
                      Learn, practice, organize your studies and access
                      curriculum notes, question papers and study timers.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 border-t border-white/70 pt-3 font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#7C3AED]">
                    Study workspace
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>

                {/* Option B: Teacher */}
                <button
                  type="button"
                  onClick={() => setSelectedRole("teacher")}
                  className={cn(
                    "group relative flex cursor-pointer flex-col justify-between rounded-[28px] border p-5 text-left outline-none transition-all duration-300",
                    selectedRole === "teacher"
                      ? "-translate-y-1 border-[#10B981]/40 bg-white/90 shadow-clayCard"
                      : "border-white/60 bg-white/50 shadow-clayPressed hover:-translate-y-1 hover:bg-white/70"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6EE7B7] to-[#10B981] text-white shadow-clayButton">
                        <GraduationCap className="size-5" />
                      </span>
                      {selectedRole === "teacher" && (
                        <span className="flex size-6 items-center justify-center rounded-full bg-[#10B981] text-white shadow-clayButton">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-xl font-extrabold text-[#332F3A]">
                      Teacher
                    </h3>
                    <p className="text-xs leading-relaxed text-[#635F69]">
                      Organize teaching materials, publish academic resources,
                      construct objective quizzes and assign homework.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 border-t border-white/70 pt-3 font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#10B981]">
                    Educator studio
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </button>
              </div>

              {/* Optional Name */}
              <div className="space-y-2">
                <label
                  htmlFor="user_name"
                  className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
                >
                  Your name / scholar title (optional)
                </label>
                <Input
                  id="user_name"
                  placeholder={
                    selectedRole === "teacher"
                      ? "e.g. Ramesh Sir / Educator"
                      : "e.g. Aarav Sharma"
                  }
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: GRADE SELECTION */}
          {step === 2 && (
            <div className="space-y-4 py-1">
              {selectedRole === "student" ? (
                /* Student: Single Select */
                <div className="space-y-2.5">
                  <span className="block font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]">
                    Select your current grade
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {STUDENT_GRADES.map((grade) => {
                      const isSelected = selectedGrade === grade;
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setSelectedGrade(grade)}
                          className={cn(
                            "flex cursor-pointer items-center justify-between gap-1 rounded-2xl border px-3 py-2.5 text-left text-xs font-bold transition-all duration-200",
                            isSelected
                              ? "border-transparent bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                              : "border-white/60 bg-[#EFEBF5] text-[#332F3A] shadow-clayPressed hover:-translate-y-0.5 hover:text-[#7C3AED]"
                          )}
                        >
                          <span className="truncate">{grade}</span>
                          {isSelected && <Check className="size-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Teacher: Multi Select */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]">
                      Select all classes you teach
                    </span>
                    <span className="font-heading text-[11px] font-extrabold text-[#7C3AED]">
                      {selectedGradesTaught.length} selected
                    </span>
                  </div>
                  <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto rounded-[24px] bg-[#EFEBF5] p-3 shadow-clayPressed sm:grid-cols-4">
                    {TEACHER_GRADES.map((grade) => {
                      const isSelected = selectedGradesTaught.includes(grade);
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => toggleTeacherGrade(grade)}
                          className={cn(
                            "flex cursor-pointer items-center justify-between gap-1 rounded-2xl border px-3 py-2 text-left text-xs font-bold transition-all duration-200",
                            isSelected
                              ? "border-transparent bg-gradient-to-br from-[#6EE7B7] to-[#10B981] text-white shadow-clayButton"
                              : "border-white/70 bg-white/70 text-[#332F3A] shadow-clayCard hover:-translate-y-0.5 hover:text-[#10B981]"
                          )}
                        >
                          <span className="truncate">{grade}</span>
                          {isSelected && (
                            <Check className="size-3 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="items-center sm:justify-between">
          {step === 2 ? (
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="size-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div className="text-[11px] font-medium text-[#635F69]">
              No registration required
            </div>
          )}

          {step === 1 ? (
            <Button size="sm" onClick={handleNext} className="ml-auto">
              <span>Continue</span>
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleFinish} className="ml-auto">
              <span>
                Enter{" "}
                {selectedRole === "teacher" ? "teacher studio" : "student desk"}
              </span>
              <ArrowRight className="size-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
