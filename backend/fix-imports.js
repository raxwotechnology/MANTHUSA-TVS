const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixDuplicates(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const uniqueLines = [];
  const importSet = new Set();
  
  for (const line of lines) {
    if (line.trim().startsWith('import {')) {
      if (importSet.has(line.trim())) {
        continue;
      }
      importSet.add(line.trim());
    }
    uniqueLines.push(line);
  }
  
  fs.writeFileSync(filePath, uniqueLines.join('\n'));
}

const modules = [
  'auth/auth.module.ts',
  'users/users.module.ts',
  'roles/roles.module.ts',
  'permissions/permissions.module.ts',
  'branches/branches.module.ts',
  'settings/settings.module.ts',
  'audit-logs/audit-logs.module.ts',
  'vehicles/vehicles.module.ts',
  'vehicle-inspections/vehicle-inspections.module.ts',
  'vehicle-purchases/vehicle-purchases.module.ts',
  'suppliers/suppliers.module.ts',
  'supplier-payments/supplier-payments.module.ts',
  'customers/customers.module.ts',
  'leads/leads.module.ts',
  'lead-activities/lead-activities.module.ts',
  'follow-ups/follow-ups.module.ts',
  'test-drives/test-drives.module.ts',
  'quotations/quotations.module.ts',
  'discount-requests/discount-requests.module.ts',
  'reservations/reservations.module.ts',
  'sales/sales.module.ts',
  'payments/payments.module.ts',
  'installments/installments.module.ts',
  'refunds/refunds.module.ts',
  'expenses/expenses.module.ts',
  'expense-categories/expense-categories.module.ts',
  'cash-transactions/cash-transactions.module.ts',
  'vehicle-handovers/vehicle-handovers.module.ts',
  'after-sales/after-sales.module.ts',
  'complaints/complaints.module.ts',
  'commissions/commissions.module.ts',
  'sales-targets/sales-targets.module.ts',
  'reports/reports.module.ts',
  'dashboard/dashboard.module.ts'
];

for (const mod of modules) {
  const filePath = path.join(srcDir, mod);
  if (fs.existsSync(filePath)) {
    fixDuplicates(filePath);
  }
}

console.log('Fixed duplicate imports');
