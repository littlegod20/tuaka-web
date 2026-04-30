# TuaKa — Invoice & Quote Management for African Businesses

> **Tua Ka** (Akan: _pay up_) — A multi-tenant SaaS platform that helps small businesses across West Africa create professional invoices, send quotes, and collect payments via mobile money and card.

---

## Table of contents

- [Overview](#overview)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Running the apps](#running-the-apps)
- [Environment variables](#environment-variables)
- [Apps](#apps)
- [Packages](#packages)
- [Git workflow](#git-workflow)
- [Roadmap](#roadmap)

---

## Overview

TuaKa is a full-stack SaaS invoicing platform built for small businesses in Ghana and across West Africa. Each business gets their own subdomain workspace (e.g. `acme.tuaka.app`), manages their team, creates invoices and quotes, and collects payments via MTN MoMo or Paystack.

The platform has three distinct user types:

| Actor          | Description                                   | Access                 |
| -------------- | --------------------------------------------- | ---------------------- |
| Platform owner | You — manages all tenants, plans, and revenue | `admin.tuaka.app`      |
| Business owner | Pays for a subscription, creates invoices     | `{slug}.tuaka.app`     |
| Client         | Receives and pays invoices                    | Public link — no login |

This repository contains the **frontend monorepo** only. The Laravel API lives in a separate repo (`tuaka-api`).

---

## Project structure

```
tuaka-web/
├── apps/
│   ├── admin/          # Super-admin portal (platform owner)
│   └── portal/         # Business portal (tenant-facing)
├── packages/
│   ├── ui/             # Shared React component library
│   ├── api-client/     # Shared Axios client + React Query hooks
│   └── config/         # Shared TypeScript and Tailwind config
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Tech stack

| Layer           | Technology                  |
| --------------- | --------------------------- |
| Framework       | React 18 + TypeScript       |
| Build tool      | Vite 5                      |
| Monorepo        | Turborepo + pnpm workspaces |
| Routing         | React Router v6             |
| Data fetching   | TanStack Query v5           |
| HTTP client     | Axios                       |
| Styling         | Tailwind CSS v3             |
| Package manager | pnpm                        |

---

## Getting started

### Prerequisites

Ensure you have the following installed before proceeding:

```bash
node --version   # 18 or higher
pnpm --version   # 8 or higher
```

If pnpm is not installed:

```bash
npm install -g pnpm
```

### Installation

Clone the repository and install all dependencies from the root:

```bash
git clone https://github.com/YOUR_USERNAME/tuaka-web.git
cd tuaka-web
pnpm install
```

Running `pnpm install` at the root installs dependencies for all apps and packages in the workspace in a single pass.

---

## Running the apps

All commands are run from the **root of the repository**, not from inside individual apps.

```bash
# Start both apps in development mode simultaneously
pnpm dev

# Build all apps for production
pnpm build

# Type-check all apps and packages
pnpm lint
```

Once running, the apps are available at:

| App             | URL                   |
| --------------- | --------------------- |
| Admin portal    | http://localhost:3000 |
| Business portal | http://localhost:3001 |

To run a single app in isolation:

```bash
pnpm dev --filter=portal
pnpm dev --filter=admin
```

---

## Environment variables

Each app has its own `.env.local` file which is **never committed to git**.

Create these files before running the apps locally:

**`apps/portal/.env.local`**

```env
VITE_API_URL=http://localhost:8000
```

**`apps/admin/.env.local`**

```env
VITE_API_URL=http://localhost:8000
```

For production, these are set as environment variables in your deployment pipeline — not in committed files.

---

## Apps

### `apps/portal` — Business portal

The customer-facing app used by business owners to manage their invoicing workspace. Each tenant accesses this at their own subdomain (e.g. `acme.tuaka.app`).

| Page      | Route        | Description                                             |
| --------- | ------------ | ------------------------------------------------------- |
| Dashboard | `/dashboard` | Revenue overview, outstanding invoices, recent activity |
| Invoices  | `/invoices`  | Create, send, and track invoices                        |
| Quotes    | `/quotes`    | Create and convert quotes to invoices                   |
| Clients   | `/clients`   | Manage client contact list                              |
| Products  | `/products`  | Saved services and default prices                       |
| Settings  | `/settings`  | Business profile, branding, reminder rules              |

### `apps/admin` — Admin portal

The internal platform management tool used by the platform owner. Lives at `admin.tuaka.app`. Never accessible to tenants.

| Page      | Route        | Description                                         |
| --------- | ------------ | --------------------------------------------------- |
| Dashboard | `/dashboard` | MRR, active tenants, churn, platform invoice volume |
| Tenants   | `/tenants`   | View and manage all businesses on the platform      |
| Plans     | `/plans`     | Create and edit subscription plans                  |
| Payments  | `/payments`  | Subscription payment history across all tenants     |

---

## Packages

### `packages/ui`

Shared React component library used by both apps. Contains only presentational components with no business logic.

```typescript
import { Badge, Button, Card, Input } from '@tuaka/ui'
```

Current components: `Button`, `Card`, `Badge`, `Input`

### `packages/api-client`

Shared Axios client and TanStack Query hooks. Handles JWT token injection and `X-Tenant` header automatically on every request.

```typescript
import { useInvoices, useLogin, useSendInvoice } from '@tuaka/api-client'
```

The `X-Tenant` header is derived from the subdomain at request time:

- `acme.tuaka.app` → `X-Tenant: acme`
- `localhost` → `X-Tenant: local` (handled by `DEV_TENANT` in the API `.env`)

### `packages/config`

Shared configuration files extended by both apps:

- `tsconfig.base.json` — base TypeScript config
- `tailwind.config.ts` — base Tailwind config with brand colours
- `vite.config.base.ts` — base Vite config

---

## Git workflow

### Branch naming

```
main          → production-ready code only
develop       → integration branch for features
feature/xxx   → individual features (e.g. feature/invoice-creation)
fix/xxx       → bug fixes (e.g. fix/send-button-disabled)
```

### Commit message format

```
type: short description

Types: init | feat | fix | refactor | style | docs | chore
```

Examples:

```bash
git commit -m "feat: add invoice creation form"
git commit -m "fix: correct X-Tenant header on localhost"
git commit -m "docs: update README environment variables section"
```

### Typical flow

```bash
git checkout develop
git checkout -b feature/invoice-creation
# ... make changes ...
git add .
git commit -m "feat: add invoice creation form with line items"
git push origin feature/invoice-creation
# open pull request → develop
```

---

## Roadmap

### Phase 1 — Auth and tenant setup

- [ ] Business registration and login
- [ ] JWT auth with tenant resolution via subdomain
- [ ] Team member invites and role management

### Phase 2 — Core invoicing

- [ ] Invoice creation with line items
- [ ] Quote creation and quote-to-invoice conversion
- [ ] PDF generation and email delivery via Mailgun
- [ ] Public invoice view page with view tracking

### Phase 3 — Payments

- [ ] MTN MoMo payment integration on public invoice page
- [ ] Paystack card payment integration
- [ ] Webhook handling with idempotency
- [ ] Automated payment reminders

### Phase 4 — Billing and subscriptions

- [ ] Subscription plans and Paystack recurring billing
- [ ] Free tier invoice limits
- [ ] Grace period handling on failed payments
- [ ] Admin billing dashboard

### Phase 5 — Infrastructure

- [ ] Ubuntu 22.04 server provisioning
- [ ] Nginx wildcard subdomain config with SSL
- [ ] GitHub Actions CI/CD pipeline (staging + production)
- [ ] Laravel Horizon queue monitoring

---

## Related repositories

| Repository  | Description                                           |
| ----------- | ----------------------------------------------------- |
| `tuaka-api` | Laravel 11 REST API — auth, invoices, billing, queues |

---

_Built with focus for the West African market. Your work deserves to be paid for._
