# Security Guidelines for login-usage-dashboard

This document provides a security-by-design checklist and best practices tailored to the **login-usage-dashboard** full-stack starter template. It ensures that your application is built with robust defenses at every layer—from authentication through deployment.

---

## 1. Core Security Principles

- **Security by Design**: Integrate security reviews during design, implementation, and CI/CD.
- **Least Privilege**: Grant database, server, and cloud roles only the minimum permissions needed.
- **Defense in Depth**: Layer controls (network, application, data, and host) so one failure does not lead to total compromise.
- **Fail Securely**: Default to safe states on error, avoid leaking stack traces or secrets.
- **Secure Defaults**: Ship with strong config out of the box (e.g., HTTPS, secure cookies, locked-down CORS).

---

## 2. Authentication & Access Control

### 2.1 Secure Authentication Flow

- Leverage **Better Auth** with Drizzle ORM for type-safe persistence.
- Enforce a strong password policy: minimum 12 characters, mixed letter cases, digits, and special characters.
- Hash passwords with **Argon2** or **bcrypt** with unique salts.
- Implement **Multi-Factor Authentication (MFA)** for elevated access or sensitive operations.

### 2.2 Session & Token Management

- Use secure, HttpOnly, `SameSite=Strict` cookies for session identifiers.
- Enforce idle and absolute session timeouts (e.g., 15 min idle, 24 h absolute).
- Protect against session fixation by regenerating session IDs on privilege elevation.
- If using JWTs:
  - Sign with strong algorithms (e.g., HS256 / RS256), never use `alg: none`.
  - Validate `exp`, `iss`, and `aud` claims.
  - Store secrets in a vault (e.g., HashiCorp Vault, AWS Secrets Manager).

### 2.3 Role-Based Access Control (RBAC)

- Define explicit roles (e.g., `user`, `admin`, `manager`) in your user schema.
- On every server-side API and page request (especially `/app/dashboard`), validate user roles and permissions.
- Do not trust client-side flags—enforce authorization checks in Next.js API routes and middleware.

---

## 3. Input Handling & Processing

### 3.1 Prevent Injection Attacks

- Use **Drizzle ORM** or parameterized queries exclusively—never concatenate raw SQL strings.
- Validate all user inputs on the server in `/app/api/*` and custom data-fetching utilities (`/lib/data.ts`).

### 3.2 XSS & Template Safety

- Apply context-aware escaping when rendering dynamic data in React components.
- Avoid using `dangerouslySetInnerHTML`. If required, sanitize HTML with a well-maintained library (e.g., DOMPurify).
- Implement a strict **Content Security Policy (CSP)** via Next.js headers.

### 3.3 File Uploads & Redirects

- If adding file upload features in the future, validate file type, size, and scan for malware.
- Whitelist redirect targets to avoid open-redirect vulnerabilities.

---

## 4. Data Protection & Privacy

### 4.1 Data in Transit & At Rest

- Enforce HTTPS (TLS 1.2➔1.3) for all Next.js pages, API routes, and database connections.
- Use encrypted connections (`sslmode=require`) for PostgreSQL.
- If storing backups or logs, encrypt volumes or objects (e.g., AWS EBS encryption, S3 SSE).

### 4.2 Secrets Management

- Store API keys, DB credentials, and JWT secrets outside code (environment variables, vault).
- Rotate secrets periodically and on personnel changes.

### 4.3 Privacy Controls

- Mask or omit PII in logs and error messages.
- Comply with GDPR/CCPA: implement data deletion workflows for users.

---

## 5. API & Service Security

- Expose only HTTPS endpoints—redirect all HTTP to HTTPS.
- Rate limit critical routes (e.g., `/api/auth`, `/api/data`) to defend against brute-force and DoS.
- Configure CORS to allow only your front-end origin(s) and required headers.
- Enforce correct HTTP verbs: GET for reads, POST for writes, PUT/PATCH for updates, DELETE for removals.
- Version your API (`/api/v1/...`) to manage breaking changes safely.

---

## 6. Web Application Security Hygiene

- Use anti-CSRF tokens for all state-changing requests (e.g., sign-up, dashboard updates).
- Enable security headers in `next.config.js`:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: same-origin`
  - `Permissions-Policy`
- Mark cookies as `HttpOnly`, `Secure`, and `SameSite=Strict`.
- Use Subresource Integrity (SRI) for any external scripts or styles.

---

## 7. Infrastructure & Configuration Management

- **Docker Hardening**:
  - Use minimal base images (e.g., node:alpine).
  - Drop unnecessary Linux capabilities.
  - Run containers as non-root users.
- **Vercel / Cloud Settings**:
  - Disable development and debugging flags in production.
  - Restrict environment variable visibility per deployment environment.
  - Monitor and renew TLS certificates automatically.
- **Network & Host**:
  - Close all unused ports (allow only 80/443 inbound).
  - Apply OS-level updates and security patches regularly.

---

## 8. Dependency Management

- Maintain a lockfile (`package-lock.json`) and audit dependencies via `npm audit` or SCA tools.
- Pin critical dependencies to known-good versions, and subscribe to vulnerability alerts.
- Remove unused packages to shrink attack surface.

---

## 9. CI/CD & Testing

- Integrate security checks into your GitHub Actions workflow:
  - Static code analysis (ESLint with security plugin).
  - Dependency vulnerability scanning.
  - Automated unit and end-to-end tests (Vitest, Playwright/Cypress).
- Enforce pull request reviews with security-minded checklists.

---

By following these guidelines, you will embed robust security across the **login-usage-dashboard** application, enabling you to focus on feature development with confidence that your foundation is secure.
