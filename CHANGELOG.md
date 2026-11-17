# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-11-17

### Added

- **Interactive Drag-and-Drop Editor**: Dynamic resume section reordering and editing powered by `@dnd-kit` and Zustand state management.
- **AI-Powered Resume Enhancements**: Integrated Google Gemini (`gemini-2.5-flash-lite`) for one-click bullet point refinement, summary generation, and work experience enhancement.
- **ATS Scoring Engine**: Real-time resume evaluation against target job descriptions with keyword gap detection and score breakdown.
- **Targeted Cover Letter Generator**: Generates customized cover letters matched to the applicant's resume and job description.
- **ATS-Friendly PDF Export**: Client and server-side PDF generation via `@react-pdf/renderer`, ensuring high visual fidelity and machine-readable text selection.
- **Subscription Billing**: Stripe billing integration supporting Free, Pro, and Pro Plus plans with webhook synchronization.
- **Authentication**: Seamless user sign-in and sign-up with Clerk, with webhook synchronization to PostgreSQL (Neon).
- **Responsive Theme System**: Full dark and light mode support built on Tailwind CSS and Radix UI.
- **Test Infrastructure**: Multi-layered test suite featuring Vitest unit tests and Playwright end-to-end user journey tests.
- **Containerization**: Dockerfile and `docker-compose.yml` for unified local container execution.
