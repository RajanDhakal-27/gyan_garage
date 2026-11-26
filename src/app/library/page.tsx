"use client";

import React, { Suspense } from "react";
import { ResourceManager } from "@/components/resources/resource-manager";
import { Loader2 } from "lucide-react";

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b border-border/80 pb-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Universal Archive
              </span>
              <span className="text-border">/</span>
              <span className="font-mono text-xs text-muted-foreground">Reference & Syllabi</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
              Learning Library
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-3xl">
              Curated textbooks, lecture notes, video recordings, and study guides cataloged by academic subject and topic.
            </p>
          </div>

          <ResourceManager />
        </div>
      </div>
    </Suspense>
  );
}
