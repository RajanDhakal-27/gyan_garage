"use client";

import React, { useEffect, useState } from "react";

export function OversizedWordmark() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset(window.scrollY * 0.05);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative border-t border-[rgba(20,28,43,0.16)] bg-[#E5DED0] pt-12 pb-16 overflow-hidden select-none">
      {/* Editorial footer metadata */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-[#767E8C] uppercase tracking-widest border-b border-[rgba(20,28,43,0.1)] pb-4">
        <span>GYAN GARAGE • ACADEMIC STATIONERY ARCHIVE</span>
        <div className="flex items-center gap-4">
          <span>KATHMANDU, NEPAL</span>
          <span>•</span>
          <span>EDITION NO. 2081/2026</span>
        </div>
      </div>

      {/* Giant Editorial Letters */}
      <div
        className="w-full text-center overflow-hidden transition-transform duration-100 ease-out"
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
      >
        <h2 className="font-editorial text-[14vw] font-bold tracking-tight text-[#141C2B]/15 leading-none whitespace-nowrap">
          GYAN GARAGE
        </h2>
      </div>

      {/* Bottom fine credit */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 text-center mt-6 font-mono text-[11px] text-[#767E8C]">
        “Learn. Practice. Progress.” — Built for students and teachers across Nepal.
      </div>
    </div>
  );
}
