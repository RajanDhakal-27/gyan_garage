"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRole, UserRole } from "@/context/role-context";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  User,
  GraduationCap,
  School,
  Sparkles,
  RotateCcw,
  Check,
  Save,
  BookOpen,
  ArrowRight,
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
    setRole,
    grade,
    setGrade,
    gradesTaught,
    setGradesTaught,
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
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Profile Header */}
        <div className="border-b border-border/80 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
              Academic Dossier
            </span>
            <span className="text-border">/</span>
            <span className="font-mono text-xs text-muted-foreground">Settings & Preferences</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
            Profile & Role Configuration
          </h1>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground">
            Switch your active academic role, revise enrolled grade levels, and customize your scholar identity.
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="border border-border/80 bg-card p-6 sm:p-10 space-y-8 shadow-sm">
          {/* Identity Name */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
              Display Name / Scholar Handle
            </label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Suman Sharma"
              className="font-mono text-xs bg-background max-w-md"
            />
            <p className="font-mono text-[11px] text-muted-foreground">
              Used across test score cards, study planner ledger, and dashboard greetings.
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <label className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
              Primary Role in Gyan Garage
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={cn(
                  "p-5 text-left border transition-all flex flex-col justify-between space-y-3",
                  selectedRole === "student"
                    ? "border-primary bg-secondary/50 text-foreground ring-1 ring-primary"
                    : "border-border/80 bg-background text-muted-foreground hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <GraduationCap className={cn("size-6", selectedRole === "student" ? "text-primary" : "text-muted-foreground")} />
                  {selectedRole === "student" && <Check className="size-4 text-primary" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-foreground">Student / Scholar</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    Study curriculum materials, solve past question papers, take timed quizzes, and track daily goals.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("teacher")}
                className={cn(
                  "p-5 text-left border transition-all flex flex-col justify-between space-y-3",
                  selectedRole === "teacher"
                    ? "border-primary bg-secondary/50 text-foreground ring-1 ring-primary"
                    : "border-border/80 bg-background text-muted-foreground hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <School className={cn("size-6", selectedRole === "teacher" ? "text-primary" : "text-muted-foreground")} />
                  {selectedRole === "teacher" && <Check className="size-4 text-primary" />}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-foreground">Teacher / Educator</h3>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    Publish learning resources, assign homework problem sets, author quizzes, and archive question papers.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Grade Configuration based on Role */}
          {selectedRole === "student" ? (
            <div className="space-y-3 pt-4 border-t border-border/60">
              <label className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
                Enrolled Grade Level
              </label>
              <p className="font-mono text-xs text-muted-foreground">
                Select your current class to curate relevant subject materials:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STUDENT_GRADES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g)}
                    className={cn(
                      "p-3 text-center border font-mono text-xs transition-colors",
                      selectedGrade === g
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-background text-foreground border-border/80 hover:border-primary/50"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-4 border-t border-border/60">
              <label className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
                Grades You Teach (Multiple Selection)
              </label>
              <p className="font-mono text-xs text-muted-foreground">
                Select all secondary and higher secondary levels you instruct:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TEACHER_GRADES.map((g) => {
                  const isChecked = selectedGradesTaught.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleTeacherGrade(g)}
                      className={cn(
                        "p-3 text-center border font-mono text-xs transition-colors flex items-center justify-between",
                        isChecked
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-background text-foreground border-border/80 hover:border-primary/50"
                      )}
                    >
                      <span>{g}</span>
                      {isChecked && <Check className="size-3.5 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingOpen(true)}
              className="font-mono text-xs gap-1.5 w-full sm:w-auto"
            >
              <RotateCcw className="size-3.5" />
              Relaunch Onboarding Walkthrough
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="font-mono text-xs gap-1.5 w-full sm:w-auto"
            >
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save Profile Changes
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
