# SparkCV

> AI-powered resume builder, ATS scorer, and cover letter generator — built for job seekers who want to stand out.

[![CI](https://github.com/Sri-dinesh/resume-builder-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/Sri-dinesh/resume-builder-ai/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-Private-red)]()

---

## Features

| Feature               | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| 📝 **Resume Builder** | Drag-and-drop editor with real-time preview, photo upload, and PDF export   |
| 🤖 **AI Enhancement** | One-click resume improvement powered by Google Gemini                       |
| 📊 **ATS Score**      | Instant resume scoring with keyword analysis and actionable recommendations |
| 💌 **Cover Letter**   | AI-generated cover letters tailored to specific job descriptions            |
| 💳 **Subscriptions**  | Free, Pro, and Pro Plus tiers via Stripe billing                            |
| 🎨 **Customization**  | Font selection, color picker, and border styles (Pro Plus)                  |
| 🌙 **Dark Mode**      | Full dark/light theme support                                               |

## Tech Stack

| Layer             | Technology                              |
| ----------------- | --------------------------------------- |
| **Framework**     | Next.js 16 (App Router, Server Actions) |
| **Language**      | TypeScript 5.9 (strict mode)            |
| **Styling**       | Tailwind CSS + Radix UI                 |
| **Database**      | PostgreSQL (Neon) via Prisma ORM        |
| **Auth**          | Clerk                                   |
| **Payments**      | Stripe                                  |
| **AI**            | Google Gemini                           |
| **Storage**       | Vercel Blob                             |
| **Observability** | Structured logging                      |
| **Hosting**       | Vercel (Production)                     |
| **Container**     | Docker (Local Development)              |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── (main)/           # Authenticated app routes
│   │   ├── editor/       # Resume editor
│   │   ├── resumes/      # Resume management
│   │   ├── score/        # ATS scoring
│   │   ├── cover-letter/ # Cover letter generator
│   │   ├── enhance/      # AI resume enhancement
│   │   └── billing/      # Subscription management
│   └── api/              # REST API endpoints
├── components/
│   ├── resume/           # Resume preview, PDF, download
│   ├── editor/           # Editor-specific components
│   ├── shared/           # Shared UI components
│   ├── score/            # Scoring dashboard
│   ├── premium/          # Premium/billing components
│   ├── landing/          # Marketing pages
│   └── ui/               # Radix UI primitives
└── lib/
    ├── ai/               # Google Gemini client
    ├── billing/          # Stripe, subscriptions, permissions
    ├── db/               # Prisma client
    ├── resume/           # Validation, scoring, types
    ├── email/            # Email client
    └── logger.ts         # Structured logging
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL (or [Neon](https://neon.tech) account)
- [Clerk](https://clerk.com), [Stripe](https://stripe.com), and [Google AI](https://ai.google.dev/) accounts

### Setup

```bash
# Clone
git clone https://github.com/Sri-dinesh/resume-builder-ai.git
cd resume-builder-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up database
npx prisma migrate dev

# Start development server
npm run dev
```

### Available Scripts

| Script                  | Description                  |
| ----------------------- | ---------------------------- |
| `npm run dev`           | Start dev server (Turbopack) |
| `npm run build`         | Production build             |
| `npm test`              | Run unit tests (Vitest)      |
| `npm run test:watch`    | Watch mode tests             |
| `npm run test:coverage` | Tests with coverage report   |
| `npm run lint`          | ESLint check                 |
| `npm run type-check`    | TypeScript type checking     |
| `npm run format`        | Format with Prettier         |

## Deployment

### Production (Vercel)
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Configure the environment variables (see `.env.example`).
4. Deploy — Vercel automatically builds and deploys Next.js.

### Local Development (Docker)
```bash
docker compose up --build -d
```

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit with conventional format: `git commit -m "feat: add new feature"`
4. Push and create a PR

Pre-commit hooks will automatically lint and format staged files.

---

Built with ❤️ by [Sri Dinesh](https://github.com/Sri-dinesh)
