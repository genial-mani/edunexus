# School Market — Education Recruitment & Institutional Marketplace

School Market is a centralized, mobile-first web platform connecting teachers, schools, colleges, and educational institutions across India. The platform facilitates teacher recruitment, empowers educators to showcase their credentials with privacy controls, and provides an institute-to-institute marketplace for purchasing and selling school transport infrastructure (school buses).

---

## 🌟 Key Features

1. **Teacher Recruitment Network:**
   - **Teachers Open to Work:** Educators can activate an "Open to Work" status, specify subject and grade preferences, set salary expectations, and upload resumes.
   - **Strict Privacy Controls:** Phone numbers and contact info can be hidden. When hidden, numbers are sanitized on the server and are never present in the DOM or API payloads.
   - **Location-Based Smart Discovery:** Educational institutes prioritize nearby teachers from their city/village, district, and state. Teachers discover vacancies prioritized by their local area.
   - **Vacancies & Applications:** Institutes post vacancies with salary ranges and qualifications; teachers apply with 1-click or attached cover letters.

2. **Institute-to-Institute School Bus Marketplace:**
   - Verified institutions can list school buses for sale (specifications, seating capacity, fuel type, condition, registration state, negotiable pricing badges, photos).
   - Prospective institutions can browse listings with multi-attribute filtering, check negotiable price indicators, and submit direct inquiries.

3. **Multi-Role Dashboards & Activity Badges:**
   - **Teacher Dashboard:** Profile management, Open to Work settings, application tracking, saved jobs, notifications with unread count badges, and preferences.
   - **Institute Administrator Dashboard:** Institutional profile, verification management, job vacancies, candidate review pipeline with new unread application badges, bus fleet management, and buyer inquiries.
   - **Platform Administrator Dashboard:** Full governance, institution verification queue, vacancy and bus listing moderation, teacher directory, and system audit logs.

4. **Visual Identity & Theme:**
   - **Forest Green (`#163B32`)** — Primary brand identity, logo, primary navigation, and buttons.
   - **Academic Amber / Gold (`#D97706` / `#FEF3C7`)** — Status indicators, notification badges, negotiable price tags, and highlight accents.
   - **Sage Green (`#65A88A`)** — Secondary highlights, active states, and pill badges.
   - **Warm Cream (`#F7F5EF`)** — Hero accents, promotional cards, and callout sections.
   - **Off-White (`#F8FAF7`)** — Crisp page background.
   - **Success Green (`#10B981`)** — Verified institution badge and confirmation alerts.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS v4 & custom design tokens
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form & Zod
- **Database:** Relational SQLite / Cloudflare D1 with Drizzle ORM (`@libsql/client`)
- **Authentication:** Session-based authentication with HTTP-only, secure, SameSite cookies and WebCrypto PBKDF2 hashing
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
git clone https://github.com/your-username/school-market.git
cd edunexus
npm install
```

### 3. Database Initialization & Seeding
School Market uses a zero-config portable SQLite engine locally via `@libsql/client`, with instant mapping to Cloudflare D1 in production:
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

## 🔒 Security & Privacy Enforcement

- **Server-Side Authorization:** Every dashboard route, mutation, and status transition verifies authenticated session cookies and user ownership before execution.
- **Strict Cookie Security:** Authentication sessions are maintained exclusively in `HttpOnly`, `SameSite=Lax`, and `Secure` cookies. No sensitive auth tokens or passwords are ever stored in client-side localStorage.
- **Phone Privacy Sanitization:** If a teacher selects "Hide phone number", the phone field is stripped server-side. It is never emitted in JSON payloads, server-rendered HTML, or inspectable DOM.
- **Session Revocation:** Sessions are stored with expiration timestamps in SQLite/D1 and tracked via secure cookies.
- **Audit Logging:** Sensitive administrative events (approving schools, moderating vacancies, deleting listings) are recorded in the `audit_logs` entity.

---

## ☁️ Cloudflare Deployment (Workers, D1, R2)

The application is structured for Cloudflare Workers with D1 and R2 bindings.

1. Authenticate with Wrangler:
```bash
npx wrangler login
```

2. Build and deploy:
```bash
npm run build
npx wrangler deploy
```

---

## 📄 License
Proprietary — Developed for School Market. All rights reserved.
