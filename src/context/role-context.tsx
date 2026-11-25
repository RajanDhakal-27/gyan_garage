"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "student" | "teacher";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isTeacher: boolean;
  isStudent: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("student");

  useEffect(() => {
    const saved = localStorage.getItem("gyan_garage_role") as UserRole | null;
    if (saved === "student" || saved === "teacher") {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("gyan_garage_role", newRole);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isTeacher: role === "teacher",
        isStudent: role === "student",
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
