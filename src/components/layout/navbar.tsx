"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/role-context";
import { Button } from "@/components/ui/button";
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
  const { setRole, grade, gradesTaught, isTeacher } = useRole();
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
      name: "Library",
      href: "/library",
      icon: BookOpen,
      active: pathname === "/library" || pathname === "/resources",
    },
    {
      name: "Papers",
      href: "/question-papers",
      icon: FileText,
      active: pathname === "/question-papers",
    },
    {
      name: "Quiz",
      href: "/quizzes",
      icon: GraduationCap,
      active: pathname.startsWith("/quizzes"),
    },
    {
      name: "Tools",
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
      name: "Resources",
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
      name: "Papers",
      href: "/question-papers",
      icon: FileText,
      active: pathname === "/question-papers",
    },
    {
      name: "Tools",
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

  const roleLabel = isTeacher ? "Teacher" : "Student";
  const contextLabel = isTeacher
    ? `${gradesTaught.length} grade${gradesTaught.length === 1 ? "" : "s"}`
    : grade;

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto w-full max-w-7xl rounded-[28px] border border-white/70 bg-white/70 px-3 shadow-clayCard backdrop-blur-2xl sm:px-5">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] font-heading text-xl font-black text-white shadow-clayButton transition-transform duration-200 group-hover:-translate-y-0.5">
              G
            </div>
            <div className="leading-tight">
              <span className="block font-heading text-lg font-black tracking-tight text-[#332F3A] sm:text-xl">
                Gyan Garage
              </span>
              <span className="hidden text-[11px] font-medium text-[#635F69] sm:block">
                Learn. Practice. Progress.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {currentLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2.5 font-heading text-[13px] font-extrabold tracking-tight transition-all duration-200 xl:px-4",
                  item.active
                    ? "bg-[#7C3AED]/10 text-[#7C3AED] shadow-clayPressed"
                    : "text-[#635F69] hover:-translate-y-0.5 hover:bg-[#EFEBF5] hover:text-[#332F3A]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleRole}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-[#EFEBF5] py-2 pr-3.5 pl-2.5 text-xs shadow-clayPressed transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.96]"
              title="Switch between Student and Teacher workspace"
            >
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  isTeacher ? "bg-[#0EA5E9]" : "bg-[#10B981]"
                )}
              />
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#332F3A]">
                  {roleLabel}
                </span>
                <span className="text-[10px] text-[#635F69]">{contextLabel}</span>
              </span>
              <span className="font-heading text-[11px] font-extrabold uppercase tracking-wide text-[#332F3A] sm:hidden">
                {roleLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex size-11 items-center justify-center rounded-2xl border border-white/60 bg-[#EFEBF5] text-[#332F3A] shadow-clayPressed transition-all duration-200 hover:bg-white/80 active:scale-[0.94] lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 w-full max-w-7xl rounded-[28px] border border-white/70 bg-white/85 p-3 shadow-clayDeep backdrop-blur-2xl lg:hidden">
          <div className="px-3 pt-1 pb-3 font-heading text-[11px] font-extrabold uppercase tracking-wider text-[#635F69]">
            {isTeacher ? "Teacher navigation" : "Student navigation"}
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl p-3 transition-all duration-200",
                    item.active
                      ? "bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] text-white shadow-clayButton"
                      : "text-[#332F3A] hover:bg-[#EFEBF5] active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5" />
                    <span className="font-heading text-sm font-bold">
                      {item.name}
                    </span>
                  </div>
                  <ArrowRight className="size-4 opacity-60" />
                </Link>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#7C3AED]/10 px-2 pt-3">
            <span className="text-xs text-[#635F69]">
              Viewing as{" "}
              <span className="font-heading font-extrabold text-[#332F3A]">
                {roleLabel}
              </span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toggleRole();
                setMobileMenuOpen(false);
              }}
            >
              Switch to {isTeacher ? "Student" : "Teacher"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
