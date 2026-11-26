"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRole, UserRole } from "@/context/role-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  School,
  RotateCcw,
  Check,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";

const STUDENT_GRADES = [
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Other",
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
  "Other",
];

function ProfileContent() {
  const {
    role,
    grade,
    gradesTaught,
    profile,
    setIsOnboardingOpen,
    completeOnboarding,
  } = useRole();

  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [selectedGrade, setSelectedGrade] = useState<string>(grade || "Grade 10");
  const [selectedGradesTaught, setSelectedGradesTaught] = useState<string[]>(
    gradesTaught || ["Grade 9", "Grade 10"]
  );
  const [userName, setUserName] = useState<string>(profile.name || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedRole(role);
    setSelectedGrade(grade || "Grade 10");
    setSelectedGradesTaught(gradesTaught || ["Grade 9", "Grade 10"]);
    setUserName(profile.name || "");
  }, [role, grade, gradesTaught, profile]);

  const toggleTeacherGrade = (g: string) => {
    setSelectedGradesTaught((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const handleSave = () => {
    try {
      setIsSaving(true);
      completeOnboarding({
        role: selectedRole,
        grade: selectedRole === "student" ? selectedGrade : undefined,
        gradesTaught: selectedRole === "teacher" ? selectedGradesTaught : undefined,
        name: userName.trim() || undefined,
      });
      toast.success("Profile preferences updated successfully.");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <Badge variant="secondary">
            <GraduationCap className="size-3.5" />
            Academic dossier
          </Badge>
          <h1 className="font-heading text-3xl font-black tracking-tight text-[#332F3A] sm:text-4xl lg:text-5xl">
            Profile & Role Configuration
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#635F69] sm:text-base">
            Switch your active academic role, revise enrolled grade levels, and
            customise your scholar identity.
          </p>
        </div>

        {/* Main card */}
        <div className="space-y-8 rounded-[40px] border border-white/70 bg-white/70 p-6 shadow-clayDeep backdrop-blur-xl sm:p-10">
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="display-name"
              className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]"
            >
              Display name
            </label>
            <Input
              id="display-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Suman Sharma"
              className="max-w-md"
            />
            <p className="text-xs text-[#635F69]">
              Used across score cards, your study ledger and dashboard greetings.
            </p>
          </div>

          {/* Role */}
          <div className="space-y-3">
            <label className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]">
              Primary role
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={cn(
                  "flex cursor-pointer flex-col justify-between gap-3 rounded-[28px] border p-5 text-left transition-all duration-200",
                  selectedRole === "student"
                    ? "border-transparent bg-gradient-to-br from-[#A78BFA]/20 to-[#7C3AED]/10 shadow-clayPressed ring-2 ring-[#7C3AED]/40"
                    : "border-white/70 bg-white/50 shadow-clayCard hover:-translate-y-1 hover:bg-white/80"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl",
                      selectedRole === "student"
                        ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                        : "bg-[#EFEBF5] text-[#635F69]"
                    )}
                  >
                    <GraduationCap className="size-6" />
                  </span>
                  {selectedRole === "student" && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#10B981] text-white shadow-clayButton">
                      <Check className="size-4 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                    Student / Scholar
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#635F69]">
                    Study curriculum materials, solve past papers, take timed
                    quizzes and track daily goals.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("teacher")}
                className={cn(
                  "flex cursor-pointer flex-col justify-between gap-3 rounded-[28px] border p-5 text-left transition-all duration-200",
                  selectedRole === "teacher"
                    ? "border-transparent bg-gradient-to-br from-[#67E8F9]/20 to-[#0EA5E9]/10 shadow-clayPressed ring-2 ring-[#0EA5E9]/40"
                    : "border-white/70 bg-white/50 shadow-clayCard hover:-translate-y-1 hover:bg-white/80"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-12 items-center justify-center rounded-2xl",
                      selectedRole === "teacher"
                        ? "bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] text-white shadow-clayButton"
                        : "bg-[#EFEBF5] text-[#635F69]"
                    )}
                  >
                    <School className="size-6" />
                  </span>
                  {selectedRole === "teacher" && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#10B981] text-white shadow-clayButton">
                      <Check className="size-4 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-[#332F3A]">
                    Teacher / Educator
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#635F69]">
                    Publish resources, assign homework, author quizzes and
                    archive question papers.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Grades */}
          {selectedRole === "student" ? (
            <div className="space-y-3 border-t border-[#7C3AED]/10 pt-6">
              <label className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]">
                Enrolled grade level
              </label>
              <p className="text-xs text-[#635F69]">
                Pick your current class to curate relevant subject materials.
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {STUDENT_GRADES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={cn(
                      "cursor-pointer rounded-2xl px-3 py-3.5 font-heading text-sm font-extrabold transition-all duration-200",
                      selectedGrade === g
                        ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                        : "bg-[#EFEBF5] text-[#332F3A] shadow-clayPressed hover:-translate-y-0.5"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 border-t border-[#7C3AED]/10 pt-6">
              <label className="font-heading text-xs font-extrabold uppercase tracking-wide text-[#332F3A]">
                Grades you teach
              </label>
              <p className="text-xs text-[#635F69]">
                Select every level you instruct — multiple selections allowed.
              </p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {TEACHER_GRADES.map((g) => {
                  const isChecked = selectedGradesTaught.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleTeacherGrade(g)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-2xl px-3 py-3.5 font-heading text-sm font-extrabold transition-all duration-200",
                        isChecked
                          ? "bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] text-white shadow-clayButton"
                          : "bg-[#EFEBF5] text-[#332F3A] shadow-clayPressed hover:-translate-y-0.5"
                      )}
                    >
                      <span>{g}</span>
                      {isChecked && <Check className="ml-1 size-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[#7C3AED]/10 pt-6 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full gap-2 sm:w-auto"
            >
              <RotateCcw className="size-4" />
              Relaunch walkthrough
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="w-full gap-2 sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#7C3AED]" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
