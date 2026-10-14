# SalesPlus — Vehicle Sales Management System

SalesPlus is a full-stack vehicle dealership management application. It provides
one web interface for vehicle inventory, customer relationship management, sales,
payments, expenses, reporting, and after-sales operations.

> **Project status:** This is an active development implementation. It is not
> production-ready until the security, deployment, database, storage, and
> operational items in [Known limitations](#known-limitations) are completed.

## Features

### Authentication and administration

- JWT-based login with bcrypt password hashing
- Role and permission management
- User, branch, settings, and audit-log management
- Password reset and email verification token flows
- Global request validation and protected dashboard routes

### Inventory and vehicle operations

- Vehicle stock records, specifications, media, and status tracking
- Purchase/acquisition records and stock movements
- Vehicle inspections, valuations, transfers, and leasing partners
- Public vehicle listing and vehicle-interest enquiry forms
- Vehicle handover and post-sale records

### CRM and sales

- Individual and corporate customer records
- Leads, lead activities, follow-ups, and customer timelines
- Test-drive scheduling and quotation management
- Discount requests and approval workflow
- Reservations, sales invoices, payments, installments, and refunds

### Finance and reporting

- Cash IN/OUT transactions and expense categories
- Supplier records and supplier payments
- Commissions and sales targets
- Dashboard KPIs and branch-aware reporting
- Aging-stock and profit/loss reports with CSV downloads
- In-app notifications and document upload/download support

## Architecture

```text
┌──────────────────────────────────────────────────────────┐
│ Frontend                                                  │
│ Next.js 16 + React 19 + Tailwind CSS 4                   │
│ http://localhost:3000                                    │
└───────────────────────────┬──────────────────────────────┘
                            │ REST/JSON
                            ▼
┌──────────────────────────────────────────────────────────┐
│ Backend                                                   │
│ NestJS 11 + Mongoose 9 + Passport JWT                    │
│ http://localhost:3001                                    │
└───────────────────────────┬──────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│ MongoDB                                                    │
│ Default database: salesplus                                │
└──────────────────────────────────────────────────────────┘
```

The frontend uses `NEXT_PUBLIC_API_URL` when it is configured. Otherwise it
uses port `3001` on the current browser host during client-side requests.

## Technology stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, Base UI, Shadcn components, Lucide React |
| Backend | NestJS 11, TypeScript |
| Database | MongoDB with Mongoose 9 |
| Authentication | JWT, Passport, bcrypt |
| Validation | `class-validator`, `class-transformer` |
| Testing | Jest, Supertest, NestJS testing utilities |

## Repository structure

```text
Vehicle Sales/
├── backend/
│   ├── src/
│   │   ├── auth/                 # Login, registration, JWT and recovery
│   │   ├── users/ roles/         # Users, roles and permissions
│   │   ├── branches/ settings/   # Administration and configuration
│   │   ├── vehicles/             # Inventory and public vehicle listings
│   │   ├── vehicle-purchases/    # Acquisitions and stock movements
│   │   ├── vehicle-inspections/  # Inspection records
│   │   ├── vehicle-transfers/    # Inter-branch transfers
│   │   ├── vehicle-valuations/   # Trade-in valuations
│   │   ├── customers/ leads/     # CRM and lead pipeline
│   │   ├── test-drives/          # Test-drive records
│   │   ├── quotations/           # Quotations and discounts
│   │   ├── reservations/ sales/  # Reservations and completed sales
│   │   ├── payments/ installments/# Customer payment workflows
│   │   ├── refunds/              # Refund records
│   │   ├── suppliers/            # Suppliers and supplier payments
│   │   ├── expenses/             # Expenses and expense categories
│   │   ├── cash-transactions/    # Cash ledger
│   │   ├── reports/ dashboard/   # KPIs, reports and CSV exports
│   │   ├── vehicle-handovers/    # Delivery and handover checklists
│   │   ├── after-sales/          # Post-sale service records
│   │   ├── complaints/           # Customer complaints
│   │   ├── documents/            # File upload and download
│   │   ├── notifications/        # In-app and optional external messages
│   │   └── audit-logs/           # Activity audit records
│   ├── scripts/                  # Database maintenance scripts
│   └── package.json
├── frontend/
│   ├── src/app/                  # Next.js routes and dashboard screens
│   ├── src/components/           # Shared UI components
│   ├── src/hooks/                # React hooks
│   ├── src/lib/                  # API client and shared helpers
│   └── package.json
├── STATUS.md                     # Current implementation status
└── README.md
```

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- MongoDB 6 or later, running locally or available through MongoDB Atlas

## Local setup

### 1. Configure the backend

```powershell
cd backend
Copy-Item .env.example .env
```

Update `backend/.env` before starting the API:

```dotenv
MONGO_URI=mongodb://localhost:27017/salesplus
JWT_SECRET=replace-with-a-unique-long-random-secret
JWT_EXPIRES_IN=1d
FRONTEND_ORIGIN=http://localhost:3000
UPLOAD_DIR=./uploads

# Optional email delivery for password recovery and verification
RESEND_API_KEY=
EMAIL_FROM=SalesPlus <no-reply@example.com>

# Optional SMS gateway configuration
SMS_API_KEY=
SMS_GATEWAY_URL=
SMS_SENDER_ID=SalesPlus
```

`PORT` is optional and defaults to `3001`. `FRONTEND_ORIGIN` can contain
comma-separated origins. Never commit real secrets or production credentials.

### 2. Install dependencies

Run each install command in its own application directory:

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 3. Start MongoDB

Ensure MongoDB is running and that the configured database URL is reachable.
The application creates its collections as the relevant features are used.

### 4. Seed development accounts

The seed command creates or updates the system roles and the five development
staff accounts. It does not create vehicles, customers, sales, or other
dealership sample records. Running it also removes user accounts whose email is
not in the built-in development account list, so do not run it against a
production database.

```powershell
cd backend
npm run seed
```

Development accounts created by the current seed script:

| Email | Password | Role |
| --- | --- | --- |
| `admin@salesplus.com` | `admin123` | Admin / Owner |
| `manager@salesplus.com` | `manager123` | Inventory Manager |
| `executive@salesplus.com` | `ex123` | Sales & Operations |
| `accountant@salesplus.com` | `accountant123` | Accountant / Finance Staff |
| `manager2@salesplus.com` | `manag123` | Sales & Operations |

These credentials are for local development only. Change or replace the seed
behavior before deploying the application.

### 5. Start the applications

Start the backend:

```powershell
cd backend
npm run start:dev
```

Start the frontend in a second terminal:

```powershell
cd frontend
npm run dev
```

Open <http://localhost:3000>. The API is available at
<http://localhost:3001>.

For a separately deployed API, create `frontend/.env.local` and set:

```dotenv
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Useful commands

### Backend

Run these commands from `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Start the API in watch mode |
| `npm run start` | Start the API without watch mode |
| `npm run start:prod` | Run the compiled API from `dist/` |
| `npm run build` | Compile the NestJS application |
| `npm run seed` | Create/update development roles and accounts |
| `npm run migrate:reference-ids` | Migrate legacy reference IDs |
| `npm run lint` | Run ESLint with autofix |
| `npm run format` | Format backend TypeScript files |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:cov` | Run tests with coverage |

### Frontend

Run these commands from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create the production build |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint |

## API overview

The backend exposes REST endpoints under the following controller paths:

| Area | Main routes |
| --- | --- |
| Auth | `/auth` |
| Administration | `/users`, `/roles`, `/permissions`, `/branches`, `/settings` |
| Inventory | `/vehicles`, `/vehicle-purchases`, `/stock-movements`, `/vehicle-inspections`, `/vehicle-transfers`, `/vehicle-valuations`, `/leasing-partners` |
| CRM | `/customers`, `/leads`, `/lead-activities`, `/follow-ups`, `/test-drives` |
| Sales | `/quotations`, `/discount-requests`, `/reservations`, `/sales`, `/payments`, `/installments`, `/refunds` |
| Finance | `/suppliers`, `/supplier-payments`, `/expenses`, `/expense-categories`, `/cash-transactions`, `/commissions`, `/sales-targets` |
| Operations | `/vehicle-handovers`, `/after-sales`, `/complaints`, `/documents`, `/notifications` |
| Insights | `/dashboard`, `/reports`, `/audit-logs` |
| Public | `/public/vehicles` and public enquiry actions |

Most operational routes require a bearer token:

```http
Authorization: Bearer <jwt-token>
```

Login is available through `POST /auth/login`. The API uses JSON by default and
supports multipart uploads for document workflows. Uploaded files are limited
by the application and should be stored on durable production storage.

## Validation checklist

From the repository root:

```powershell
cd backend
npm run build
npm test -- --runInBand
npm run test:e2e

cd ..\frontend
npm run lint
npm run build
```

Database-backed tests and manual workflows require a reachable MongoDB instance.

## Known limitations

- Public reservation and test-drive requests are enquiries until staff confirm
  them in CRM; automatic customer confirmation is not implemented.
- Email delivery requires a valid Resend API key and verified sender.
- SMS/WhatsApp delivery is optional and requires an external gateway.
- Invoice PDFs are currently handled through browser printing rather than a
  generated server-side PDF.
- Multi-record financial workflows are not yet fully atomic/idempotent because
  the local MongoDB configuration does not enable replica-set transactions.
- Rate limiting is process-local; a shared store is needed for multi-process
  deployments.
- File storage must be made durable and backed up before production use.
- DTO validation, permissions, audit coverage, seed repeatability, and
  deployment configuration still need further production hardening.

See [STATUS.md](STATUS.md) for the more detailed implementation status.

## Security notes

- Use a unique, high-entropy `JWT_SECRET` outside local development.
- Do not expose the development accounts or run `npm run seed` in production.
- Keep `.env` files and uploaded files out of source control and backups that
  are not access-controlled.
- Configure `FRONTEND_ORIGIN`, email, storage, and database access explicitly
  for each deployment environment.

## License

This project is proprietary software for vehicle dealership management.
All rights reserved.
