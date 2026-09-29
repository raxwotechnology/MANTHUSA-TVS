# 🛠️ SalesPlus Backend API Server

NestJS-based REST API microservice for the SalesPlus Vehicle Sales & Dealership ERP System.

For complete system documentation, architecture overview, and deployment guides, please see the [Root README.md](../README.md).

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### Existing Database Migration
For databases created before reference fields were stored as BSON ObjectIds, run this once before starting the updated API:

```bash
npm run migrate:reference-ids
```
The migration is idempotent and converts valid 24-character reference IDs in place.

### 2. Database Initialization (Seed)
Create the system roles and an administrator account. Set unique administrator credentials before running this command; no sample dealership records are created. The command refuses to run if the database already contains data.

```bash
BOOTSTRAP_ADMIN_NAME="Your Name" BOOTSTRAP_ADMIN_EMAIL="you@example.com" BOOTSTRAP_ADMIN_PASSWORD="use-a-unique-password-at-least-12-chars" npm run seed
```

On PowerShell, set the variables for the current session first:

```powershell
$env:BOOTSTRAP_ADMIN_NAME = "Your Name"
$env:BOOTSTRAP_ADMIN_EMAIL = "you@example.com"
$env:BOOTSTRAP_ADMIN_PASSWORD = "use-a-unique-password-at-least-12-chars"
npm run seed
```

### 3. Start Development Server
```bash
npm run start:dev
```
The API server runs at: `http://localhost:3001`

---

## 📜 Available Scripts

- `npm run start` - Launch NestJS server
- `npm run start:dev` - Launch server in watch mode
- `npm run seed` - Execute database seeding (`src/seed.ts`)
- `npm run build` - Compile TypeScript to `dist/`
- `npm run lint` - Run ESLint checks
- `npm run test` - Execute unit tests via Jest
- `npm run test:e2e` - Execute end-to-end tests

---

## 📁 Module Architecture Overview

- `auth/` — JWT authentication, login, guards & strategies
- `users/`, `roles/`, `permissions/` — User management & RBAC
- `branches/` — Showroom location partitioning
- `vehicles/`, `vehicle-inspections/`, `vehicle-purchases/`, `vehicle-transfers/`, `vehicle-valuations/` — Vehicle inventory & stock control
- `customers/`, `leads/`, `test-drives/`, `quotations/` — CRM & sales pipeline
- `sales/`, `reservations/`, `payments/`, `installments/` — Invoicing & sales execution
- `expenses/`, `cash-transactions/`, `supplier-payments/` — Financial accounting & cash flow ledger
- `vehicle-handovers/`, `after-sales/`, `complaints/` — Customer delivery & post-sale tracking
- `reports/`, `dashboard/` — Business intelligence & dashboard APIs
