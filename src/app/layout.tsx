import type { Metadata } from "next";
import { Suspense } from "react";
import { Nunito, DM_Sans } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/role-context";
import { Navbar } from "@/components/layout/navbar";
import { ClayBackground } from "@/components/layout/clay-background";
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Gyan Garage | ज्ञान ग्यारेज — Digital Learning Library",
  description:
    "A soft, playful learning platform for Nepali students and teachers. Educational notes, question papers, timed tests, and study productivity tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F4F1FA] text-[#332F3A] font-sans selection:bg-[#7C3AED]/20 selection:text-[#332F3A]">
        <ClayBackground />
        <RoleProvider>
          <Suspense
            fallback={
              <header className="h-20 bg-transparent" aria-hidden="true" />
            }
          >
            <Navbar />
          </Suspense>
          <main className="relative flex-1">{children}</main>
          <OnboardingDialog />
          <Toaster position="top-right" richColors />
        </RoleProvider>
      </body>
    </html>
  );
}
