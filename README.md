# 🚗 SalesPlus — Vehicle Sales & Dealership Management System

[![Framework - NestJS](https://img.shields.io/badge/Backend-NestJS_11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Framework - Next.js](https://img.shields.io/badge/Frontend-Next.js_16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Database - MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Styling - Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 📌 Overview

**SalesPlus** is a full-featured, enterprise-grade **Vehicle Dealership & Sales Management ERP System**. Designed to streamline every aspect of automotive dealership operations, SalesPlus bridges the gap between lead acquisition, inventory tracking, financial accounting, vehicle servicing/handovers, and executive reporting.

Whether managing single or multi-branch dealerships, SalesPlus delivers real-time visibility into vehicle investments, profit margins, sales performance, cash transactions, and post-sale customer management.

---

## 🏗️ System Architecture

SalesPlus is built with a modern decoupled full-stack architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Client                      │
│     Next.js 16 (App Router) + React 19 + Tailwind v4    │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP / REST API (Port 3001)
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Backend API                         │
│       NestJS 11 + Mongoose 9 + Passport JWT             │
└────────────────────────────┬────────────────────────────┘
                             │ Mongoose ODM
                             ▼
┌─────────────────────────────────────────────────────────┐
│                     Database Layer                      │
│                  MongoDB (salesplus)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features & Modules

### 🔐 1. Authentication & Access Control (RBAC)
- **JWT-Based Authentication**: Secure stateless authentication using Passport JWT.
- **Role-Based Permissions**: Granular permissions per role (Admin, Sales & Operations, Accountant / Finance Staff).
- **Multi-Branch Control**: Branch-level data partitioning for Colombo, Kandy, Kurunegala, Galle, etc.
- **Audit Logging**: Tracks system activities for compliance and operational transparency.

### 🚘 2. Vehicle Inventory Management
- **Complete Vehicle Lifecycle**: Track vehicles from purchase, inspection, and detailing to sale and handover.
- **Financial Investment Tracking**: Detailed breakdown of Purchase Price, Import Costs, Transport, Repairs, Detailing, Registration, Insurance, and Advertisement costs.
- **Real-Time Margin Calculation**: Automatic calculation of Total Investment, Minimum Selling Price, and Expected Profit.
- **Vehicle Status Management**: Status tracking (`Available`, `Reserved`, `Sold`, `Under Inspection`).
- **Media & Features Gallery**: Support for vehicle imagery, technical specifications, and condition tags.
- **Transfers & Valuations**: Multi-branch vehicle transfers and trade-in valuation workflows.

### 👥 3. CRM & Lead Lifecycle
- **Customer Directory**: Supports both **Individual** and **Corporate** profiles with NIC/Passport tracking.
- **Lead Pipeline**: Stage tracking (`New`, `Contacted`, `Test Drive`, `Quotation`, `Negotiation`, `Closed-Won`, `Closed-Lost`).
- **Test Drive Scheduling**: Track licenses, appointment slots, vehicle assignments, and customer feedback.
- **Quotations & Discounts**: Generate formal quotations with expiration dates, discount requests, and manager approvals.

### 💰 4. Sales, Reservations & Invoicing
- **Vehicle Reservations**: Hold vehicles with advance deposits, receipt generation, and automatic expiration handling.
- **Invoicing & Checkout**: Complete sales transaction processing with invoice numbers (`INV-YYYY-XXX`), payment method tracking, and balance calculations.
- **Vehicle Handovers**: Pre-delivery checklist verification (keys, documentation, insurance, accessories) and customer digital signatures.

### 💵 5. Finance, Cash Flow & Expenses
- **Double-Entry Style Cash Transactions**: Real-time ledger recording incoming (`IN`) customer payments and outgoing (`OUT`) operational expenses.
- **Supplier & Purchase Management**: Supplier directory, purchase orders, outstanding balance tracking, and supplier payments.
- **Expense Categorization**: Track showroom utility, repair, transport, and administrative costs.
- **Installments & Refunds**: Support for flexible customer payment plans and refund tracking.

### 📊 6. Analytics, Reporting & Dashboard
- **Executive Dashboard**: KPI metrics for total sales revenue, available inventory valuation, active leads, and monthly targets.
- **Commissions & Targets**: Sales executive quota tracking and commission calculation.
- **Exportable Reports**: Detailed financial summaries, inventory aging, and sales performance analytics.

---

## 📁 Directory Structure

```directory
Vehicle Sales/
├── backend/                  # NestJS REST API Server
│   ├── src/
│   │   ├── after-sales/      # Post-sales & service history
│   │   ├── audit-logs/       # Audit log recording module
│   │   ├── auth/             # JWT Auth guards, strategies & auth services
│   │   ├── branches/         # Showroom branch management
│   │   ├── cash-transactions/# Cash IN/OUT financial ledger
│   │   ├── commissions/      # Staff commission tracking
│   │   ├── complaints/       # Customer complaint ticketing
│   │   ├── customers/        # Customer CRM management
│   │   ├── dashboard/        # Dashboard stats & analytics endpoints
│   │   ├── discount-requests/# Manager approval workflows for discounts
│   │   ├── expense-categories/# Expense category classification
│   │   ├── expenses/         # Store & operational expense entries
│   │   ├── follow-ups/       # Lead follow-up schedules
│   │   ├── installments/     # Customer payment installment plans
│   │   ├── lead-activities/  # CRM interaction logs
│   │   ├── leads/            # Sales pipeline & lead management
│   │   ├── payments/         # Payment receipt processing
│   │   ├── permissions/      # Permission list & RBAC mapping
│   │   ├── quotations/       # Vehicle quotation generation
│   │   ├── refunds/          # Customer refund processing
│   │   ├── reports/          # Financial & inventory report engines
│   │   ├── reservations/     # Vehicle reservation deposits
│   │   ├── roles/            # Role definitions (Admin, Sales, Finance)
│   │   ├── sales/            # Sales invoicing & order management
│   │   ├── sales-targets/    # Monthly/Quarterly quota targets
│   │   ├── settings/         # System-wide configuration options
│   │   ├── supplier-payments/# Supplier payout tracking
│   │   ├── suppliers/        # Vehicle & parts supplier database
│   │   ├── test-drives/      # Test drive scheduling & feedback
│   │   ├── users/            # System user accounts & management
│   │   ├── vehicle-handovers/# Pre-delivery inspection & handover checklists
│   │   ├── vehicle-inspections/# Vehicle health & condition reports
│   │   ├── vehicle-purchases/# Inventory stock acquisition logs
│   │   ├── vehicle-transfers/# Inter-branch vehicle movement
│   │   ├── vehicle-valuations/# Trade-in vehicle valuation
│   │   ├── vehicles/         # Vehicle inventory core models & logic
│   │   ├── app.module.ts     # Main application root Nest module
│   │   ├── main.ts           # Backend entrypoint (Runs on port 3001)
│   │   └── seed.ts           # Database initialization script
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # Next.js App Router Web UI
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/    # Main application dashboard layout & pages
    │   │   │   ├── after-sales/
    │   │   │   ├── audit-logs/
    │   │   │   ├── commissions/
    │   │   │   ├── complaints/
    │   │   │   ├── customers/
    │   │   │   ├── expenses/
    │   │   │   ├── finance/
    │   │   │   ├── handovers/
    │   │   │   ├── inspections/
    │   │   │   ├── installments/
    │   │   │   ├── leads/
    │   │   │   ├── quotations/
    │   │   │   ├── reports/
    │   │   │   ├── reservations/
    │   │   │   ├── sales/
    │   │   │   ├── suppliers/
    │   │   │   ├── targets/
    │   │   │   ├── test-drives/
    │   │   │   ├── transfers/
    │   │   │   ├── users/
    │   │   │   ├── valuations/
    │   │   │   └── vehicles/
    │   │   ├── login/        # User authentication portal
    │   │   ├── layout.tsx    # Root Next.js layout
    │   │   └── page.tsx      # Landing & redirection page
    │   ├── components/       # Shared UI components & Shadcn elements
    │   ├── hooks/            # Custom React hooks
    │   └── lib/              # API utilities & helpers
    ├── package.json
    └── tailwind.config.ts
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | NestJS 11 | Enterprise TypeScript framework for Node.js |
| **Database** | MongoDB + Mongoose 9 | NoSQL Document Database with Object Data Modeling |
| **Auth & Security** | JWT + Passport + Bcrypt | Secure token authentication & password hashing |
| **Frontend Framework**| Next.js 16 | React Framework with App Router & Server Components |
| **UI Library** | React 19 + Base UI | Modern, accessible component architecture |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Icons** | Lucide React | Modern SVG icons set |

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher (or `pnpm` / `yarn`)
- **MongoDB**: `v6.0` or higher (running locally on port `27017` or via MongoDB Atlas connection string)

---

### 1. Database Setup & Seeding

Make sure your MongoDB server is running:

```bash
# Verify MongoDB connection
mongod --version
```

Navigate to the `backend` folder and populate sample seed data (Branches, Users, Vehicles, Customers, Sales, Cash Ledger entries):

```bash
cd backend
npm install
npm run seed
```

> **Note**: `npm run seed` will initialize the `salesplus` database with demo accounts, sample stock vehicles, and operational records.

---

### 2. Backend API Setup

From the `backend` directory:

```bash
# Start backend server in development mode
npm run start:dev
```

The NestJS backend will start at:  
👉 **`http://localhost:3001`**

---

### 3. Frontend UI Setup

Open a new terminal window, navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```

The Next.js frontend application will start at:  
👉 **`http://localhost:3000`**

---

## 🔐 Default Demo Accounts

The database seed populates the following accounts for testing across various role permissions:

| Name | Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Saman Kumara** | Admin | `admin@salesplus.com` | `admin123` | Full System Access |
| **Nimal Perera** | Manager | `manager@salesplus.com` | `manager123` | Manager & Approval Controls |
| **Kasun Fernando**| Sales Executive | `executive@salesplus.com` | `ex123` | CRM, Leads, Vehicles & Sales |
| **Dilini Silva** | Accountant | `accountant@salesplus.com` | `accountant123` | Finance, Expenses & Cash Ledger |
| **Ruwan Jayasinghe**| Sales Manager | `manager2@salesplus.com` | `manag123` | Sales & Operations |

---

## 📡 API Endpoints Overview

The backend exposes RESTful endpoints under the following main routes:

### Authentication & Users
- `POST /auth/login` — Authenticate user and receive JWT token
- `GET /users` — List system users
- `POST /users` — Create user account
- `GET /roles` — Retrieve defined user roles
- `GET /branches` — Showroom branch details

### Vehicles & Stock
- `GET /vehicles` — Fetch inventory listing with filters (status, make, branch)
- `POST /vehicles` — Register a new vehicle entry
- `GET /vehicles/:id` — Vehicle details & investment cost breakdown
- `POST /vehicle-inspections` — Record vehicle pre-purchase/sale inspection
- `POST /vehicle-transfers` — Initiate inter-branch vehicle movement
- `POST /vehicle-valuations` — Evaluate trade-in vehicles

### CRM & Sales Pipeline
- `GET /customers` — List customers (Individual/Corporate)
- `GET /leads` — View lead pipeline status
- `POST /test-drives` — Book test drive slot
- `POST /quotations` — Create customer vehicle quotation
- `POST /reservations` — Reserve vehicle with deposit

### Sales & Financials
- `POST /sales` — Create sale invoice & complete transaction
- `GET /payments` — View payment transaction receipts
- `GET /cash-transactions` — Audit cash ledger (IN/OUT entries)
- `GET /expenses` — View operational expenses & category breakdown
- `GET /dashboard/stats` — Executive dashboard overview metrics

---

## 🧪 Testing & Code Quality

### Backend Commands
```bash
cd backend

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run code linter
npm run lint

# Format codebase
npm run format
```

### Frontend Commands
```bash
cd frontend

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

---

## 📄 License

This project is proprietary software developed for vehicle dealership management. All rights reserved.
