# Ultimate Success Partners Platform

Welcome to the premium, bilingual (Thai/English), investor-grade executive education, media, CRM, and BI platform built for **Ultimate Success Partners**. This platform is architected with Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS v4, and Prisma v7 with PostgreSQL.

---

## Technical Stack & Architecture

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
- **Bilingual Core**: Managed via custom `LanguageProvider` context that stores language state (`th` | `en`) and synchronizes it via cookies so server components can fetch translation paths instantly for optimal SEO.
- **Database Layer**: Prisma v7 with PostgreSQL driver adapters (`@prisma/adapter-pg` and `pg`) for high concurrency.
- **Authentication**: Auth.js (NextAuth v5) supporting Credentials provider and role-based route security claims.
- **Secure Middleware**: Intercepts `/admin/*` routes to check authentication states and validates administrative role levels (`SUPER_ADMIN`, `ADMIN`, `CONTENT_EDITOR`, `COURSE_MANAGER`).
- **Online LMS Classroom**: Leverages a pluggable video player module that tracks and persists course progress.
- **Executive CRM & BI Dashboard**: Connects sales stage funnels with client communication logs and aggregates MMR subscription indicators.
- **Affiliate referral portal**: Includes dynamic link generation, conversion counters, and commission trackers.

---

## File Structure

```
├── prisma/
│   ├── schema.prisma         # Relational database models (LMS, CRM, Affiliate, Tickets)
│   └── seed.ts               # Seeding script with courses, instructors, CRM leads & blog posts
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Base page layout with fonts and metadata
│   │   ├── page.tsx          # Landing page (Hero, Promotions, Featured courses)
│   │   ├── about/            # About page & instructor profiles
│   │   ├── courses/          # Course listing and detail pages
│   │   ├── blog/             # Media catalog & article content pages
│   │   ├── contact/          # Interactive contact form
│   │   ├── login/            # Secures authentication credentials page
│   │   ├── register/         # Handles new member sign-ups
│   │   ├── dashboard/        # Member learning overview and progress
│   │   │   ├── tickets/      # Admission passes with barcode cards
│   │   │   └── affiliate/    # Member referral link copier & click metrics
│   │   ├── classroom/[slug]/ # 3-Column dynamic LMS player with active lesson checklist & AI Sidebar
│   │   ├── admin/            # Secure RBAC management dashboard pages
│   │   │   ├── crm/          # CRM sales pipeline Kanban manager
│   │   │   ├── bi/           # Founder BI analytics dashboard panel
│   │   │   └── tickets/      # Admin ticket scanner terminal
│   │   └── api/              # API endpoints for CRM, Affiliate hits, AI Chat, and LMS progress
│   ├── components/           # Custom reusable UI components
│   │   ├── ui/               # Brand & SVG social icons helpers
│   │   ├── layout/           # Shared Header & Footer components
│   │   └── lms/              # Pluggable YouTube/Vimeo/Mux stream component
│   ├── context/
│   │   └── LanguageContext.tsx # Bilingual context state provider
│   ├── lib/
│   │   ├── db.ts             # Prisma v7 client database wrapper
│   │   └── auth.ts           # Auth.js security configuration
│   └── types/
│       └── next-auth.d.ts    # Typings for custom role attributes
├── docker-compose.yml        # Multi-stage PostgreSQL database container
├── prisma.config.ts          # Prisma v7 database connection registry
└── package.json              # Scaffolding configuration & scripts
```

---

## Local Setup & Development Instructions

Follow these steps to run the application locally:

### 1. Prerequisites
Ensure you have **Node.js v20+** and **Docker** installed on your system.

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (we have already created a default one for you):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ultimatesuccess?schema=public"
AUTH_SECRET="ultimatesuccess-secret-key-needs-to-be-secure-32-chars"
NEXTAUTH_SECRET="ultimatesuccess-secret-key-needs-to-be-secure-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Spin Up PostgreSQL Database
Run the following command to start the PostgreSQL database in the background:
```bash
docker-compose up -d
```

### 4. Run Database Migrations
Synchronize your PostgreSQL database with the Prisma schema models:
```bash
npx prisma db push
```

### 5. Seed Initial Data
Seed the database with default instructors, bilingual courses, blog categories, blog posts, promotion banners, CRM leads, and a super admin user:
```bash
npx prisma db seed
```
*Default admin credentials created:*
- **Email**: `admin@ultimatesuccess.co`
- **Password**: `password123`

### 6. Start the Development Server
Launch the Next.js development server:
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Production Verification & Build
To verify the application for production deployment, run:
```bash
npm run build
```
This tests compile times, processes TypeScript checks, bails out search parameter static generation warnings via Suspense, and optimizes layouts for high-performance delivery.
