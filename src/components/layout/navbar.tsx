"use client";

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
  UserCheck,
  School,
  Sparkles,
} from "lucide-react";
import { cn } from "cn";

export function Navbar() {
  const pathname = usePathname();
  const { role, setRole, isTeacher } = useRole();

  const navLinks = [
    {
      name: "Resources",
      href: "/",
      icon: BookOpen,
      active: pathname === "/" || pathname === "/resources",
    },
    {
      name: "Homework",
      href: "/homework",
      icon: FileCheck2,
      active: pathname === "/homework",
      badge: "Task 02",
    },
    {
      name: "Quizzes",
      href: "/quizzes",
      icon: GraduationCap,
      active: pathname === "/quizzes",
      badge: "Task 03/04",
    },
    {
      name: "Study Planner",
      href: "/planner",
      icon: ListTodo,
      active: pathname === "/planner",
      badge: "Task 05",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <School className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-foreground text-base sm:text-lg">
                Gyan Garage
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                (ज्ञान ग्यारेज)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Learn. Practice. Progress.
            </p>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                <span>{item.name}</span>
                {item.badge && !item.active && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Single-user Role Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border bg-muted/40 p-1 text-xs">
            <Button
              variant={!isTeacher ? "default" : "ghost"}
              size="sm"
              onClick={() => setRole("student")}
              className={cn(
                "h-7 text-xs gap-1.5 transition-all",
                !isTeacher ? "shadow-xs" : "text-muted-foreground"
              )}
            >
              <GraduationCap className="size-3.5" />
              <span>Student View</span>
            </Button>
            <Button
              variant={isTeacher ? "default" : "ghost"}
              size="sm"
              onClick={() => setRole("teacher")}
              className={cn(
                "h-7 text-xs gap-1.5 transition-all",
                isTeacher ? "shadow-xs" : "text-muted-foreground"
              )}
            >
              <UserCheck className="size-3.5" />
              <span>Teacher View</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
