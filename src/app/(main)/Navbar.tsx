"use client";

import favicon from "@/images/favicon.svg";
import ThemeToggle from "@/components/ThemeToggle";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CreditCard, FileText, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
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
        <div className="flex items-center gap-3">
          <Link
            href="/resumes"
            title="Resumes"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/70 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          >
            <FileText className="h-5 w-5 text-white" />
          </Link>
          <Link
            href="/score"
            title="Score Resume"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/70 backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          >
            <TrendingUp className="h-5 w-5 text-white" />
          </Link>
          <ThemeToggle />
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
