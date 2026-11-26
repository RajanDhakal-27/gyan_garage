import type { Metadata } from "next";
import { Suspense } from "react";
import { Newsreader, Courier_Prime } from "next/font/google";
import "./globals.css";
import { RoleProvider } from "@/context/role-context";
import { Navbar } from "@/components/layout/navbar";
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog";
import { Toaster } from "@/components/ui/sonner";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gyan Garage | ज्ञान ग्यारेज — Digital Learning Library",
  description:
    "An editorial academic learning platform for Nepali students and teachers. Educational notes, question papers, timed tests, and study productivity tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${courierPrime.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#EFE9DD] text-[#141C2B] font-mono selection:bg-[#2C4A8F] selection:text-[#EFE9DD]">
        <RoleProvider>
          <Suspense fallback={<header className="h-16 border-b border-[rgba(20,28,43,0.16)] bg-[#EFE9DD]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <OnboardingDialog />
          <Toaster position="top-right" richColors />
        </RoleProvider>
      </body>
    </html>
  );
}
