"use client";

import React, { useState } from "react";
import { cn } from "cn";

export function SelfDrawingDiagram() {
  const [activeTab, setActiveTab] = useState<"optics" | "geometry">("geometry");

  return (
    <div className="space-y-4 rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-clayCard backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-[#7C3AED]/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <span className="font-heading text-[10px] font-extrabold uppercase tracking-widest text-[#635F69]">
            Live schematic
          </span>
          <h4 className="font-heading text-base leading-snug font-extrabold text-[#332F3A]">
            {activeTab === "geometry"
              ? "Pythagorean Theorem & Orthogonal Projection"
              : "Thin Convex Lens & Focal Ray Tracing"}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-[#EFEBF5] p-1 shadow-clayPressed">
          {(["geometry", "optics"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "cursor-pointer rounded-full px-3.5 py-2 font-heading text-[11px] font-extrabold capitalize tracking-wide transition-all duration-200",
                activeTab === tab
                  ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                  : "text-[#635F69] hover:text-[#332F3A]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-center overflow-hidden rounded-[24px] border border-white/60 bg-[#EFEBF5] py-6 shadow-clayPressed">
        <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-[#A78BFA]/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 size-32 rounded-full bg-[#0EA5E9]/20 blur-2xl" />

        {activeTab === "geometry" ? (
          <svg
            viewBox="0 0 360 200"
            className="relative h-48 w-full max-w-sm fill-none stroke-[#7C3AED]"
          >
            <style>
              {`
                @keyframes clayDrawPath {
                  from { stroke-dashoffset: 600; }
                  to { stroke-dashoffset: 0; }
                }
                @keyframes clayDrawAccent {
                  from { stroke-dashoffset: 300; }
                  to { stroke-dashoffset: 0; }
                }
                .clay-draw-stroke {
                  stroke-dasharray: 600;
                  animation: clayDrawPath 3.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite alternate;
                }
                .clay-draw-accent {
                  stroke-dasharray: 300;
                  animation: clayDrawAccent 2.5s 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite alternate;
                }
              `}
            </style>

            <line
              x1="40"
              y1="160"
              x2="320"
              y2="160"
              strokeWidth="1.5"
              strokeDasharray="4,5"
              stroke="rgba(99,95,105,0.35)"
            />

            <polygon
              points="60,160 280,160 280,40"
              strokeWidth="3"
              strokeLinejoin="round"
              className="clay-draw-stroke"
            />

            <line
              x1="280"
              y1="40"
              x2="160"
              y2="160"
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="#0EA5E9"
              className="clay-draw-accent"
            />

            <polyline
              points="268,160 268,148 280,148"
              strokeWidth="1.5"
              stroke="rgba(99,95,105,0.6)"
            />

            <text x="46" y="177" className="fill-[#332F3A] font-heading text-[11px] font-extrabold">A</text>
            <text x="287" y="177" className="fill-[#332F3A] font-heading text-[11px] font-extrabold">C</text>
            <text x="287" y="35" className="fill-[#332F3A] font-heading text-[11px] font-extrabold">B</text>
            <text x="153" y="177" className="fill-[#0EA5E9] font-heading text-[11px] font-extrabold">D</text>

            <text x="70" y="82" className="fill-[#DB2777] font-heading text-[13px] font-extrabold">
              a² + b² = c²
            </text>
          </svg>
        ) : (
          <svg
            viewBox="0 0 360 200"
            className="relative h-48 w-full max-w-sm fill-none stroke-[#7C3AED]"
          >
            <style>
              {`
                @keyframes clayDrawLens {
                  from { stroke-dashoffset: 400; }
                  to { stroke-dashoffset: 0; }
                }
                .clay-lens-stroke {
                  stroke-dasharray: 400;
                  animation: clayDrawLens 3s ease-in-out infinite alternate;
                }
              `}
            </style>

            <line
              x1="20"
              y1="100"
              x2="340"
              y2="100"
              strokeWidth="1.5"
              strokeDasharray="4,5"
              stroke="rgba(99,95,105,0.35)"
            />

            <path
              d="M 180,20 Q 200,100 180,180 Q 160,100 180,20"
              strokeWidth="3"
              stroke="#7C3AED"
              strokeLinecap="round"
              className="clay-lens-stroke"
            />

            <line x1="80" y1="100" x2="80" y2="40" strokeWidth="3" stroke="#332F3A" strokeLinecap="round" />
            <polygon points="76,44 84,44 80,34" fill="#332F3A" strokeWidth="0" />

            <path
              d="M 80,40 L 180,40 L 280,160"
              strokeWidth="2.5"
              stroke="#0EA5E9"
              strokeLinejoin="round"
              className="clay-lens-stroke"
            />

            <line
              x1="80"
              y1="40"
              x2="280"
              y2="160"
              strokeWidth="2"
              stroke="#DB2777"
              strokeDasharray="5,4"
              strokeLinecap="round"
            />

            <circle cx="120" cy="100" r="3" fill="#10B981" />
            <text x="114" y="117" className="fill-[#635F69] font-heading text-[10px] font-extrabold">F₁</text>
            <circle cx="240" cy="100" r="3" fill="#10B981" />
            <text x="234" y="117" className="fill-[#635F69] font-heading text-[10px] font-extrabold">F₂</text>
          </svg>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-medium text-[#635F69]">
        <span>CDC Nepal · Grade 10</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/10 px-3 py-1 font-heading font-extrabold text-[#10B981]">
          <span className="size-1.5 rounded-full bg-[#10B981]" />
          Verified
        </span>
      </div>
    </div>
  );
}
