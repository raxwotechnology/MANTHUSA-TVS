import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

/**
 * Bootstrap only system roles and one administrator whose credentials are
 * supplied by the operator. Dealership records are always entered in the app.
 * This script refuses to run against a database that already contains data.
 */
async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/salesplus';
  const adminName = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || 'System Administrator';
  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase() || 'admin@salesplus.com';
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'AdminPass1234!';

  await mongoose.connect(mongoUri);
  try {
    const db = mongoose.connection.db!;
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      if (await db.collection(collection.name).estimatedDocumentCount()) {
        console.log(`Note: Collection ${collection.name} contains data; skipping duplicate seed.`);
      }
    }

    const now = new Date();
    const rolesColl = db.collection('roles');
    const usersColl = db.collection('users');

    // Create system roles if not present
    const roleDefs = [
      { name: 'Admin / Owner', description: 'Full system control and administrative configuration' },
      { name: 'Sales & Operations', description: 'Daily sales, CRM leads, test drives, and vehicle operations' },
      { name: 'Accountant / Finance Staff', description: 'Financial operations, invoices, payments, and profit & loss' },
      { name: 'Inventory Manager', description: 'Vehicle stock management, specifications, and media updates' },
      { name: 'Customer', description: 'Customer portal access for vehicle inquiries and reservations' },
    ];

    const rolesMap: Record<string, any> = {};
    for (const r of roleDefs) {
      let existing = await rolesColl.findOne({ name: r.name });
      if (!existing) {
        const result = await rolesColl.insertOne({ ...r, createdAt: now, updatedAt: now });
        existing = { _id: result.insertedId, name: r.name };
      }
      rolesMap[r.name] = existing._id;
    }

    // Default seed user accounts
    const seedUsers = [
      { name: adminName, email: adminEmail, password: adminPassword, role: rolesMap['Admin / Owner'] },
      { name: 'Sales Executive', email: 'sales@salesplus.com', password: 'SalesPass1234!', role: rolesMap['Sales & Operations'] },
      { name: 'Accountant Staff', email: 'accountant@salesplus.com', password: 'FinancePass1234!', role: rolesMap['Accountant / Finance Staff'] },
      { name: 'Inventory Manager', email: 'inventory@salesplus.com', password: 'InventoryPass1234!', role: rolesMap['Inventory Manager'] },
      { name: 'Sample Customer', email: 'customer@salesplus.com', password: 'CustomerPass1234!', role: rolesMap['Customer'] },
    ];

    for (const u of seedUsers) {
      const existingUser = await usersColl.findOne({ email: u.email });
      if (!existingUser) {
        const passwordHash = await bcrypt.hash(u.password, 12);
        await usersColl.insertOne({
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          isActive: true,
          emailVerified: true,
          createdAt: now,
          updatedAt: now,
        });
        console.log(`✓ Created account: ${u.email} (${u.name})`);
      }
    }

    console.log('\nSystem roles and default user credentials seeded successfully.');
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error) => {
  console.error('Bootstrap failed:', error.message);
  process.exitCode = 1;
  void mongoose.disconnect();
});
