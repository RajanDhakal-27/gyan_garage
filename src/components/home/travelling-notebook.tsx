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
      className="pointer-events-none fixed right-4 sm:right-12 top-28 z-20 hidden md:block transition-transform duration-75 ease-out"
      style={{
        transform: `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg)`,
        opacity,
      }}
      aria-hidden="true"
    >
      <div className="relative border border-[#141C2B] bg-[#E5DED0] p-4 shadow-md w-36 sm:w-44">
        {/* Notebook binding / bookmark line */}
        <div className="absolute top-0 bottom-0 left-2 w-[1px] bg-[rgba(20,28,43,0.3)]" />
        <div className="absolute -top-3 right-6 w-3 h-5 bg-[#2C4A8F] border border-[#141C2B]" />

        {/* Notebook content sketch */}
        <div className="pl-3 space-y-2">
          <div className="h-1.5 w-12 bg-[#2C4A8F]/40" />
          <div className="h-1 w-24 bg-[rgba(20,28,43,0.2)]" />
          <div className="h-1 w-20 bg-[rgba(20,28,43,0.2)]" />
          <div className="h-1 w-28 bg-[rgba(20,28,43,0.15)]" />

          {/* Miniature geometric sketch */}
          <div className="py-1">
            <svg viewBox="0 0 40 25" className="w-16 h-10 stroke-[#141C2B] fill-none stroke-[0.75]">
              <polygon points="5,20 35,20 20,5" />
              <line x1="20" y1="5" x2="20" y2="20" strokeDasharray="1,1" />
              <circle cx="20" cy="5" r="1.5" className="fill-[#2C4A8F]" />
            </svg>
          </div>

          <div className="border-t border-[rgba(20,28,43,0.15)] pt-1 text-[8px] font-mono uppercase tracking-widest text-[#767E8C]">
            G.G. VOL. 01
          </div>
        </div>
      </div>
    </div>
  );
}
