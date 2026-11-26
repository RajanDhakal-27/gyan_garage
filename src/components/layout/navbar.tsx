"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/role-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileCheck2,
  GraduationCap,
  ListTodo,
  FileText,
  User,
  LayoutDashboard,
  Menu,
  X,
  Compass,
  ArrowRight,
} from "lucide-react";
import { cn } from "cn";

export function Navbar() {
  const pathname = usePathname();
  const { role, setRole, grade, gradesTaught, isTeacher } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const studentLinks = [
    { name: "Home", href: "/", icon: Compass, active: pathname === "/" },
    {
      name: "Dashboard",
      href: "/dashboard/student",
      icon: LayoutDashboard,
      active: pathname.startsWith("/dashboard"),
    },
    {
      name: "Learning Library",
      href: "/library",
      icon: BookOpen,
      active: pathname === "/library" || pathname === "/resources",
    },
    {
      name: "Question Papers",
      href: "/question-papers",
      icon: FileText,
      active: pathname === "/question-papers",
    },
    {
      name: "Practice & Quiz",
      href: "/quizzes",
      icon: GraduationCap,
      active: pathname.startsWith("/quizzes"),
    },
    {
      name: "Study Tools",
      href: "/tools",
      icon: ListTodo,
      active: pathname === "/tools" || pathname === "/planner",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  const teacherLinks = [
    { name: "Home", href: "/", icon: Compass, active: pathname === "/" },
    {
      name: "Dashboard",
      href: "/dashboard/teacher",
      icon: LayoutDashboard,
      active: pathname.startsWith("/dashboard"),
    },
    {
      name: "Teaching Resources",
      href: "/library",
      icon: BookOpen,
      active: pathname === "/library" || pathname === "/resources",
    },
    {
      name: "Homework",
      href: "/homework",
      icon: FileCheck2,
      active: pathname === "/homework",
    },
    {
      name: "Quizzes",
      href: "/quizzes",
      icon: GraduationCap,
      active: pathname.startsWith("/quizzes"),
    },
    {
      name: "Question Papers",
      href: "/question-papers",
      icon: FileText,
      active: pathname === "/question-papers",
    },
    {
      name: "Study Tools",
      href: "/tools",
      icon: ListTodo,
      active: pathname === "/tools" || pathname === "/planner",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  const currentLinks = isTeacher ? teacherLinks : studentLinks;

  const toggleRole = () => {
    setRole(isTeacher ? "student" : "teacher");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(20,28,43,0.16)] bg-[#EFE9DD]/95 backdrop-blur-xs">
      {/* Top micro metadata bar */}
      <div className="hidden sm:flex h-6 items-center justify-between border-b border-[rgba(20,28,43,0.1)] px-6 font-mono text-[10px] text-[#767E8C] uppercase tracking-widest">
        <span>GYAN GARAGE • EDITORIAL LEARNING ARCHIVE</span>
        <div className="flex items-center gap-4">
          <span>KATHMANDU, NEPAL</span>
          <span>•</span>
          <span className="text-[#2C4A8F] font-semibold">
            {isTeacher ? `EDUCATOR DESK (${gradesTaught.length} GRADES)` : `STUDENT DESK (${grade})`}
          </span>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-9 items-center justify-center border border-[#141C2B] bg-[#141C2B] text-[#EFE9DD] font-editorial text-lg font-bold transition-transform group-hover:-translate-y-0.5">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-xl font-bold tracking-tight text-[#141C2B]">
                GYAN GARAGE
              </span>
              <span className="font-mono text-[10px] text-[#767E8C] hidden md:inline">
                [ज्ञान ग्यारेज]
              </span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#4A5364] hidden sm:block">
              Learn. Practice. Progress.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
          {currentLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-2.5 py-1.5 transition-colors border-b-2",
                item.active
                  ? "border-[#2C4A8F] text-[#2C4A8F] font-bold bg-[#E5DED0]/60"
                  : "border-transparent text-[#4A5364] hover:text-[#141C2B] hover:bg-[#E5DED0]/40"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Action: Role Switcher & Profile Quick Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Toggle Button */}
          <button
            type="button"
            onClick={toggleRole}
            className="flex items-center gap-1.5 border border-[rgba(20,28,43,0.2)] bg-[#E5DED0] px-2.5 py-1 font-mono text-[11px] text-[#141C2B] hover:border-[#2C4A8F] transition-colors cursor-pointer"
            title="Click to switch between Student and Teacher workspace"
          >
            <span className="text-[10px] uppercase text-[#767E8C]">ROLE:</span>
            <span className="font-bold text-[#2C4A8F] uppercase">
              {isTeacher ? "Teacher" : "Student"}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex size-9 items-center justify-center border border-[rgba(20,28,43,0.2)] bg-[#EFE9DD] text-[#141C2B]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[rgba(20,28,43,0.16)] bg-[#EFE9DD] px-4 py-4 space-y-2">
          <div className="p-2 border-b border-[rgba(20,28,43,0.12)] font-mono text-[10px] text-[#767E8C] uppercase tracking-wider">
            {isTeacher ? "Teacher Navigation" : "Student Navigation"}
          </div>

          <div className="grid grid-cols-1 gap-1 font-mono text-xs">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-2.5 border transition-colors",
                    item.active
                      ? "border-[#2C4A8F] bg-[#2C4A8F] text-[#EFE9DD] font-bold"
                      : "border-[rgba(20,28,43,0.12)] bg-[#E5DED0]/40 text-[#141C2B] hover:bg-[#E5DED0]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4" />
                    <span>{item.name}</span>
                  </div>
                  <ArrowRight className="size-3.5 opacity-60" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[rgba(20,28,43,0.12)] flex items-center justify-between">
            <span className="font-mono text-xs text-[#767E8C]">Active View:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toggleRole();
                setMobileMenuOpen(false);
              }}
              className="text-xs"
            >
              Switch to {isTeacher ? "Student" : "Teacher"} View
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
