import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/role-context";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gyan Garage | ज्ञान ग्यारेज - Learn. Practice. Progress.",
  description:
    "A unified learning platform for Nepali students and teachers. Access notes, quizzes, homework, and study planner.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <RoleProvider>
          <Suspense fallback={<header className="h-16 border-b bg-background" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Toaster position="top-right" richColors />
        </RoleProvider>
      </body>
    </html>
  );
}
