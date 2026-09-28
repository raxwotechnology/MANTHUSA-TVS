require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

// Earlier schema definitions treated ObjectId references as Mixed, so some
// records contain 24-character hex strings instead of BSON ObjectIds.
const referenceFields = {
  aftersales: ['sale', 'customer'],
  auditlogs: ['user'],
  cashtransactions: ['referenceId'],
  commissions: ['salesperson', 'sale'],
  complaints: ['customer', 'vehicle', 'sale', 'assignedStaff'],
  discountrequests: ['quotation', 'sale', 'requestedBy', 'approvedBy'],
  expenses: ['category', 'vehicle', 'supplier', 'branch'],
  followups: ['customer', 'vehicle', 'lead'],
  installmentagreements: ['sale', 'customer'],
  installments: ['agreement'],
  leadactivities: ['lead', 'performedBy'],
  leads: ['customer', 'interestedVehicle', 'assignedStaff'],
  notifications: ['recipient'],
  payments: ['sale', 'customer'],
  permissions: ['role'],
  quotations: ['customer', 'vehicle', 'salesperson'],
  refunds: ['customer', 'sale', 'reservation'],
  reservations: ['customer', 'vehicle', 'salesperson'],
  sales: ['customer', 'vehicle', 'salesperson', 'branch'],
  salestargets: ['salesperson'],
  stockmovements: ['vehicle', 'fromBranch', 'toBranch', 'updatedBy'],
  storeddocuments: ['uploadedBy'],
  supplierpayments: ['supplier', 'purchase'],
  testdrives: ['customer', 'vehicle', 'salesperson'],
  users: ['role', 'branch'],
  vehiclehandovers: ['sale', 'vehicle', 'customer'],
  vehicleinspections: ['vehicle', 'inspector'],
  vehiclepurchases: ['vehicle', 'supplier'],
  vehicletransfers: ['vehicle', 'fromBranch', 'toBranch'],
  vehicles: ['location', 'branch'],
};

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/salesplus');
  const db = mongoose.connection.db;
  const existing = new Set((await db.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name));
  for (const [collectionName, fields] of Object.entries(referenceFields)) {
    if (!existing.has(collectionName)) continue;
    const collection = db.collection(collectionName);
    for (const field of fields) {
      let operations = [];
      let converted = 0;
      const cursor = collection.find({ [field]: { $type: 'string' } }, { projection: { _id: 1, [field]: 1 } });
      for await (const doc of cursor) {
        const value = doc[field];
        if (!/^[a-f\d]{24}$/i.test(value)) continue;
        operations.push({ updateOne: { filter: { _id: doc._id, [field]: value }, update: { $set: { [field]: new mongoose.Types.ObjectId(value) } } } });
        if (operations.length === 500) {
          const result = await collection.bulkWrite(operations, { ordered: false });
          converted += result.modifiedCount;
          operations = [];
        }
      }
      if (operations.length) converted += (await collection.bulkWrite(operations, { ordered: false })).modifiedCount;
      if (converted) console.log(`${collectionName}.${field}: converted ${converted} reference(s)`);
    }
  }
  console.log('Reference ID migration complete. Safe to rerun.');
}

migrate().catch((error) => {
  console.error('Reference ID migration failed:', error.message);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
