import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

/**
 * Bootstrap only system roles and one administrator whose credentials are
 * supplied by the operator. Dealership records are always entered in the app.
 * This script refuses to run against a database that already contains data.
 */
async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/salesplus';
  const adminName = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error('Set BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD before seeding.');
  }
  if (adminPassword.length < 12) {
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters long.');
  }

  await mongoose.connect(mongoUri);
  try {
    const db = mongoose.connection.db!;
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      if (await db.collection(collection.name).estimatedDocumentCount()) {
        throw new Error(`Database already contains data (${collection.name}); refusing to seed.`);
      }
    }

    const now = new Date();
    const roles = db.collection('roles');
    const adminRole = await roles.insertOne({ name: 'Admin / Owner', description: 'Full system control', createdAt: now, updatedAt: now });
    await roles.insertMany([
      { name: 'Sales & Operations', description: 'Daily sales, CRM, and vehicle operations', createdAt: now, updatedAt: now },
      { name: 'Accountant / Finance Staff', description: 'Financial operations, payments, and cash flow', createdAt: now, updatedAt: now },
    ]);

    await db.collection('users').insertOne({
      name: adminName,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: adminRole.insertedId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    console.log('System roles and configured administrator created. No sample dealership records were added.');
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error) => {
  console.error('Bootstrap failed:', error.message);
  process.exitCode = 1;
  void mongoose.disconnect();
});
