# Hacker News Submission Draft

---

### **Submission Title**

> Show HN: SparkCV – Open-source AI resume builder and ATS checker (Next.js + Gemini)

### **URL**

> https://github.com/Sri-dinesh/resume-builder-ai

---

### **Post Content (Markdown)**

Hey HN! I’m Sri Dinesh, and I built **SparkCV** ([https://github.com/Sri-dinesh/resume-builder-ai](https://github.com/Sri-dinesh/resume-builder-ai)), an open-source resume builder, ATS scorer, and cover letter generator.

You can try the live demo here without signing up: **[https://sparkcv.vercel.app](https://sparkcv.vercel.app)**.

### Why I built this

Most commercial resume builders follow the same frustrating playbook: they let you design a resume for 45 minutes, only to demand an expensive monthly subscription before you can export a PDF. Worse, many generate image-based PDFs that fail modern Applicant Tracking Systems (ATS) because the text isn't machine-parseable.

I wanted to build an open-source, modern alternative that anyone can self-host or inspect:

1. Gives you a live, interactive drag-and-drop builder with clean, typographically sound templates.
2. Exports text-selectable, vector A4/Letter PDFs that ATS scanners can parse cleanly.
3. Provides real-time ATS match scoring and keyword gap analysis against any pasted job posting.
4. Uses Google Gemini to help refine bullet points with quantifiable action verbs without hallucinating qualifications.

### Technical Highlights & Trade-offs

- **PDF Generation without Headless Browsers**: Running Puppeteer or Playwright in serverless environments is slow and memory-intensive (cold starts, Chromium bundle sizes). I chose `@react-pdf/renderer` so resumes are rendered directly from declarative React component trees into text-selectable vector PDFs.
- **AI Latency & Structured Outputs**: We use `gemini-2.5-flash-lite` with structured schema enforcement. This gives sub-second responses for bullet-point polishing and keyword analysis while keeping inference costs minimal.
- **Next.js 16 & Server Actions**: Used Server Actions for data mutations (resume saves, billing portals, auth sync), avoiding boilerplate REST endpoints.
- **Client State**: Drag-and-drop reordering with `@dnd-kit` and Zustand to maintain smooth 60fps responsiveness during layout edits.
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Radix UI, Prisma ORM, PostgreSQL (Neon), Clerk for auth, and Stripe for optional tiers.

### Code & Self-Hosting

The repo is MIT-licensed and containerized with Docker:

```bash
git clone https://github.com/Sri-dinesh/resume-builder-ai.git
cd resume-builder-ai
npm run setup
npm run dev
```

### What I’d love feedback on

1. **ATS Scoring Heuristics**: Our scoring compares job descriptions against resume sections using keyword frequency and semantic coverage. If you've worked on recruiter tools or ATS parsers, how would you improve the scoring algorithm?
2. **PDF Typography**: Font subsetting and layout edge cases in `@react-pdf/renderer` across different operating systems.
3. **Features you'd want**: What’s missing for technical job seekers? LaTeX template export? GitHub repo auto-import?

Code: https://github.com/Sri-dinesh/resume-builder-ai  
Demo: https://sparkcv.vercel.app

Thanks for checking it out!
