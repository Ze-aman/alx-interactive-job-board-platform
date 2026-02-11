# ALX Interactive Job Board Platform

Enterprise-grade job marketplace with candidate, employer, and admin portals. Built on Next.js (Pages Router) with TypeScript, MySQL, and secure session-based auth. Designed for scalability, observability, and operational excellence.

## Quick Start

Prerequisites:
- Node.js 20+
- MySQL 8.x

Install and run:
```bash
npm install
npm run dev
# http://localhost:3000
```

Production build:
```bash
npm run build
npm run start
```

Lint:
```bash
npm run lint
```

## Architecture

Core stack:
- Next.js 16 (Pages Router), React 19, TypeScript 5, Tailwind CSS v4
- MySQL via mysql2/promise (pooled connections)
- iron-session for cookie-based auth; JWT utilities available

Application layers:
- UI: `pages/`, `components/`
- API (server): `pages/api/**`
- Domain services & libs: `lib/`, `services/`, `utils/`, `context/`

Role-based portals:
- Candidate: profile, experiences, applications, preview
- Employer: dashboard, applicants, Pipeline Overview, candidate review modal, company settings
- Admin: overview and settings endpoints

## Key Directories
- `pages/`: routes and page components (includes `pages/api/**` HTTP endpoints)
- `components/`: reusable UI (layouts, modals, widgets)
- `lib/`: platform libraries (auth, database, sessions, client helpers)
- `services/`: domain logic (auth, users, jobs)
- `context/`: React contexts (e.g., jobs, auth)
- `utils/`: helpers (hashing, JWT)
- `styles/`: global CSS

## Configuration & Environment

Create `.env.local`:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=alx-interactive-job-board-platform

# Sessions (iron-session)
SECRET_COOKIE_PASSWORD=replace-with-32+chars-strong-secret

# JWT
JWT_ACCESS_SECRET=replace-with-strong-secret
JWT_REFRESH_SECRET=replace-with-strong-secret

# Node environment
NODE_ENV=development
```

Notes:
- `SECRET_COOKIE_PASSWORD` must be at least 32 characters.
- In production, `cookieOptions.secure` is automatically enabled.
- Do not commit `.env*` files; secrets must be managed via vault/secret stores.

## Database

MySQL schema overview (representative tables):
- `users`, `roles`, `company_users`, `companies`
- `jobs`, `job_descriptions`, `job_requirements`, `job_benefits`
- `job_applications`
- `candidate_profiles`, `candidate_experiences`
- `audit_logs`

Connection pool:
- Configured in `lib/database.ts` using `DB_*` env vars
- `connectionLimit` defaults to 10; tune for workload

Seed (non-production only):
- `POST /api/admin/seed-admin` creates a bootstrap admin user when none exists

## Authentication & Authorization

Session:
- iron-session cookie with `SECRET_COOKIE_PASSWORD`
- `withAuth(handler, roles)` enforces authentication and role checks for API routes

Roles:
- `candidate`, `employer`, `admin`

Important routes:
- Login, Register, Logout: `/api/auth/*`
- Profile: `/api/profile/*` (role-aware)
- Employer: `/api/employer/*` protected
- Admin: `/api/admin/*` protected

JWT utilities:
- Provided in `utils/jwt.ts` for services needing signed tokens (e.g., links/integrations)

## Employer Pipeline

Endpoints:
- `PATCH /api/applications/[id]` — update application status (`screening`, `interview`, `offer`, `hired`, `rejected`)
- `GET /api/employer/applicants?job_id=...` — list applicants for a job
- `GET /api/employer/candidates/[id]` — candidate profile for review modal


## Security

Standards:
- Secrets via environment variables; never commit secrets
- Secure cookies in production; same-site and httpOnly recommended
- Passwords hashed with `bcryptjs`
- Input validation on API endpoints; RBAC via `withAuth`
- Audit logging via `lib/audit.ts` (user, action, resource, IP, UA)


## Deployment

Build:
```bash
npm run build
npm run start
```

Environment:
- Provision MySQL with appropriate credentials and network policy
- Set all required env variables securely
- Configure reverse proxy (HTTPS, HTTP/2, compression)

Scaling:
- Horizontal app replicas behind a load balancer
- MySQL high availability (primary/replica), backups, PITR
- CDN for static assets


## Scripts

- `dev` — start local dev server
- `build` — compile and optimize for production
- `start` — run production server
- `lint` — run ESLint

