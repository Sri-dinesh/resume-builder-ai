import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const fonts = {
  Arial: undefined,
  Calibri: undefined,
  Helvetica: undefined,
  "Times New Roman": undefined,
  Georgia: undefined,
  Verdana: undefined,
  Roboto: roboto,
};

export const metadata: Metadata = {
  title: {
    template: "%s - Spark CV",
    absolute: "Spark CV",
  },
  description:
    "Why blend in when you were born to stand out? SparkCV’s AI builds resumes that highlight your strengths and make recruiters take notice. Take the first step to your dream role! 🚀",
  keywords:
    "sparkcv, spark, cvspark, sparkresume, airesume, cv builder, spark cv builder, ai cv, resume builder, AI resume, professional resume, job application, ATS-friendly resume, career, job search, CV builder, AI resume builder, AI-powered resume builder, AI resume generator, AI CV builder, AI CV generator, online resume builder, best resume builder, free resume builder, resume maker online, CV maker AI, job-winning resume, ATS-friendly resume, AI job application, resume optimization tool, resume ranking AI, AI career assistant, resume checker online, professional resume builder, AI-generated resume, resume review AI, resume formatting AI, resume writing assistant, resume design AI, resume builder with templates, resume customization AI, resume templates AI, resume PDF generator, resume spell checker AI, AI resume proofreading, resume auto-fill AI, AI resume builder for students, resume builder for professionals, resume builder for freshers, resume builder for freelancers, resume builder for IT jobs, resume builder for engineers, resume builder for designers, resume builder for healthcare jobs, resume builder for finance jobs, resume builder for developers, ATS resume checker, AI resume ATS optimization, resume keyword optimization, AI resume job match, AI resume keyword ranking, resume ranking tool, AI resume screening, resume parsing AI, AI resume feedback, resume scoring AI, AI resume for LinkedIn, LinkedIn resume optimization, resume builder for LinkedIn, job application AI tool, resume analysis AI, AI job application booster, smart job application AI, resume builder for remote jobs, AI job match system, resume comparison AI, resume content generator AI, resume writing AI assistant, resume cover letter generator, AI-powered cover letter builder, resume grammar checker AI, AI resume formatting tool, resume spell-check AI, resume builder with AI feedback, resume headline generator AI, resume career summary AI, AI-powered resume optimization, smart resume builder online, resume tips AI assistant, best AI resume software, resume builder for startups, AI-generated professional resume, resume customization AI tool, resume suggestions AI, one-click resume generator, resume tracking AI, AI-powered resume optimization, resume builder with free trial, resume builder subscription model, AI resume SaaS, resume builder with premium features, paid resume builder AI, free vs paid resume builders, resume generator with payment options, AI resume builder lifetime access, AI resume builder monthly plan, AI resume builder affordable pricing, Spark Resume, Resume Spark, CV Spark, SparkCV, Resume AI Spark, AI Resume Spark, Smart Resume Spark, Spark Resume Builder, AI CV Spark, AI Resume Generator Spark",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://sparkcv.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <head>
          <meta
            name="google-site-verification"
            content="IxhpEchCtN13IET3Rco_2tzGFES6y4ta28iAQgLYIxU"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
          />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <script type="application/ld+json" suppressHydrationWarning>
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Spark CV - AI Resume Builder",
              url: "https://sparkcv.vercel.app/",
              description: metadata.description,
              publisher: {
                "@type": "Organization",
                name: "SparkCV",
              },
            })}
          </script>
        </head>
        <body
          className={`${inter.className} min-h-screen overflow-x-hidden antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
