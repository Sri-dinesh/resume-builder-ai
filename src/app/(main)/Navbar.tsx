"use client";

import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/images/CircleLogo.png";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  CreditCard,
  FileText,
  Activity,
  Loader2,
  Mail,
  Zap,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoadingLink(null);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    if (pathname === href) return;
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
  }) => {
    const isActive = pathname === href;
    const isLoading = loadingLink === href;

    return (
      <button
        onClick={() => handleNavigation(href)}
        disabled={isLoading}
        title={title}
        className={cn(
          "group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ease-out",
          "disabled:cursor-not-allowed disabled:opacity-70",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <div
          className={cn(
            "transition-transform duration-300 group-hover:scale-110",
            isActive && "text-primary",
          )}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon}
        </div>
        <span className="hidden md:inline-block">{label}</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            href="/resumes"
            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02] active:scale-95"
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full shadow-sm ring-1 ring-border/50">
              <Image
                src={logo}
                alt="SparkCV Logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="hidden font-sans text-lg font-bold tracking-tight text-foreground sm:inline-block">
              SparkCV
            </span>
          </Link>
        </div>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform sm:flex sm:items-center sm:gap-1">
          <NavLink
            href="/resumes"
            icon={<FileText className="h-4 w-4" />}
            label="Resumes"
            title="My Resumes"
          />
          <NavLink
            href="/score"
            icon={<Activity className="h-4 w-4" />}
            label="ATS Score"
            title="ATS Score"
          />
          <NavLink
            href="/enhance"
            icon={<Zap className="h-4 w-4" />}
            label="Enhance"
            title="Enhance Resume"
          />
          <NavLink
            href="/cover-letter"
            icon={<Mail className="h-4 w-4" />}
            label="Cover Letter"
            title="Cover Letter Generator"
          />
        </nav>

        <nav className="flex items-center gap-1 sm:hidden">
          <NavLink
            href="/resumes"
            icon={<FileText className="h-[18px] w-[18px]" />}
            label="Resumes"
            title="My Resumes"
          />
          <NavLink
            href="/score"
            icon={<Activity className="h-[18px] w-[18px]" />}
            label="ATS Score"
            title="ATS Score"
          />
          <NavLink
            href="/enhance"
            icon={<Zap className="h-[18px] w-[18px]" />}
            label="Enhance"
            title="Enhance Resume"
          />
          <NavLink
            href="/cover-letter"
            icon={<Mail className="h-[18px] w-[18px]" />}
            label="Cover Letter"
            title="Cover Letter Generator"
          />
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:block">{mounted && <ThemeToggle />}</div>

          <div className="hidden h-5 w-px bg-border/50 sm:block" />

          <div className="flex items-center rounded-full ring-2 ring-primary/10 transition-shadow hover:ring-primary/30">
            <UserButton
              appearance={{
                baseTheme: mounted && theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: 32,
                    height: 32,
                  },
                  userButtonTrigger: {
                    "&:focus": {
                      boxShadow: "none",
                    },
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
      </div>
    </header>
  );
}
