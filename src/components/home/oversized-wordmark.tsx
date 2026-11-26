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
    <div className="relative select-none overflow-hidden pt-12 pb-16">
      <div className="mx-auto mb-8 flex w-full max-w-7xl flex-col justify-between gap-4 border-b border-[#7C3AED]/10 px-4 pb-4 text-xs text-[#635F69] sm:flex-row sm:items-center sm:px-6">
        <span className="font-heading font-extrabold tracking-wide">
          Gyan Garage · Academic Library
        </span>
        <div className="flex items-center gap-4">
          <span>Kathmandu, Nepal</span>
          <span className="size-1.5 rounded-full bg-[#7C3AED]/40" />
          <span>Edition 2081/2026</span>
        </div>
      </div>

      <div
        className="w-full overflow-hidden text-center transition-transform duration-100 ease-out"
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
      >
        <h2 className="clay-text-gradient whitespace-nowrap px-4 font-heading text-[14vw] leading-none font-black tracking-tighter opacity-90">
          GYAN GARAGE
        </h2>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 text-center text-xs text-[#635F69] sm:px-6">
        “Learn. Practice. Progress.” — Built for students and teachers across
        Nepal.
      </div>
    </div>
  );
}
