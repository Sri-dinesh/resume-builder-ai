"use client";

import { UserButton } from "@clerk/nextjs";
import {
  CreditCard,
  FileText,
  Activity,
  Loader2,
  Mail,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import logo from "@/images/CircleLogo.png";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const NavLink = ({
  icon: Icon,
  label,
  title,
  isActive,
  isLoading,
  onClick,
}: NavLinkProps) => {
  return (
    <button
      onClick={onClick}
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

export default function Navbar() {
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

  return (
    <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            href="/resumes"
            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02] active:scale-95"
          >
            <div className="ring-border/50 relative h-8 w-8 overflow-hidden rounded-full shadow-sm ring-1">
              <Image
                src={logo}
                alt="SparkCV Logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="text-foreground hidden font-sans text-lg font-bold tracking-tight sm:inline-block">
              SparkCV
            </span>
          </Link>
        </div>

        <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform sm:flex sm:items-center sm:gap-1">
          <NavLink
            href="/resumes"
            icon={<FileText className="h-4 w-4" />}
            label="Resumes"
            title="My Resumes"
            isActive={pathname === "/resumes"}
            isLoading={loadingLink === "/resumes"}
            onClick={() => handleNavigation("/resumes")}
          />
          <NavLink
            href="/score"
            icon={<Activity className="h-4 w-4" />}
            label="ATS Score"
            title="ATS Score"
            isActive={pathname === "/score"}
            isLoading={loadingLink === "/score"}
            onClick={() => handleNavigation("/score")}
          />
          <NavLink
            href="/enhance"
            icon={<Zap className="h-4 w-4" />}
            label="Enhance"
            title="Enhance Resume"
            isActive={pathname === "/enhance"}
            isLoading={loadingLink === "/enhance"}
            onClick={() => handleNavigation("/enhance")}
          />
          <NavLink
            href="/cover-letter"
            icon={<Mail className="h-4 w-4" />}
            label="Cover Letter"
            title="Cover Letter Generator"
            isActive={pathname === "/cover-letter"}
            isLoading={loadingLink === "/cover-letter"}
            onClick={() => handleNavigation("/cover-letter")}
          />
        </nav>

        <nav className="flex items-center gap-1 sm:hidden">
          <NavLink
            href="/resumes"
            icon={<FileText className="h-[18px] w-[18px]" />}
            label="Resumes"
            title="My Resumes"
            isActive={pathname === "/resumes"}
            isLoading={loadingLink === "/resumes"}
            onClick={() => handleNavigation("/resumes")}
          />
          <NavLink
            href="/score"
            icon={<Activity className="h-[18px] w-[18px]" />}
            label="ATS Score"
            title="ATS Score"
            isActive={pathname === "/score"}
            isLoading={loadingLink === "/score"}
            onClick={() => handleNavigation("/score")}
          />
          <NavLink
            href="/enhance"
            icon={<Zap className="h-[18px] w-[18px]" />}
            label="Enhance"
            title="Enhance Resume"
            isActive={pathname === "/enhance"}
            isLoading={loadingLink === "/enhance"}
            onClick={() => handleNavigation("/enhance")}
          />
          <NavLink
            href="/cover-letter"
            icon={<Mail className="h-[18px] w-[18px]" />}
            label="Cover Letter"
            title="Cover Letter Generator"
            isActive={pathname === "/cover-letter"}
            isLoading={loadingLink === "/cover-letter"}
            onClick={() => handleNavigation("/cover-letter")}
          />
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:block">{mounted && <ThemeToggle />}</div>

          <div className="bg-border/50 hidden h-5 w-px sm:block" />

          <div className="ring-primary/10 hover:ring-primary/30 flex items-center rounded-full ring-2 transition-shadow">
            <UserButton
              appearance={{
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
