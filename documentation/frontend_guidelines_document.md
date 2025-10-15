# Frontend Guidelines Document

This document outlines the architecture, design principles, and technologies powering the **login-usage-dashboard** frontend. Anyone reading this guide—regardless of their technical background—will understand how the frontend is built, styled, and maintained.

## 1. Frontend Architecture

### Frameworks and Libraries
- **Next.js 15 (App Router with Turbopack)**: A React framework offering server-side rendering (SSR), nested routing, and built-in API routes.
- **React**: The core UI library for building component-based interfaces.
- **TypeScript**: Provides static typing across the entire stack for safer code and fewer runtime errors.
- **Tailwind CSS v4**: A utility-first CSS framework for rapid, consistent styling.
- **shadcn/ui**: A collection of pre-built, accessible React components (cards, tables, charts) styled with Tailwind.
- **Better Auth**: Handles secure sign-up, sign-in, session management, and can be extended for roles.
- **Drizzle ORM**: A type-safe, lightweight ORM for interacting with PostgreSQL.

### Scalability, Maintainability, and Performance
- **Modular Folder Structure** (`/app`, `/components`, `/lib`, `/db`): Enables clear separation of concerns.
- **Server Components**: Fetch sensitive data on the server, reducing client bundle size and improving security.
- **Turbopack**: Accelerates development builds and hot reloads.
- **Type Safety End to End**: Ensures data shapes are consistent between database queries and UI components.

## 2. Design Principles

### Usability
- **Consistent Patterns**: UI elements from `shadcn/ui` ensure users see familiar controls (buttons, cards, tables).
- **Clear Feedback**: Forms show validation errors, loading skeletons display while data loads.

### Accessibility (A11y)
- **Semantic HTML**: Proper use of headings, lists, and form labels.
- **Keyboard Navigation**: All interactive elements reachable via Tab.
- **ARIA Attributes**: Added where needed for assistive technologies.

### Responsiveness
- **Mobile-First**: Tailwind’s responsive utilities ensure layouts adapt from small to large screens.
- **Fluid Grids and Flexbox**: Used for dashboards and card layouts to avoid horizontal scrolling.

## 3. Styling and Theming

### Styling Approach
- **Utility-First with Tailwind CSS**: Compose classes like `px-4 py-2 bg-primary text-white` directly in JSX.
- **Component-Level Styles**: Use `@apply` in optional CSS files for repeating patterns.

### Theming
- **Dark Mode Support**: Controlled via Tailwind’s `dark:` variants.
- **Custom Theme Tokens**: Extended in `tailwind.config.ts` for colors, spacing, and typography.

### Visual Style
- **Design Style**: Modern, flat design with subtle shadows and smooth transitions.
- **Color Palette**:
  - Primary: `#4F46E5` (Indigo)
  - Secondary: `#10B981` (Emerald)
  - Accent: `#F59E0B` (Amber)
  - Neutral Light: `#F3F4F6` (Gray 100)
  - Neutral Dark: `#111827` (Gray 900)
- **Fonts**:
  - Primary: `Inter, system-ui, -apple-system` for clean, legible text across devices.

## 4. Component Structure

- **/app**: Defines routes and server components (sign-in, sign-up, dashboard, API routes).
- **/components**: Reusable UI elements (SectionCards, DataTable, ChartAreaInteractive).
- **/lib**: Helper functions (e.g., `auth.ts`, data-fetching utilities).
- **/db**: Drizzle ORM schemas (users, sessions, and custom `usage` table).

**Why Component-Based?**
- **Reusability**: Build once, use everywhere (cards, tables).
- **Testability**: Each component can be tested in isolation.
- **Maintainability**: Changes in one component do not ripple unexpectedly.

## 5. State Management

- **Local State**: React’s `useState` for simple, component-scoped data (form inputs, loading flags).
- **Global/Shared State**: React’s `useContext` for session info, theme settings, or other cross-cutting data.
- **Future Options**: Easily integrate Redux or Zustand if the app’s complexity grows.

## 6. Routing and Navigation

- **Next.js App Router**: Files under `/app` correspond to URL paths.
  - `/sign-in` and `/sign-up`: Public routes for authentication.
  - `/dashboard`: Protected route; uses a layout (`dashboard/layout.tsx`) for sidebar and header.
- **Client-Side Navigation**: Use Next.js `<Link>` component to prefetch and navigate without full page reloads.

## 7. Performance Optimization

- **Code Splitting**: Next.js automatically splits bundles by route.
- **Lazy Loading**: Dynamically import heavy components or charts using `next/dynamic` and React `Suspense`.
- **Image Optimization**: Use Next.js `<Image>` component to serve optimized formats and sizes.
- **Caching & CDN**: Deploy to Vercel for edge caching of static assets.
- **Turbopack**: Speeds up development builds and refresh times.

## 8. Testing and Quality Assurance

### Unit and Integration Tests
- **Vitest** or **Jest** with **React Testing Library**:
  - Test utility functions in `/lib`.
  - Verify component rendering and interaction (e.g., SectionCards display correct data).

### End-to-End Tests
- **Playwright** or **Cypress**:
  - Simulate user sign-up, sign-in, and verify dashboard data is displayed.

### Continuous Integration
- **GitHub Actions**: Run linting, type checks, unit tests, and E2E tests on every pull request.

## 9. Conclusion and Overall Frontend Summary

This frontend setup combines the power of Next.js 15, TypeScript, and Tailwind CSS to deliver a **scalable**, **maintainable**, and **high-performance** foundation for a user-authenticated usage dashboard. The component-driven approach, coupled with server components and a type-safe ORM, ensures data integrity and security. Accessible, responsive design principles guarantee a smooth experience for all users. Finally, a robust testing strategy and automated deployment to Vercel complete the pipeline, so you can focus on adding features—like real-time usage metrics—without worrying about infrastructure or code quality.