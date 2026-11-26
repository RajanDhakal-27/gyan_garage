"use client";

import React, { useState } from "react";
import { cn } from "cn";

export function SelfDrawingDiagram() {
  const [activeTab, setActiveTab] = useState<"optics" | "geometry">("geometry");

  return (
    <div className="border border-[rgba(20,28,43,0.16)] bg-[#E5DED0] p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[rgba(20,28,43,0.14)] pb-3">
        <div className="space-y-0.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#767E8C]">
            [ FIG. 1.4 — SELF-DRAWING SCHEMATIC ]
          </span>
          <h4 className="font-editorial text-base font-semibold text-[#141C2B]">
            {activeTab === "geometry"
              ? "Pythagorean Theorem & Orthogonal Projection"
              : "Thin Convex Lens & Focal Ray Tracing"}
          </h4>
        </div>

        {/* Interactive toggle */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab("geometry")}
            className={cn(
              "px-2 py-1 border transition-colors cursor-pointer",
              activeTab === "geometry"
                ? "border-[#2C4A8F] bg-[#2C4A8F] text-[#EFE9DD] font-bold"
                : "border-[rgba(20,28,43,0.2)] bg-[#EFE9DD] text-[#141C2B]"
            )}
          >
            Geometry
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("optics")}
            className={cn(
              "px-2 py-1 border transition-colors cursor-pointer",
              activeTab === "optics"
                ? "border-[#2C4A8F] bg-[#2C4A8F] text-[#EFE9DD] font-bold"
                : "border-[rgba(20,28,43,0.2)] bg-[#EFE9DD] text-[#141C2B]"
            )}
          >
            Optics
          </button>
        </div>
      </div>

      {/* SVG Canvas with Stroke Drawing */}
      <div className="relative flex items-center justify-center py-6 bg-[#EFE9DD] border border-[rgba(20,28,43,0.1)] overflow-hidden">
        {activeTab === "geometry" ? (
          <svg
            viewBox="0 0 360 200"
            className="w-full max-w-sm h-48 stroke-[#141C2B] fill-none"
          >
            <style>
              {`
                @keyframes drawPath {
                  from { stroke-dashoffset: 600; }
                  to { stroke-dashoffset: 0; }
                }
                .draw-stroke {
                  stroke-dasharray: 600;
                  animation: drawPath 3.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite alternate;
                }
                .draw-accent {
                  stroke-dasharray: 300;
                  animation: drawPath 2.5s 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite alternate;
                }
              `}
            </style>

            {/* Baseline */}
            <line x1="40" y1="160" x2="320" y2="160" strokeWidth="1" strokeDasharray="3,3" stroke="rgba(20,28,43,0.3)" />

            {/* Right-angled triangle */}
            <polygon
              points="60,160 280,160 280,40"
              strokeWidth="1.5"
              className="draw-stroke"
            />

            {/* Altitude from right angle */}
            <line
              x1="280"
              y1="40"
              x2="160"
              y2="160"
              strokeWidth="1.2"
              stroke="#2C4A8F"
              className="draw-accent"
            />

            {/* Right angle square indicator */}
            <polyline points="268,160 268,148 280,148" strokeWidth="1" stroke="rgba(20,28,43,0.6)" />

            {/* Labels */}
            <text x="50" y="175" className="font-mono text-[10px] fill-[#141C2B]">A</text>
            <text x="285" y="175" className="font-mono text-[10px] fill-[#141C2B]">C</text>
            <text x="285" y="35" className="font-mono text-[10px] fill-[#141C2B]">B</text>
            <text x="155" y="175" className="font-mono text-[10px] fill-[#2C4A8F]">D</text>

            {/* Formula annotation */}
            <text x="70" y="80" className="font-editorial text-xs italic fill-[#2C4A8F]">
              a² + b² = c²
            </text>
          </svg>
        ) : (
          <svg
            viewBox="0 0 360 200"
            className="w-full max-w-sm h-48 stroke-[#141C2B] fill-none"
          >
            <style>
              {`
                @keyframes drawLens {
                  from { stroke-dashoffset: 400; }
                  to { stroke-dashoffset: 0; }
                }
                .lens-stroke {
                  stroke-dasharray: 400;
                  animation: drawLens 3s ease-in-out infinite alternate;
                }
              `}
            </style>

            {/* Principal Axis */}
            <line x1="20" y1="100" x2="340" y2="100" strokeWidth="1" strokeDasharray="3,3" stroke="rgba(20,28,43,0.3)" />

            {/* Convex Lens */}
            <path
              d="M 180,20 Q 200,100 180,180 Q 160,100 180,20"
              strokeWidth="1.5"
              className="lens-stroke"
              stroke="#141C2B"
            />

            {/* Object Arrow */}
            <line x1="80" y1="100" x2="80" y2="40" strokeWidth="1.5" stroke="#141C2B" />
            <polygon points="77,43 83,43 80,36" fill="#141C2B" strokeWidth="0" />

            {/* Parallel Ray -> Focus */}
            <path
              d="M 80,40 L 180,40 L 280,160"
              strokeWidth="1.2"
              stroke="#2C4A8F"
              className="lens-stroke"
            />

            {/* Optical Centre Ray */}
            <line
              x1="80"
              y1="40"
              x2="280"
              y2="160"
              strokeWidth="1.2"
              stroke="#A33A3A"
              strokeDasharray="4,2"
            />

            {/* Focal Point Markers */}
            <circle cx="120" cy="100" r="2" fill="#141C2B" />
            <text x="116" y="115" className="font-mono text-[9px] fill-[#767E8C]">F₁</text>
            <circle cx="240" cy="100" r="2" fill="#141C2B" />
            <text x="236" y="115" className="font-mono text-[9px] fill-[#767E8C]">F₂</text>
          </svg>
        )}
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-[#767E8C]">
        <span>CURRICULUM SPEC: CDC NEPAL CLASS 10</span>
        <span>ACADEMIC VERIFICATION: ACTIVE</span>
      </div>
    </div>
  );
}
