import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

/**
 * Bootstrap the system roles and the five default staff accounts.
 * Dealership records are always entered in the app.
 */
async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/salesplus';

  await mongoose.connect(mongoUri);
  try {
    const db = mongoose.connection.db!;
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

    // Keep only these default staff accounts and reset their passwords on each seed.
    const seedUsers = [
      { name: 'Admin', email: 'admin@salesplus.com', password: 'admin123', role: rolesMap['Admin / Owner'] },
      { name: 'Manager', email: 'manager@salesplus.com', password: 'manager123', role: rolesMap['Inventory Manager'] },
      { name: 'Sales Executive', email: 'executive@salesplus.com', password: 'ex123', role: rolesMap['Sales & Operations'] },
      { name: 'Accountant', email: 'accountant@salesplus.com', password: 'accountant123', role: rolesMap['Accountant / Finance Staff'] },
      { name: 'Sales Manager', email: 'manager2@salesplus.com', password: 'manag123', role: rolesMap['Sales & Operations'] },
    ];

    const allowedEmails = seedUsers.map((user) => user.email);
    const removed = await usersColl.deleteMany({ email: { $nin: allowedEmails } });
    if (removed.deletedCount > 0) {
      console.log(`✓ Removed ${removed.deletedCount} account(s) outside the default staff list.`);
    }

    for (const u of seedUsers) {
      const passwordHash = await bcrypt.hash(u.password, 12);
      const result = await usersColl.updateOne(
        { email: u.email },
        {
          $set: {
            name: u.name,
            passwordHash,
            role: u.role,
            isActive: true,
            emailVerified: true,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true },
      );
      if (result.upsertedCount > 0) {
        console.log(`✓ Created account: ${u.email} (${u.name})`);
      } else {
        console.log(`✓ Updated account: ${u.email} (${u.name})`);
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
