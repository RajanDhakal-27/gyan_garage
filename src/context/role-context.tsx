"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "student" | "teacher";

export interface UserProfile {
  role: UserRole;
  grade?: string; // For students (e.g., 'Grade 10')
  gradesTaught?: string[]; // For teachers (e.g., ['Grade 9', 'Grade 10'])
  name?: string;
  onboardingCompleted: boolean;
}

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  grade: string;
  setGrade: (grade: string) => void;
  gradesTaught: string[];
  setGradesTaught: (grades: string[]) => void;
  isTeacher: boolean;
  isStudent: boolean;
  profile: UserProfile;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (data: {
    role: UserRole;
    grade?: string;
    gradesTaught?: string[];
    name?: string;
  }) => void;
  resetOnboarding: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  role: "student",
  grade: "Grade 10",
  gradesTaught: ["Grade 9", "Grade 10", "Grade 11"],
  name: "Scholar",
  onboardingCompleted: false,
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gyan_garage_profile");
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setProfile(parsed);
        if (!parsed.onboardingCompleted) {
          setIsOnboardingOpen(true);
        }
      } else {
        // First visit: trigger onboarding dialog
        setIsOnboardingOpen(true);
      }
    } catch {
      setIsOnboardingOpen(true);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveProfile = useCallback((updated: UserProfile) => {
    setProfile(updated);
    localStorage.setItem("gyan_garage_profile", JSON.stringify(updated));
    localStorage.setItem("gyan_garage_role", updated.role);
  }, []);

  const setRole = (role: UserRole) => {
    saveProfile({ ...profile, role });
  };

  const setGrade = (grade: string) => {
    saveProfile({ ...profile, grade });
  };

  const setGradesTaught = (gradesTaught: string[]) => {
    saveProfile({ ...profile, gradesTaught });
  };

  const completeOnboarding = (data: {
    role: UserRole;
    grade?: string;
    gradesTaught?: string[];
    name?: string;
  }) => {
    const updated: UserProfile = {
      role: data.role,
      grade: data.grade || (data.role === "student" ? "Grade 10" : undefined),
      gradesTaught: data.gradesTaught || (data.role === "teacher" ? ["Grade 9", "Grade 10"] : undefined),
      name: data.name || profile.name || (data.role === "teacher" ? "Guru / Instructor" : "Scholar"),
      onboardingCompleted: true,
    };
    saveProfile(updated);
    setIsOnboardingOpen(false);
  };

  const resetOnboarding = () => {
    setIsOnboardingOpen(true);
  };

  return (
    <RoleContext.Provider
      value={{
        role: profile.role,
        setRole,
        grade: profile.grade || "Grade 10",
        setGrade,
        gradesTaught: profile.gradesTaught || ["Grade 9", "Grade 10"],
        setGradesTaught,
        isTeacher: profile.role === "teacher",
        isStudent: profile.role === "student",
        profile,
        isOnboardingOpen,
        setIsOnboardingOpen,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
