# SparkAI — On-Demand Service Web Application

A production-ready, full-stack frontend for an on-demand professional services marketplace (similar to Urban Company) built with **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, and **React Query**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS Variables (HSL) |
| State | React Query (TanStack Query) |
| Forms | React Hook Form + Zod |
| UI Primitives | Radix UI + shadcn-style components |
| Animations | Framer Motion |
| Icons | Lucide React |
| Payments | Stripe Elements (scaffolded) |
| Date Picker | react-day-picker |

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth route group (login, signup, forgot-password)
│   ├── (customer)/          # Customer-facing pages
│   │   ├── page.tsx         # Home page (hero, categories, features)
│   │   ├── services/        # Service listing & detail
│   │   ├── bookings/        # Booking history & detail
│   │   ├── profile/         # User profile & password change
│   │   └── checkout/        # Stripe checkout flow
│   ├── (admin)/             # Admin panel
│   │   └── admin/
│   │       ├── page.tsx     # Dashboard with KPIs
│   │       ├── users/       # User management
│   │       ├── services/    # Service management
│   │       ├── bookings/    # Booking management
│   │       └── settings/    # Platform settings
│   ├── layout.tsx           # Root layout with Providers
│   └── globals.css          # CSS variables & Tailwind config
├── components/
│   ├── ui/                  # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── shared/              # Navbar, Footer, Providers
│   ├── admin/               # AdminSidebar, AdminTopbar, KpiCard
│   ├── booking/             # BookingCard, TrackingTimeline, DateTimePicker
│   └── service/             # ServiceCard, ServiceFilter
├── lib/
│   ├── api/                 # API client, React Query hooks, query keys
│   ├── validations/         # Zod schemas (auth, booking, service, profile)
│   └── utils/               # cn(), csrf, sanitize utilities
├── types/                   # Shared TypeScript types
└── middleware.ts             # Route protection & security headers
```

## Features

### Customer App
- **Home**: Hero section, service categories grid, features showcase, CTA
- **Services**: Filterable listing with category sidebar, search, service detail with booking form
- **Bookings**: Tabbed booking history (All/Pending/Confirmed/In-Progress/Completed/Cancelled), detailed booking view with live tracking timeline
- **Profile**: Personal info editing, password change with strength meter
- **Checkout**: Payment form with order summary, success confirmation animation

### Admin Panel
- **Dashboard**: KPI cards (revenue, users, bookings, growth), recent bookings, top services
- **Users**: Tabbed table (All/Customers/Providers), search, user detail with activity history
- **Services**: Searchable table with ratings, edit form with Zod validation
- **Bookings**: Filterable table with status tabs, booking detail with timeline and status actions
- **Settings**: General, Notifications, Appearance, Security tabs

### Security
- Route-level middleware with authentication & role-based access control
- CSRF token generation for mutation requests
- Content Security Policy meta tag
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- HTTP-only cookie-based auth (ready for backend integration)
- Input sanitization utility
- Zod validation on all forms

## Sample Credentials (for backend integration)

| Role | Email | Password |
|---|---|---|
| Customer | customer@sparkai.com | Password1 |
| Provider | provider@sparkai.com | Password1 |
| Admin | admin@sparkai.com | AdminPass1 |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
