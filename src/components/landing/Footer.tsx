"use client";

import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

export const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/tos" },
      { label: "Terms of Service", href: "/tos" },
      { label: "Cookie Policy", href: "/tos" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/srixdevv", label: "Twitter" },
    {
      icon: Github,
      href: "https://github.com/Sri-dinesh/resume-builder-ai",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://in.linkedin.com/in/sridinesh07",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="w-full py-6 lg:py-8">
      <div className="relative mx-auto w-[98%] max-w-[1800px] overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl dark:bg-card/20">
        <div className="pointer-events-none absolute -bottom-10 left-0 w-full select-none overflow-hidden leading-none">
          <span className="block text-center font-[Oswald] font-serif text-[14vw] font-bold tracking-tighter text-foreground/[0.03] dark:text-foreground/[0.05]">
            SparkCV
          </span>
        </div>

        <div className="relative z-10 px-8 py-12 md:px-16 lg:px-24 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2000 2000"
                    className="h-10 w-10"
                  >
                    <g fill="#167ffc">
                      <g id="Layer_1" fill="#167ffc">
                        <g fill="#167ffc">
                          <path
                            d="M1112,449.4c14.8,2.8,29.6,2.6,44.8,1.8,33.9-2,68.1-2.2,102.2-2.4,6.9,0,14.6,2.2,20.3,5.9,6.3,4.1,10.1,7.5,18.4,3.4,9.5-4.5,18.7,2.6,26.1,7.9,19.9,14.2,40.7,27.8,52.5,50.7,1.8,3.4,5.1,5.9,7.9,8.7,3.7,6.5-2.2,11.6-2.4,17.4,0-.4,0,1.4,0,1.4,0,0,.8-.8.8-1.2,3.2-4.9,7.1-6.1,12.2-4.1,17,29.6,30.6,60.8,41.1,93.6,11.1,34.9,17.4,70.9,25.5,106.6,3.2,14,3.6,28.6,10.7,41.4,2.2,3.9,3.4,9.3,3.4,13.8-.4,48.2,14.4,94.1,21.3,141.1,4.3,29.4,9.7,59.2,16.4,88.6,7.9,34.3,4.9,69.7,10.1,104.2,3.6,23.3,3.4,47.4,4.7,71.1-11.2,11.6,0,25.9-4.3,38.3h0c-4.7,3.7-.4,10.5-4.9,14.4-7.3,21.3-21.3,38.9-33.6,57.2-4.1,3.9-10.7,4.7-14,9.9-28.4,28.8-64.5,42.2-102.8,51.5-10.1,2.4-20.3,3.6-30.4,5.5-14,3-15,4.7-9.5,17.2,1.4,3,3.2,5.5,4.5,8.3,26.1,52.3,16.8,102-12.6,149-12.4,19.7-35.9,25.9-56.1,34.3-21.9,9.1-45.2,14.8-67.9,22.3-10.7,3.6-21.1,6.9-32.6,5.5-2.4-.4-4.9-.4-7.1.4-68.7,25.1-141.7,23.7-212.8,33-60.4,7.9-122,6.1-183-3.7-21.9-3.6-43.6-7.9-65.3-12.8-25.5-5.7-48-17.4-68.3-32.4-21.7-16.2-33.6-40.9-43.4-64.7-17.6-42.4-34.1-86.1-38.7-132.2-3.4-35.7-9.7-71.1-17.8-105.6-13.4-58.2-18-117.4-28.8-175.9-6.7-36.5-10.7-73.8-12.2-111.1-.6-14.2-2-28.4-4.9-42.4-3.9-18.4-1.2-37.3-4.1-56.1-2.6-16.4-.6-33.4-4.1-49.7-2.8-12.8,1.2-25.3,3.2-37.9,6.9-13.6,7.1-28.4,9.1-43,4.5-45.6,17.8-86.6,54.7-117.4,7.3-6.1,15.6-8.1,23.9-9.5,17.8-2.8,35.9-5.9,53.9-5.5,14.2.4,16.2-5.9,16-17-.4-22.5,9.1-41.6,21.3-59.4,13.4-19.7,32.4-30,56.4-30.2,11.2,0,17.4-1.4,14.8-16.4-2.8-16,5.7-22.7,23.3-26.6,34.1-7.7,69.1-8.9,103.8-10.1,10.5-.4,21.3-.8,23.3-15,3-1.2,5.7-.8,8.3,1.4,11.6,17.8,8.7,36.3,2.8,55.1-11.2,13.6-27,16.8-43,15.8-51.5-2.6-94.5,13.8-131.6,50.1-13.6,13.4-22.3,27.4-23.7,45-5.7,65.7,1.8,130.1,21.1,193,3.2,10.1,5.3,20.1,4.7,30.4-3,62.4,13,123.2,16,185.1,2.4,50.9,10.9,101.1,21.5,150.8,15,70.3,52.7,120,127.3,134.4,83.1,16.2,166.2,24.7,250.9,12,67.5-10.1,136.6-8.9,203.5-23.7,32-7.1,63.2-17.2,90-36.5,43.8-32,50.3-77.2,45.6-127.9-8.3-88-22.1-174.9-36.7-261.9-10.5-62-19.3-124.1-35.1-184.7-16.6-63.6-32-128.1-78.7-179-14.8-16.2-31.6-23.7-52.3-24.1-36.5-.6-73.2-1-109.5,2.4-13,1.2-25.5,0-36.7-7.5-19.1-21.1-21.1-32.6-8.9-52.3v.2Z"
                            fill="#fe9526"
                          ></path>
                          <path
                            d="M1112,449.4c-.4,17.8,3.2,34.1,15.2,48,25.7,32.6,7.1,73-21.9,92-17,11.1-36.1,16.6-55.7,19.5-35.7,5.3-69.5,19.9-107,17.6-38.9-2.6-57.2-16.8-64.7-55.7,1.6-12.2,1.8-24.5,3.6-36.7.4-1.2.6-2.4,1-3.6,1.6-19.3.4-38.5-.8-57.6-7.3-28.6-11.1-57.2,1.4-85.7,4.1-5.5,7.7-14.6,15.8-11.8,13.8,4.3,23.1-3.2,32.6-9.9,15-10.9,32.2-15.4,49.5-13.2,22.3,2.8,43.6-3.2,65.3-3.4,13.8-.2,24.5,5.5,35.1,12,4.7,2.8,10.1,9.1,8.9,13.2-3.7,13,4.5,22.3,7.9,33,3.7,12,8.7,23.7,13,35.7.8,2.2.6,4.7,1,7.1l-.2-.6Z"
                            fill="#fe9526"
                          ></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  SparkCV
                </span>
              </div>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                Your career is unique. Your resume should be too. Stand out
                without the stress.
              </p>

              <div className="mt-4 flex items-center gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-background/50 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Links Section - Spans 7 cols with internal grid */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:col-span-7 lg:pl-12">
              {/* Product */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-foreground">
                  Product
                </h4>
                <ul className="flex flex-col gap-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-semibold text-foreground">Legal</h4>
                <ul className="flex flex-col gap-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-border/20 pt-8 md:flex-row">
            <p className="text-xs font-medium text-muted-foreground/80">
              &copy; {currentYear} SparkCV Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
