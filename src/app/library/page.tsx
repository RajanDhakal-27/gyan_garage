"use client";

import React, { Suspense } from "react";
import { ResourceManager } from "@/components/resources/resource-manager";
import { Loader2 } from "lucide-react";

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#7C3AED]" />
        </div>
      }
    >
      <div className="min-h-screen py-8 sm:py-10">
        <ResourceManager />
      </div>
    </Suspense>
  );
}
