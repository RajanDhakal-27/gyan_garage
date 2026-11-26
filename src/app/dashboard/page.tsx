"use client";

import React, { Suspense } from "react";
import { useRole } from "@/context/role-context";
import StudentDashboard from "./student/page";
import TeacherDashboard from "./teacher/page";
import { Loader2 } from "lucide-react";

function DashboardContent() {
  const { role } = useRole();

  if (role === "teacher") {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#7C3AED]" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
