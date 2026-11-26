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
  School,
  CheckCircle2,
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
      <DialogContent className="max-w-xl border border-[rgba(20,28,43,0.24)] bg-[#EFE9DD] p-8 text-[#141C2B] rounded-none shadow-2xl">
        <DialogHeader className="space-y-2 border-b border-[rgba(20,28,43,0.16)] pb-4 text-left">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#767E8C]">
            <span>[ § ACADEMIC ONBOARDING ]</span>
            <span>STEP {step} OF 2</span>
          </div>

          <DialogTitle className="font-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#141C2B]">
            {step === 1 ? "How will you use Gyan Garage?" : (
              selectedRole === "student"
                ? "Which grade are you studying in?"
                : "Which grades do you teach?"
            )}
          </DialogTitle>

          <DialogDescription className="font-mono text-xs text-[#4A5364]">
            {step === 1
              ? "Select your primary role. This customizes your academic workspace, library recommendations, and tools."
              : (selectedRole === "student"
                ? "Choose your current academic grade level so we can organize your question papers and syllabus notes."
                : "Select one or multiple classes to tailor your teaching resources and assignments.")}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Student */}
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={cn(
                  "relative flex flex-col justify-between p-5 text-left border transition-all rounded-none outline-none cursor-pointer",
                  selectedRole === "student"
                    ? "border-[#2C4A8F] bg-[#E5DED0] shadow-sm ring-1 ring-[#2C4A8F]"
                    : "border-[rgba(20,28,43,0.16)] bg-[#EFE9DD] hover:bg-[#E5DED0]/50"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#767E8C]">
                      ROLE: 01
                    </span>
                    {selectedRole === "student" && (
                      <span className="flex size-4 items-center justify-center bg-[#2C4A8F] text-[#EFE9DD]">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#141C2B]">
                    Student
                  </h3>
                  <p className="font-mono text-xs text-[#4A5364] leading-relaxed">
                    Learn, practice, organize your studies, and access curriculum notes, question papers, and study timers.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(20,28,43,0.12)] font-mono text-[10px] text-[#2C4A8F] uppercase">
                  → Study workspace
                </div>
              </button>

              {/* Option B: Teacher */}
              <button
                type="button"
                onClick={() => setSelectedRole("teacher")}
                className={cn(
                  "relative flex flex-col justify-between p-5 text-left border transition-all rounded-none outline-none cursor-pointer",
                  selectedRole === "teacher"
                    ? "border-[#2C4A8F] bg-[#E5DED0] shadow-sm ring-1 ring-[#2C4A8F]"
                    : "border-[rgba(20,28,43,0.16)] bg-[#EFE9DD] hover:bg-[#E5DED0]/50"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#767E8C]">
                      ROLE: 02
                    </span>
                    {selectedRole === "teacher" && (
                      <span className="flex size-4 items-center justify-center bg-[#2C4A8F] text-[#EFE9DD]">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#141C2B]">
                    Teacher
                  </h3>
                  <p className="font-mono text-xs text-[#4A5364] leading-relaxed">
                    Organize teaching materials, publish academic resources, construct objective quizzes, and assign homework.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[rgba(20,28,43,0.12)] font-mono text-[10px] text-[#2C4A8F] uppercase">
                  → Educator studio
                </div>
              </button>
            </div>

            {/* Optional Name */}
            <div className="space-y-1.5 pt-2">
              <label
                htmlFor="user_name"
                className="font-mono text-[11px] uppercase tracking-wider text-[#767E8C]"
              >
                Your Name / Scholar Title (Optional)
              </label>
              <Input
                id="user_name"
                placeholder={selectedRole === "teacher" ? "e.g. Ramesh Sir / Educator" : "e.g. Aarav Sharma"}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-[#EFE9DD] border-[rgba(20,28,43,0.2)]"
              />
            </div>
          </div>
        )}

        {/* STEP 2: GRADE SELECTION */}
        {step === 2 && (
          <div className="space-y-4 py-4">
            {selectedRole === "student" ? (
              /* Student: Single Select */
              <div className="space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#767E8C] block">
                  Select your current grade:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STUDENT_GRADES.map((grade) => {
                    const isSelected = selectedGrade === grade;
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => setSelectedGrade(grade)}
                        className={cn(
                          "flex items-center justify-between p-3 border font-mono text-xs text-left transition-colors cursor-pointer",
                          isSelected
                            ? "border-[#2C4A8F] bg-[#2C4A8F] text-[#EFE9DD] font-bold"
                            : "border-[rgba(20,28,43,0.16)] bg-[#E5DED0]/50 hover:bg-[#E5DED0] text-[#141C2B]"
                        )}
                      >
                        <span>{grade}</span>
                        {isSelected && <Check className="size-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Teacher: Multi Select */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#767E8C]">
                    Select all classes you teach:
                  </span>
                  <span className="font-mono text-[10px] text-[#2C4A8F]">
                    {selectedGradesTaught.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1 border border-[rgba(20,28,43,0.12)]">
                  {TEACHER_GRADES.map((grade) => {
                    const isSelected = selectedGradesTaught.includes(grade);
                    return (
                      <button
                        key={grade}
                        type="button"
                        onClick={() => toggleTeacherGrade(grade)}
                        className={cn(
                          "flex items-center justify-between p-2.5 border font-mono text-xs text-left transition-colors cursor-pointer",
                          isSelected
                            ? "border-[#2C4A8F] bg-[#2C4A8F] text-[#EFE9DD] font-bold"
                            : "border-[rgba(20,28,43,0.16)] bg-[#EFE9DD] hover:bg-[#E5DED0] text-[#141C2B]"
                        )}
                      >
                        <span className="truncate">{grade}</span>
                        {isSelected && <Check className="size-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="border-t border-[rgba(20,28,43,0.16)] bg-[#E5DED0]/60 p-4 -mx-8 -mb-8 flex items-center justify-between sm:justify-between">
          {step === 2 ? (
            <Button variant="outline" size="sm" onClick={handleBack} className="gap-1.5">
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div className="font-mono text-[11px] text-[#767E8C]">
              No registration required
            </div>
          )}

          {step === 1 ? (
            <Button size="sm" onClick={handleNext} className="gap-1.5 ml-auto">
              <span>Continue</span>
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleFinish} className="gap-1.5 ml-auto">
              <span>Enter {selectedRole === "teacher" ? "Teacher Studio" : "Student Desk"}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
