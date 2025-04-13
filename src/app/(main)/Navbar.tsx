"use client";

import favicon from "@/images/favicon.svg";
import ThemeToggle from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CreditCard, FileText, Lightbulb, WandSparkles } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={favicon}
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full"
          />
          <span className="text-xl font-bold tracking-tight">
            AI Resume Builder
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          {/* Resumes Link */}
          <Link
            href="/resumes"
            title="Resumes"
            className="flex items-center gap-1.5 rounded-full bg-primary/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] sm:flex sm:gap-1.5 md:gap-2 lg:gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Resumes</span>
          </Link>

          {/* Score Link */}
          <Link
            href="/score"
            title="Score Resume"
            className="flex items-center gap-1.5 rounded-full bg-primary/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] sm:flex sm:gap-1.5 md:gap-2 lg:gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Score Resume</span>
          </Link>

          {/* Enhance Link */}
          <Link
            href="/enhance"
            title="Enhance Resume"
            className="flex items-center gap-1.5 rounded-full bg-primary/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] sm:flex sm:gap-1.5 md:gap-2 lg:gap-2"
          >
            <WandSparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Enhance Resume</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Button */}
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
}
