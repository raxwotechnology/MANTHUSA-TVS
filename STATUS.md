# Vehicle Sales Management System Status

## Current state

The repository contains a Next.js frontend, a NestJS API, and Mongoose models/controllers for most requested dealership modules. This is a development implementation, not yet a complete production system.

## Changes in this pass

- Removed client-side fake authentication. Login now requires a valid API response and does not issue a local mock token.
- Vehicle inventory now loads from the API without seeded UI fallback rows. Failed reads/writes show an error instead of pretending a save succeeded.
- Lead creation now persists a customer and lead through the API, and the leads table loads persisted records.
- Added lead ID generation and free-text vehicle interest storage.
- Removed the database-wide deletion from the seed script.
- JWT signing now requires `JWT_SECRET`; protected API routes validate bearer tokens.
- Added role checks for sales, finance and admin-only API modules, a global Nest validation pipe, and configurable CORS.
- Added API workflows for reservations, sales, payments, purchases, inspections, test drives, handovers, suppliers, commissions, targets, and reporting summaries.
- Sales and finance pages now pass the signed-in token when they call the API; customer/sales forms use stored customer and vehicle records.
- Public inventory listings now come from the vehicle API, and public trade-in requests report whether the request was actually saved.
- Seed accounts now match the three requested staff roles; seeding refuses to run against a database that already contains data.
- Added supplier payments, refunds, installment agreements/schedules, expense categories, branch CRUD, lead follow-ups and lead activity APIs, plus in-app notification storage.
- Added automatic audit records for successful write requests and database-backed module/action permission checks with role-based fallbacks.
- Quotations, reservations, suppliers, expenses and branch transfers now load/save through APIs; sale listing is API-backed and sale creation uses the real sale form.
- Reports can be downloaded as CSV; quotations calculate totals on the server.
- Replaced the sample data workflows for acquisitions, inspections, test drives, handovers, after-sales, complaints, valuations, commissions, sales targets and installment schedules with API-driven screens.
- Added persisted customer timelines, in-app notification inbox, document uploads/downloads with MIME-signature checks and a 10 MB limit, and public website enquiry capture into the CRM.
- Login attempts and public website enquiries have basic per-process rate limits; sales record the signed-in salesperson, and sale/reservation paths check the reserved customer and expiry.
- Supplier acquisition payments now update outstanding balances and the cash ledger; monthly sales target actuals are derived from sale records.
- Added editable API-backed status/checklist forms, discount request approval, customer refunds, supplier payments, public vehicle interest forms, and a customer history timeline.
- Dashboard stock aging, vehicle summary, follow-up reminders and audit history now read stored data instead of hard-coded examples.
- Added global search over API-backed vehicles, customers, leads, quotations and sales; public vehicle listings now use a separate safe field projection.
- Added real aging-stock and profit/loss report endpoints with CSV downloads; profit/loss now deducts vehicle investment and operating expenses.
- Added branch-level sales, vehicle cost, operating expense, gross profit and net profit reporting, with branch attribution on new sales and legacy vehicle-branch fallback.
- Public test-drive and reservation enquiries can be processed from CRM: staff can confirm a linked lead as a scheduled test-drive record or explicitly convert it into a time-limited reservation.
- Added dashboard and reports visualizations for monthly revenue, lead conversion, and sales by vehicle category.
- Added password reset and email verification token endpoints with one-time hashed tokens, expiration, account enumeration protection and per-process request throttling; added the password recovery and verification UI. Email delivery uses the configured Resend API.
- Removed hard-coded demo account credentials from the login screen.
- Backend and frontend production builds pass after the latest changes.

## Work still required before calling this complete

- Public website reservations and test drives remain requests until staff confirm them in CRM; automatic customer confirmation and direct self-service appointment booking are not implemented. More dashboard visual charts are also outstanding.
- Configure and validate the Resend sender/key before password recovery or email verification can deliver; SMS/WhatsApp notifications are not implemented. Invoice PDFs currently rely on browser print rather than a generated server PDF.
- Make multi-record financial workflows atomic and idempotent; the current MongoDB setup does not configure replica-set transactions. Audit coverage and role/action permissions still need a security review.
- Finish DTO validation for all endpoints, use a shared rate-limit store for multi-process deployment, and ensure uploaded-file storage is durable/backed up in production.
- Finish seed repeatability and deployment configuration, then verify critical workflows against a configured MongoDB instance. The local `.env` has no `MONGO_URI`, so database-backed workflows could not be exercised; backend/frontend builds pass.

## Development configuration

Set `MONGO_URI`, `JWT_SECRET` (a unique strong secret), and optional `FRONTEND_ORIGIN` before starting the backend. Set `RESEND_API_KEY` and a verified `EMAIL_FROM` to enable password recovery and verification email. Run the seed command only against an empty development database. Do not use demo credentials or sample seed data in production.
