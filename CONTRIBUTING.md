# Contributing to SparkCV

Thank you for your interest in contributing to SparkCV! We are thrilled to welcome developers, designers, technical writers, and job seekers from around the world.

Whether you are fixing a typo in the documentation, optimizing ATS algorithms, adding new resume templates, or reporting bugs, your help makes SparkCV better for everyone.

---

## ⚡ Quick Links

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Issue Response SLA (24 Hours)](#issue-response-sla)
- [Local Development Setup](#local-development-setup)
- [Coding Guidelines & Standards](#coding-guidelines--standards)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## ⏱️ Issue Response SLA

We take community engagement seriously. As part of our open-source commitment:

- **First Response Time**: A maintainer will triage, label, and respond to every newly opened issue within **24 hours** (1 business day).
- **PR Review Time**: Pull requests will receive an initial technical review within **48 hours**.

If you have general questions or ideas before opening an issue, feel free to start a thread in [GitHub Discussions](https://github.com/Sri-dinesh/resume-builder-ai/discussions).

---

## 🙋 How Can I Contribute?

### 1. New to Open Source?

Look for issues with the [good first issue](https://github.com/Sri-dinesh/resume-builder-ai/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) label. These are curated tasks that require minimal context to implement.

### 2. Reporting Bugs

Please use our [Bug Report Template](https://github.com/Sri-dinesh/resume-builder-ai/issues/new?template=bug_report.md). Include clear reproduction steps, browser/OS versions, and screenshots if applicable.

### 3. Suggesting Features

Check existing [GitHub Discussions](https://github.com/Sri-dinesh/resume-builder-ai/discussions) and open issues first. If novel, submit a [Feature Request](https://github.com/Sri-dinesh/resume-builder-ai/issues/new?template=feature_request.md).

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **Git**

### Step-by-Step

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/<your-username>/resume-builder-ai.git
   cd resume-builder-ai
   ```

2. **Run the one-command setup:**

   ```bash
   npm run setup
   ```

   _This copies `.env.example` to `.env.local`, installs all dependencies, and generates the Prisma ORM client._

3. **Configure your `.env.local`:**
   Populate credentials for Clerk, Neon Postgres, and Google Gemini API (you can obtain a free key at [Google AI Studio](https://ai.google.dev/)).

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📏 Coding Guidelines & Standards

To maintain clean code and green CI, please follow these conventions:

- **Formatting**: We use Prettier. Run formatting check:
  ```bash
  npm run format:check
  # Auto-fix formatting:
  npm run format
  ```
- **Linting**: We use ESLint.
  ```bash
  npm run lint
  # Auto-fix lint errors:
  npm run lint:fix
  ```
- **Type Checking**:
  ```bash
  npm run type-check
  ```
- **Testing**:
  ```bash
  npm test
  ```

### Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation improvements
- `style:` Formatting or CSS tweaks (no code changes)
- `refactor:` Code restructuring without feature or bug changes
- `test:` Adding or updating tests
- `chore:` Maintenance, dependency updates, build tooling

---

## 🚀 Submitting a Pull Request

1. **Create a branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** and write tests if appropriate.
3. **Verify all checks pass locally**:
   ```bash
   npm run format:check && npm run lint && npm run type-check && npm test
   ```
4. **Push your branch**:
   ```bash
   git push origin feat/your-feature-name
   ```
5. **Open a PR** against the `main` branch. Describe what changed, link related issues (e.g. `Fixes #8`), and include visual screenshots for UI changes.

---

## 📜 Code of Conduct

We are committed to providing a friendly, welcoming, and inclusive environment for everyone. Please be respectful, considerate, and constructive in all interactions.
