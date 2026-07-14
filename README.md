<div align="center">
  <h1>💊 Dosific</h1>
  <p><strong>Smart cost-per-dose calculator — compare supplements and find the best value.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
    <img src="https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma 5">
    <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16">
    <br>
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4">
    <img src="https://img.shields.io/badge/NextAuth_v5-000000?style=for-the-badge&logo=auth0&logoColor=white" alt="NextAuth v5">
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
    <img src="https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black" alt="Neon">
  </p>
</div>

---

## 📋 About

**Dosific** is a cost-per-dose calculator for supplements and health products. Instead of comparing total prices, Dosific normalizes products by their cost per individual dose, letting you see which option truly delivers the best value. With affiliate link support, price history tracking, and multi-user plans, it's the smartest way to shop for supplements.

---

## ✨ Features

- **Cost-per-Dose Calculation** — Normalize products by dose cost, not total price
- **Product Catalog** — Browse, search, and filter community-submitted products
- **Price History** — Track price changes over time with interactive charts
- **Comparison Mode** — Side-by-side cost comparison across multiple products
- **Affiliate Links** — Monetize your product recommendations
- **Smart Scraping** — Auto-fill product info from URLs (Amazon, Mercado Livre, Growth, and more)
- **User Plans** — Free tier (3 products) and PRO/Enterprise with unlimited products
- **Payment Integration** — Asaas subscription management for premium plans
- **Authentication** — Email/password and Google OAuth via NextAuth v5
- **Admin Panel** — Product moderation, featuring, and user management
- **Responsive Design** — Works on desktop and mobile

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       Vercel (Frontend)                       │
│  Next.js 16 (App Router) + React 19 + Tailwind CSS v4        │
│  Server Components + Server Actions + Client Components        │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     Vercel (API Routes)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │   Auth   │ │  Asaas   │ │  Scraper │ │ Admin/Products  │  │
│  │ NextAuth │ │ Payments │ │ Puppeteer│ │   Moderation    │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───────┬────────┘  │
│       └────────────┴─────────────┴────────────────┘          │
│                              │                                │
│                    ┌─────────┴─────────┐                     │
│                    │  Prisma ORM       │                     │
│                    │  (Neon Serverless)│                     │
│                    └─────────┬─────────┘                     │
│                              │                                │
│                    ┌─────────┴─────────┐                     │
│                    │  PostgreSQL 16    │                     │
│                    │    (Neon)         │                     │
│                    └───────────────────┘                     │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with SSR & RSC |
| React 19 | UI library |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui + Base UI | Component library |
| Lucide React | Icon set |
| Recharts | Price history charts |
| Sonner | Toast notifications |

### Backend & Data

| Technology | Purpose |
|---|---|
| Next.js API Routes | Serverless backend |
| Prisma 5 | ORM with PostgreSQL |
| PostgreSQL 16 (Neon) | Database |
| NextAuth v5 | Authentication (JWT) |
| Zod v4 | Schema validation |
| Puppeteer + Cheerio | Web scraping |

### Services

| Service | Purpose |
|---|---|
| Vercel | Frontend + API hosting |
| Neon | Serverless PostgreSQL |
| Asaas | Payment gateway (Brazil) |
| Google OAuth | Social login |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Asaas account (for payments)

### Setup

```bash
# Clone
git clone https://github.com/Kkrloz/Dosific.git
cd Dosific

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Install dependencies
npm install

# Run database migrations
npx prisma db push

# (Optional) Seed initial data (plans, categories)
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

The app will be at `http://localhost:3000`.

### Testing

```bash
npm test
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Neon pooler) |
| `DIRECT_URL` | ✅ | Direct DB connection (Neon, no pooler) |
| `AUTH_SECRET` | ✅ | NextAuth encryption secret (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | ❌ | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | ❌ | Google OAuth client secret |
| `AUTH_TRUST_HOST` | ❌ | Trust Vercel deployment domain |
| `ASAAS_API_KEY` | ❌ | Asaas payment gateway API key |
| `ASAAS_SANDBOX` | ❌ | Use Asaas sandbox (`true`/`false`) |
| `CRON_SECRET` | ❌ | Auth token for scraping cron endpoint |

---

## 🌐 Deployment

### Vercel

The app auto-deploys to [Vercel](https://vercel.com) from the `main` branch.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Required environment variables on Vercel:**
- `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`
- `ASAAS_API_KEY` (if using payments)
- `CRON_SECRET` (if using scheduled scraping)

### Database

The project uses [Neon](https://neon.tech) for serverless PostgreSQL. Migrations are handled via Prisma:

```bash
npx prisma db push      # Sync schema (dev)
npx prisma generate      # Generate client
npx prisma db seed       # Seed data
```

---

## 📖 API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication |
| `/api/auth/register` | POST | User registration |
| `/api/plans` | GET | List subscription plans |
| `/api/fetch-product` | POST | Scrape product info from URL |
| `/api/scrape` | POST | Cron-triggered bulk scraping |
| `/api/click/[productId]` | GET | Track affiliate link click |
| `/api/asaas/customer` | POST | Create Asaas customer |
| `/api/asaas/subscription` | POST | Create subscription |
| `/api/asaas/webhook` | POST | Asaas payment webhook |
| `/api/admin/products/[id]` | PATCH | Moderate product (admin) |

---

## 👤 User Roles & Plans

| Plan | Price | Products | Affiliate | Featured |
|---|---|---|---|---|
| Grátis | Free | 3 | ❌ | ❌ |
| PRO | R$ 29,90/mo | Unlimited | ✅ | ❌ |
| Enterprise | R$ 99,90/mo | Unlimited | ✅ | ✅ |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made by <a href="https://github.com/Kkrloz">Carlos Eduardo</a>
</p>
