# Backend Structure Document

This document outlines the backend setup for the **login-usage-dashboard** project. It explains the architecture, database, APIs, hosting environment, infrastructure, security, monitoring, and maintenance strategies in simple terms.

## 1. Backend Architecture

**Overall Design**

- The backend is built on **Next.js 15** using the App Router and Server Components. This means server-side code lives alongside page code, making data fetching and rendering seamless.
- Business logic and database queries run on the server, keeping sensitive operations hidden from the browser.
- The project follows a modular structure:
  - `app/` holds route definitions and server components.
  - `lib/` contains utility functions (e.g., authentication helpers, data access logic).
  - `db/` houses the database schema definitions and ORM setup.
  - `components/` stores reusable UI elements (although mostly frontend, backend passes data into them).

**Scalability, Maintainability & Performance**

- **Serverless-Friendly:** Deployed on Vercel, each API route scales automatically under load.
- **Type Safety:** Using TypeScript end-to-end (including Drizzle ORM) reduces bugs and simplifies refactoring.
- **Separation of Concerns:** Clear folders for routing, business logic, and data layer make the code easy to maintain and extend.

---

## 2. Database Management

**Technologies Used**

- **PostgreSQL** (Relational SQL database)
- **Drizzle ORM** (lightweight, type-safe ORM for Node.js)

**Data Organization & Access**

- Data is stored in tables with clearly defined columns for users, sessions, and usage records.
- Drizzle ORM maps these tables to TypeScript types, ensuring that queries match the schema at compile time.
- All database interactions (reads and writes) happen in server-side code within Next.js route handlers or Server Components.
- Migrations and schema changes are managed via Drizzle’s migration tooling to keep database structure in sync with code.

---

## 3. Database Schema

### Human-Readable Overview

- **users**: Stores user account details and credentials.
- **sessions**: Tracks active user sessions for authentication.
- **usage_data**: Logs each user’s usage statistics and limits.

### SQL Schema (PostgreSQL)

```sql
-- 1. Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Sessions table (for Better Auth)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 3. Usage data table
CREATE TABLE usage_data (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_usage INTEGER NOT NULL,
  usage_limit INTEGER NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. API Design and Endpoints

**Approach**: Uses Next.js built-in API routes. These are RESTful endpoints under the `app/api` directory.

**Key Endpoints**

- `POST /api/auth/[...all]`  
  Handles all authentication operations (sign-in, sign-up, session refresh) via Better Auth.

- (Planned) `GET /api/usage`  
  Fetches the logged-in user’s usage record. Returns JSON with `current_usage`, `usage_limit`, and period dates.

- (Planned) `POST /api/usage`  
  Allows updates or batch inserts of usage data (admin or internal use).

**Data Flow**

1. User logs in via the frontend form.  
2. Frontend calls `POST /api/auth/...` to validate credentials and start a session.  
3. On the dashboard page (server component), code retrieves the current session, looks up the user ID, and calls the usage endpoint or directly queries the database via Drizzle.  
4. Dashboard UI components receive the usage data and render metrics.

---

## 5. Hosting Solutions

- **Vercel** is used for both frontend and backend (API routes). Vercel offers:
  - Automatic scaling of serverless functions.
  - Built-in CDN for static assets and API caching.
  - Zero-configuration HTTPS, custom domains, and environment variable management.

- **Docker** is used for local development and optional self-hosting. The Docker setup ensures:
  - A consistent environment across developer machines and CI.
  - Easy transition to other hosting providers if needed.

---

## 6. Infrastructure Components

- **Load Balancer & Auto-Scaling**  
  Managed by Vercel; traffic is evenly distributed among serverless instances.

- **CDN**  
  Vercel’s global CDN caches pages, API responses, and static assets for low-latency delivery.

- **Caching**  
  HTTP-level caching headers are set on API responses to reduce database load for infrequently changing data.

- **Database Hosting**  
  PostgreSQL can be hosted on any cloud provider (e.g., AWS RDS, Supabase). Automatic backups and failover add reliability.

---

## 7. Security Measures

- **Authentication & Authorization**
  - Better Auth provides secure sign-up, sign-in, and session management.
  - Sessions are stored server-side in the `sessions` table with expiring tokens.

- **Data Protection**
  - All traffic uses HTTPS.  
  - Passwords are hashed (e.g., bcrypt) before storage.  
  - Database queries use parameterized statements via Drizzle ORM to prevent SQL injection.
  - Environment variables store secrets (database URL, JWT keys) and are never checked into code.

- **Regulatory Compliance**
  - PostgreSQL encryption-at-rest and in-transit (managed by cloud providers) help meet data protection standards.
  - Access controls ensure developers and admins only see what they need.

---

## 8. Monitoring and Maintenance

- **Logging & Alerts**  
  - Vercel provides logs for every serverless function invocation.  
  - Integration with tools like Sentry (for error tracking) and LogRocket (for session replay) can be added.

- **Performance Monitoring**  
  - Use Vercel Analytics or third-party APM (e.g., Datadog, New Relic) to track response times and error rates.

- **Database Health**  
  - Monitor CPU, memory, and query performance via the database provider’s dashboard.  
  - Automated backups and routine restores to ensure data integrity.

- **Maintenance Strategies**
  - Scheduled dependency updates via Dependabot or Renovate.  
  - Regular review and pruning of unused API routes or old migrations.  
  - Security audits and penetration tests annually or after major changes.

---

## 9. Conclusion and Overall Backend Summary

The backend for **login-usage-dashboard** combines modern frameworks and best practices to deliver a secure, scalable, and maintainable foundation:

- Next.js + Server Components for efficient server-side data fetching.
- PostgreSQL + Drizzle ORM for reliable, type-safe data management.
- Better Auth for robust user authentication.
- Vercel and Docker for flexible, cost-effective hosting and development environments.

This setup aligns perfectly with the goal of showing each user’s real-time usage details in a protected dashboard. Its modular design and clear separation of concerns make it easy to extend—whether adding new metrics, implementing role-based access, or integrating advanced monitoring. You have a rock-solid base to focus on building compelling usage visualizations and delivering a great user experience.