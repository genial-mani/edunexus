# EduNexus — Education Recruitment & Institutional Marketplace

EduNexus is a centralized, mobile-first web platform connecting teachers, schools, colleges, and educational institutions across India. The platform facilitates teacher recruitment, empowers educators to showcase their credentials with privacy controls, and provides an institute-to-institute marketplace for purchasing and selling school transport infrastructure (school buses).

---

## 🌟 Key Features

1. **Teacher Recruitment Network:**
   - **Teachers Open to Work:** Educators can activate an "Open to Work" status, specify subject and grade preferences, set salary expectations, and upload resumes.
   - **Strict Privacy Controls:** Phone numbers and contact info can be hidden. When hidden, numbers are sanitized on the server and are never present in the DOM or API payloads.
   - **Vacancies & Applications:** Institutes post vacancies with salary ranges and qualifications; teachers apply with 1-click or attached cover letters.

2. **Institute-to-Institute School Bus Marketplace:**
   - Verified institutions can list school buses for sale (specifications, seating capacity, fuel type, condition, registration state, photos).
   - Prospective institutions can browse listings with multi-attribute filtering and submit direct inquiries.

3. **Multi-Role Dashboards:**
   - **Teacher Dashboard:** Profile management, Open to Work settings, application tracking, saved jobs, notifications, and preferences.
   - **Institute Administrator Dashboard:** Institutional profile, verification management, job vacancies, candidate review pipeline (Shortlist / Interview / Hire / Reject), bus fleet management, and buyer inquiries.
   - **Platform Administrator Dashboard:** Full governance, institution verification queue, vacancy and bus listing moderation, teacher directory, and system audit logs.

4. **Visual Identity — EduNexus Premium Green:**
   - Forest Green (`#163B32`) — Primary brand, navigation accents, primary buttons, and footer.
   - Sage Green (`#65A88A`) — Secondary highlights, active states, and pill badges.
   - Warm Cream (`#F7F5EF`) — Hero accents, promotional cards, and callout sections.
   - Off-White (`#F8FAF7`) — Crisp page background.
   - White (`#FFFFFF`) — High-elevation cards and elevated surfaces.
   - Success Green (`#10B981`) — Verified institution badge and confirmation alerts.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS v4 & custom design tokens
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form & Zod
- **Database:** Relational SQLite / Cloudflare D1 with Drizzle ORM (`@libsql/client`)
- **Authentication:** Session-based authentication with HTTP-only cookies and WebCrypto PBKDF2 hashing
- **Deployment & Cloud:** Compatible with Cloudflare Workers, Cloudflare D1, and Cloudflare R2
- **Testing:** Automated unit & integration suite (`npm test`)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 and 22)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository and install dependencies
git clone https://github.com/your-username/edunexus.git
cd edunexus
npm install
```

### 3. Database Initialization & Seeding
EduNexus uses a zero-config portable SQLite engine locally via `@libsql/client`, with instant mapping to Cloudflare D1 in production:
```bash
# Seed default roles, institutes, vacancies, teachers, and buses
npm run db:seed
```

### 4. Run the Test Suite
```bash
# Executes password hashing, server-side privacy sanitization, and DB checks
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Pre-Seeded Test Accounts

You can log in manually or use the **1-Click Quick Demo Login** buttons available on the `/login` page:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@edunexus.org` | `Admin@12345` | Full moderation queue, audit logs, verification controls |
| **Institute Administrator** | `admin@greenwood.edu` | `Password@123` | Greenwood International School (Approved) |
| **Institute Administrator** | `admin@stxavier.edu` | `Password@123` | St. Xavier's Senior College (Approved) |
| **Institute Administrator** | `admin@delhipublic.edu`| `Password@123` | Delhi Academy of Sciences (Pending Verification) |
| **Teacher (Open to Work)** | `anjali.sharma@gmail.com` | `Password@123` | PGT Math (Phone hidden server-side) |
| **Teacher (Open to Work)** | `rajesh.verma@gmail.com` | `Password@123` | PGT Physics & Robotics |

*Note: Any new account registered on `/register` is automatically logged in and granted instant access to their role-specific dashboard.*

---

## 🔒 Security & Privacy Enforcement

- **Server-Side Authorization:** Every dashboard route, mutation, and status transition verifies authenticated session cookies and user ownership before execution.
- **Phone Privacy Sanitization:** If a teacher selects "Hide phone number", the phone field is stripped server-side. It is never emitted in JSON payloads, server-rendered HTML, or inspectable DOM.
- **Session Revocation:** Sessions are stored with expiration timestamps in SQLite/D1 and tracked via secure `SameSite=Lax`, `HttpOnly` cookies.
- **Audit Logging:** Sensitive administrative events (approving schools, moderating vacancies, deleting listings) are recorded in the `audit_logs` entity.

---

## ☁️ Cloudflare Deployment (Workers, D1, R2)

The application is structured for Cloudflare Workers with D1 and R2 bindings.

### Configuration (`wrangler.toml`):
```toml
name = "edunexus"
main = ".open-next/worker.js"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "edunexus-prod"
database_id = "<YOUR_D1_DATABASE_ID>"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "edunexus-media"
```

### Deployment Steps:
1. Install Wrangler CLI: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Create D1 Database: `wrangler d1 create edunexus-prod`
4. Apply migrations: `wrangler d1 execute edunexus-prod --file=lib/db/init.sql`
5. Create R2 Bucket: `wrangler r2 bucket create edunexus-media`
6. Build and deploy: `npx @opennextjs/cloudflare` and `wrangler deploy`

---

## 📂 Project Architecture

```
edunexus/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── api/
│   │   ├── admin/institutes/verify/
│   │   ├── auth/[login|register|logout|me]/
│   │   ├── buses/inquire/
│   │   ├── institute/[applications|buses|profile|vacancies]/
│   │   ├── jobs/apply/
│   │   ├── teacher/profile/
│   │   └── upload/
│   ├── buses/               # Bus listings & details
│   ├── dashboard/
│   │   ├── admin/           # Platform governance & moderation
│   │   ├── institute/       # Institute admin tools
│   │   └── teacher/         # Teacher portfolio & applications
│   ├── institutes/          # Institutional showcase & details
│   ├── jobs/                # Job vacancy search & application
│   ├── teachers/            # Open-to-work teacher discovery
│   ├── layout.tsx
│   └── page.tsx             # EduNexus Landing Page
├── components/
│   ├── dashboard/           # Sidebar, navigation, metrics
│   └── layout/              # Navbar, Footer
├── lib/
│   ├── auth/                # WebCrypto PBKDF2, sessions, RBAC
│   ├── db/                  # Drizzle ORM schema, init, and seed
│   └── storage/             # Local upload & R2 storage abstraction
└── tests/
    └── workflows.test.ts    # Automated test suite
```

---

## 📝 License
Proprietary — Developed for EduNexus. All rights reserved.
