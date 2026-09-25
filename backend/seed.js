const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/salesplus');

  const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
  }, { collection: 'roles' });
  const Role = mongoose.model('Role', roleSchema);

  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    role: mongoose.Schema.Types.ObjectId,
    isActive: Boolean
  }, { collection: 'users' });
  const User = mongoose.model('User', userSchema);

  console.log('Cleaning up old users and roles...');
  await User.deleteMany({});
  await Role.deleteMany({});

  console.log('Creating roles...');
  const adminRole = await Role.create({ name: 'Admin / Owner', description: 'Full system control' });
  const salesRole = await Role.create({ name: 'Sales & Operations', description: 'Handles daily dealership operations' });
  const financeRole = await Role.create({ name: 'Accountant / Finance Staff', description: 'Handles financial operations' });

  console.log('Creating admin user...');
  const passwordHash = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'Admin User',
    email: 'admin@salesplus.com',
    passwordHash,
    role: adminRole._id,
    isActive: true
  });

  console.log('Seeding complete.');
  process.exit(0);
}
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
