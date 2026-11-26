"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
