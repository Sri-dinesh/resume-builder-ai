"use client";

import logo from "@/images/CircleLogo.png";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  CreditCard,
  FileText,
  Lightbulb,
  WandSparkles,
  Mail,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [loadingLink, setLoadingLink] = useState<string | null>(null);

  useEffect(() => {
    setLoadingLink(null);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    setLoadingLink(href);
    router.push(href);
  };

  const NavLink = ({
    href,
    icon: Icon,
    label,
    title,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    title: string;
  }) => (
    <button
      onClick={() => handleNavigation(href)}
      disabled={loadingLink !== null}
      title={title}
      className="flex items-center gap-1.5 rounded-sm bg-primary/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:shadow-[0_0_10px_rgba(0,0,0,0.3)] disabled:cursor-not-allowed disabled:opacity-70 sm:flex sm:gap-1.5 md:gap-2 lg:gap-2"
    >
      {loadingLink === href ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="hidden sm:inline">Loading...</span>
        </>
      ) : (
        <>
          {Icon}
          <span className="hidden sm:inline">{label}</span>
        </>
      )}
    </button>
  );

  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
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
          <NavLink
            href="/resumes"
            icon={<FileText className="h-4 w-4" />}
            label="Resumes"
            title="Resumes"
          />

          {/* Score Link */}
          <NavLink
            href="/score"
            icon={<Lightbulb className="h-4 w-4" />}
            label="Score Resume"
            title="Score Resume"
          />

          {/* Enhance Link */}
          <NavLink
            href="/enhance"
            icon={<WandSparkles className="h-4 w-4" />}
            label="Enhance Resume"
            title="Enhance Resume"
          />

          {/* Cover Letter Link */}
          <NavLink
            href="/cover-letter"
            icon={<Mail className="h-4 w-4" />}
            label="Cover Letter"
            title="Cover Letter Generator"
          />

          {/* Theme Toggle */}
          {/* <ThemeToggle /> */}

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
