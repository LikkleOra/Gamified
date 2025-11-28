import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gamified - Habit Tracker & Pomodoro Timer",
  description: "Level up your productivity with gamified habits, Pomodoro sessions, and earn XP as you build better routines.",
  keywords: ["habit tracker", "pomodoro", "productivity", "gamification", "habits"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <header className="border-b">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Gamified</h1>
                <div className="flex items-center gap-4">
                  <SignedOut>
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard" />
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard" />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
