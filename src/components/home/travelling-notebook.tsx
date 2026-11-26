"use client";

import React, { useEffect, useState } from "react";

export function TravellingNotebook() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute smooth scroll-based position and subtle tilt
  const translateY = Math.min(600, scrollY * 0.25);
  const rotation = Math.sin(scrollY * 0.005) * 6;
  const opacity = Math.max(0.4, 0.9 - scrollY * 0.0006);

  return (
    <div
      className="pointer-events-none fixed right-4 top-28 z-20 hidden transition-transform duration-75 ease-out lg:block sm:right-12"
      style={{
        transform: `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg)`,
        opacity,
      }}
      aria-hidden="true"
    >
      <div className="relative w-36 rotate-3 rounded-[26px] border border-white/70 bg-white/80 p-4 shadow-clayCard backdrop-blur-xl sm:w-44">
        {/* Soft violet glow */}
        <div className="absolute -top-6 -right-6 size-20 rounded-full bg-[#A78BFA]/25 blur-2xl" />

        {/* Bookmark ribbon */}
        <div className="absolute -top-3 right-6 h-6 w-3 rounded-b-full bg-gradient-to-b from-[#A78BFA] to-[#7C3AED] shadow-[0_4px_8px_rgba(124,58,237,0.3)]" />

        <div className="relative space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#DB2777]" />
            <span className="size-2 rounded-full bg-[#F59E0B]" />
            <span className="size-2 rounded-full bg-[#10B981]" />
          </div>

          <div className="h-2 w-14 rounded-full bg-[#7C3AED]/40" />
          <div className="h-1.5 w-24 rounded-full bg-[#7C3AED]/15" />
          <div className="h-1.5 w-20 rounded-full bg-[#7C3AED]/15" />
          <div className="h-1.5 w-28 rounded-full bg-[#7C3AED]/10" />

          <div className="py-1">
            <svg
              viewBox="0 0 40 25"
              className="h-10 w-16 fill-none stroke-[#7C3AED] stroke-[1.5]"
            >
              <polygon points="5,20 35,20 20,5" strokeLinejoin="round" />
              <line x1="20" y1="5" x2="20" y2="20" strokeDasharray="2,2" stroke="#0EA5E9" />
              <circle cx="20" cy="5" r="2" className="fill-[#DB2777] stroke-none" />
            </svg>
          </div>

          <div className="border-t border-[#7C3AED]/10 pt-2 font-heading text-[9px] font-extrabold uppercase tracking-widest text-[#635F69]">
            Gyan Garage
          </div>
        </div>
      </div>
    </div>
  );
}
