# Project Requirements Document (PRD)

## 1. Project Overview

The **Login Usage Dashboard** is a full-stack web application that lets users securely sign up, log in, and view their individual usage metrics on a modern, responsive dashboard. By combining a robust authentication system with type-safe data handling and a clean UI component library, it solves the problem of quickly building a personalized dashboard for tracking usage details (e.g., API calls, storage consumption, feature usage) without reinventing the foundational plumbing.

This project is being built as a boilerplate starter kit so teams can focus purely on their unique business logic—defining what “usage” means for them—rather than implementing sign-up flows, secure sessions, or chart components. Key success criteria include: 1) Secure and reliable user authentication, 2) Accurate and real-time display of per-user data, 3) A responsive, accessible UI, and 4) A reproducible deployment setup (Docker locally and Vercel in production).

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**
- User sign-up, sign-in, and session management via **Better Auth**
- A protected **/dashboard** page showing:
  - Usage summary cards (e.g., current usage vs. limit)
  - A historical usage data table
  - An interactive line chart of usage trends
- PostgreSQL schema for `users`, `sessions`, and a new `usage` table (linked by user ID)
- Server-side data fetching using **Drizzle ORM** in Next.js **Server Components**
- Theming support (light/dark) and responsive design via **Tailwind CSS v4** and **shadcn/ui**
- Dockerfile and local container setup
- Deployment to Vercel (frontend) with environment variable management
- Basic loading states and error handling on data fetch

**Out-of-Scope (Phase 1):**
- Role-Based Access Control (RBAC) beyond basic user-level sessions
- Admin interface for managing all users’ usage records
- CI/CD pipelines (GitHub Actions) – left for Phase 2
- Email notifications, webhooks, or third-party integrations
- Mobile-only or native app variants
- Advanced analytics (e.g., anomaly detection) or large-scale performance tuning

## 3. User Flow

A typical new user lands on the homepage and chooses “Sign Up.” They enter their email and password, and Better Auth handles account creation and session persistence. Upon successful registration, the user is automatically logged in and redirected to the **/dashboard** route. If a returning user visits, they click “Sign In,” submit credentials, and, after authentication, arrive at the same dashboard.

On the dashboard, users see a left-sidebar (or top menu on small screens) with navigation and a header with a theme toggle and a “Log Out” button. The main section is divided into cards highlighting key metrics (e.g., `currentUsage` vs. `usageLimit`), a paginated data table showing usage history, and an interactive line chart for trends. If data is loading, skeletons appear; if there’s an error (e.g., no usage record), a clear message guides them.

## 4. Core Features

- **Authentication Module:** Sign-up, sign-in, password hashing, session cookies via Better Auth; protected API routes.
- **Usage Schema & ORM Layer:** Drizzle ORM schema definitions for `usage` table linked to `users`; CRUD queries for reading user data.
- **Dashboard Page:** Next.js Server Component to fetch session, query usage data, and render UI.
- **UI Components:** Reusable `SectionCards`, `DataTable`, and `ChartAreaInteractive` from shadcn/ui, customized for dynamic data.
- **Theming & Responsiveness:** Tailwind CSS classes, CSS variables for color modes, mobile-first layouts.
- **Error & Loading States:** Skeleton screens, try/catch around data fetching with friendly error messages.
- **Containerization & Deployment:** Dockerfile for local dev; Vercel deployment configuration and environment variable setup.

## 5. Tech Stack & Tools

- **Frontend:** Next.js 15 (App Router, Turbopack), React Server & Client Components, TypeScript
- **Styling & UI:** Tailwind CSS v4, shadcn/ui component library
- **Authentication:** Better Auth integrated with Next.js API routes
- **Backend & Database:** Node.js runtime via Next.js API, PostgreSQL, Drizzle ORM for type-safe queries
- **Deployment:** Docker (local), Vercel (production)
- **Dev Tools (optional):** VS Code, Git, GitHub Copilot or Cursor for code completion, Vitest/Jest for unit tests, Playwright/Cypress for E2E tests

## 6. Non-Functional Requirements

- **Performance:** Dashboard page should load within **2 seconds** on a standard broadband connection; API responses under **200 ms** where possible.
- **Security:** HTTPS; secure cookies; CSRF protection; input validation on both front end and server; no secrets in source code.
- **Usability & Accessibility:** WCAG 2.1 AA compliance; keyboard navigation; sufficient color contrast; ARIA labels on charts and tables.
- **Scalability:** Prepare for moderate user volume (up to a few thousand daily active users) with efficient server-side queries and pagination.
- **Reliability:** 99.9% uptime SLAs; retry logic on transient DB errors.

## 7. Constraints & Assumptions

- **Constraints:** Must use Next.js 15 and Drizzle ORM; PostgreSQL available as the primary data store; Vercel for front-end hosting (no custom server on Vercel).
- **Assumptions:** User volume and data size remain modest in Phase 1; environment variables for database and auth secrets are properly configured; Better Auth library supports needed customization; developers have Docker installed locally.

## 8. Known Issues & Potential Pitfalls

- **Auth Edge Cases:** Token/session expiry might log out users unexpectedly—implement clear UX around session timeouts and auto-refresh tokens if possible.
- **Large Data Sets:** Chart or table performance may degrade if a user has thousands of records. Mitigation: implement server-side pagination and limit initial query window (e.g., last 30 days).
- **DB Migrations:** Schema changes can conflict if not versioned. Use a migration tool (e.g., Drizzle’s built-in migrations) and version control your `schema` files.
- **Static Placeholder Data:** The existing JSON must be fully replaced; ensure you remove or override it to avoid confusion.
- **Deployment Quirks:** Docker on Vercel is unsupported; use Docker only locally and rely on Vercel’s native Next.js builds for production.

---

This PRD provides a clear, unambiguous blueprint for building the **Login Usage Dashboard**, covering everything from user journeys and core features to technical constraints and potential pitfalls. Subsequent documents (tech stack deep dive, frontend/backend guidelines, file structure, IDE configurations) can be derived directly from this specification.