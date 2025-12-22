"use client";

import Link from "next/link";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { useState } from "react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Home", href: "#home" },
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Contact", href: "#contact" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Terms & Conditions", href: "/tos" },
    ],
  },
];

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <footer className="border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-20 md:grid-cols-4">
          {/* <div className="flex flex-wrap items-start justify-between gap-10"> */}
          <div>
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              SparkCV
            </h3>
            <p className="text-muted-foreground">
              AI-powered resume builder helping professionals land their dream
              jobs.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-md mb-4 font-semibold">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="-ml-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {currentYear} SparkCV. All rights reserved.</p>
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <Link
              href="https://github.com/Sri-dinesh/resume-builder-ai"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="GitHub"
              target="_blank"
            >
              <FaGithub />
            </Link>
            <Link
              href="https://x.com/Sridinesh07"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Twitter"
              target="_blank"
            >
              <FaTwitter />
            </Link>
            <Link
              href="https://in.linkedin.com/in/sridinesh07"
              className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="LinkedIn"
              target="_blank"
            >
              <FaLinkedin />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
