import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/salesplus';
  console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB!');

  const db = mongoose.connection;

  // Never erase a dealership database as part of seeding. This seed is intended
  // only for a fresh development database; existing data is preserved.
  const existingCollections = await db.db!.listCollections().toArray();
  for (const collection of existingCollections) {
    if (await db.db!.collection(collection.name).estimatedDocumentCount()) {
      throw new Error(`Database already contains data (${collection.name}); seed only an empty development database.`);
    }
  }

  // Roles
  const rolesCol = db.collection('roles');
  const adminRoleRes = await rolesCol.insertOne({ name: 'Admin / Owner', description: 'Full system control', createdAt: new Date(), updatedAt: new Date() });
  const salesRoleRes = await rolesCol.insertOne({ name: 'Sales & Operations', description: 'Daily sales, CRM, and vehicle operations', createdAt: new Date(), updatedAt: new Date() });
  const accountantRoleRes = await rolesCol.insertOne({ name: 'Accountant / Finance Staff', description: 'Financial operations, payments, cash flow', createdAt: new Date(), updatedAt: new Date() });

  // Passwords
  const adminPass = await bcrypt.hash('admin123', 10);
  const exPass = await bcrypt.hash('ex123', 10);
  const accPass = await bcrypt.hash('accountant123', 10);

  // Users
  const usersCol = db.collection('users');
  await usersCol.insertMany([
    {
      name: 'Saman Kumara',
      email: 'admin@salesplus.com',
      passwordHash: adminPass,
      role: adminRoleRes.insertedId,
      phone: '0771234567',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Kasun Fernando',
      email: 'executive@salesplus.com',
      passwordHash: exPass,
      role: salesRoleRes.insertedId,
      phone: '0773456789',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Dilini Silva',
      email: 'accountant@salesplus.com',
      passwordHash: accPass,
      role: accountantRoleRes.insertedId,
      phone: '0774567890',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  // Branches
  const branchesCol = db.collection('branches');
  const b1 = await branchesCol.insertOne({ name: 'Colombo Head Office', city: 'Colombo', address: 'No 45, Baseline Road, Colombo 09', phone: '0112345678', createdAt: new Date() });
  const b2 = await branchesCol.insertOne({ name: 'Kandy Branch', city: 'Kandy', address: 'No 12, William Gopallawa Mawatha, Kandy', phone: '0812345678', createdAt: new Date() });
  const b3 = await branchesCol.insertOne({ name: 'Kurunegala Branch', city: 'Kurunegala', address: 'No 88, Dambulla Road, Kurunegala', phone: '0372345678', createdAt: new Date() });
  const b4 = await branchesCol.insertOne({ name: 'Galle Branch', city: 'Galle', address: 'No 10, Matara Road, Galle', phone: '0912345678', createdAt: new Date() });

  // Vehicles
  const vehiclesCol = db.collection('vehicles');
  const v1 = await vehiclesCol.insertOne({
    stockNumber: 'STK-2026-001',
    registrationNumber: 'CAB-8912',
    make: 'Toyota',
    model: 'Premio',
    variant: 'F EX Package',
    year: 2019,
    manufacturingYear: 2019,
    registeredYear: 2020,
    condition: 'Used',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    driveType: '2WD',
    engineCapacity: 1500,
    engineNumber: '1NZ-7892341',
    chassisNumber: 'NZT260-3184920',
    mileage: 45000,
    color: 'Pearl White',
    purchasePrice: 11500000,
    importCost: 0,
    transportCost: 45000,
    repairCost: 85000,
    detailingCost: 25000,
    registrationCost: 15000,
    insuranceCost: 65000,
    advertisementCost: 15000,
    otherCosts: 10000,
    totalInvestment: 11760000,
    sellingPrice: 13500000,
    minimumSellingPrice: 13200000,
    expectedProfit: 1740000,
    status: 'Available',
    branch: b1.insertedId,
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000'],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const v2 = await vehiclesCol.insertOne({
    stockNumber: 'STK-2026-002',
    registrationNumber: 'CBH-4412',
    make: 'Honda',
    model: 'Vezel',
    variant: 'Z Sensing',
    year: 2018,
    manufacturingYear: 2018,
    registeredYear: 2019,
    condition: 'Used',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    driveType: '2WD',
    engineCapacity: 1500,
    engineNumber: 'LEB-992312',
    chassisNumber: 'RU3-1304921',
    mileage: 58000,
    color: 'Black Metallic',
    purchasePrice: 9200000,
    transportCost: 35000,
    repairCost: 120000,
    detailingCost: 30000,
    totalInvestment: 9385000,
    sellingPrice: 10800000,
    minimumSellingPrice: 10500000,
    expectedProfit: 1415000,
    status: 'Available',
    branch: b1.insertedId,
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000'],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const v3 = await vehiclesCol.insertOne({
    stockNumber: 'STK-2026-003',
    registrationNumber: 'CBA-1102',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    variant: 'C200 AMG Line',
    year: 2021,
    manufacturingYear: 2021,
    registeredYear: 2021,
    condition: 'Used',
    fuelType: 'Petrol',
    transmission: 'Automatic 9G-Tronic',
    driveType: 'RWD',
    engineCapacity: 1500,
    engineNumber: '264-915029',
    chassisNumber: 'WDD2050772R1829',
    mileage: 28000,
    color: 'Obsidian Black',
    purchasePrice: 24000000,
    repairCost: 150000,
    detailingCost: 50000,
    totalInvestment: 24200000,
    sellingPrice: 28500000,
    minimumSellingPrice: 28000000,
    expectedProfit: 4300000,
    status: 'Reserved',
    branch: b2.insertedId,
    images: ['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000'],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const v4 = await vehiclesCol.insertOne({
    stockNumber: 'STK-2026-004',
    registrationNumber: 'WP KY-8899',
    make: 'Nissan',
    model: 'X-Trail',
    variant: '20X Hybrid',
    year: 2017,
    manufacturingYear: 2017,
    registeredYear: 2018,
    condition: 'Used',
    fuelType: 'Hybrid',
    transmission: 'CVT',
    driveType: '4WD',
    engineCapacity: 2000,
    engineNumber: 'MR20-881923',
    chassisNumber: 'HNT32-029481',
    mileage: 72000,
    color: 'Red Metallic',
    purchasePrice: 8500000,
    repairCost: 200000,
    totalInvestment: 8700000,
    sellingPrice: 9950000,
    status: 'Sold',
    branch: b1.insertedId,
    images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000'],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const v5 = await vehiclesCol.insertOne({
    stockNumber: 'STK-2026-005',
    registrationNumber: 'CBE-9011',
    make: 'Toyota',
    model: 'Raize',
    variant: 'Z Turbo',
    year: 2020,
    manufacturingYear: 2020,
    registeredYear: 2021,
    condition: 'Used',
    fuelType: 'Petrol',
    transmission: 'CVT',
    driveType: '2WD',
    engineCapacity: 1000,
    engineNumber: '1KR-990182',
    chassisNumber: 'A200A-008192',
    mileage: 32000,
    color: 'Turquoise Black',
    purchasePrice: 8200000,
    totalInvestment: 8250000,
    sellingPrice: 9400000,
    status: 'Under Inspection',
    branch: b3.insertedId,
    images: ['https://images.unsplash.com/photo-1541348263662-e082662d82da?q=80&w=1000'],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Suppliers
  const suppliersCol = db.collection('suppliers');
  await suppliersCol.insertOne({
    supplierId: 'SUP-001',
    supplierName: 'Lanka Auto Importers Pvt Ltd',
    supplierType: 'Importer',
    contactPerson: 'Sunil Shantha',
    phone: '0115566778',
    email: 'info@lankaautoimport.lk',
    address: 'No 100, Kandy Road, Kelaniya',
    outstandingBalance: 4500000,
    createdAt: new Date()
  });

  // Customers
  const customersCol = db.collection('customers');
  const cust1 = await customersCol.insertOne({
    customerId: 'CUST-001',
    fullName: 'Kamal Gunaratne',
    nicPassport: '841920391V',
    phone: '0779988776',
    email: 'kamal.g@gmail.com',
    address: 'No 14, Rajagiriya Road, Rajagiriya',
    city: 'Colombo',
    occupation: 'Software Engineer',
    customerType: 'Individual',
    createdAt: new Date()
  });

  const cust2 = await customersCol.insertOne({
    customerId: 'CUST-002',
    fullName: 'Blue Star Logistics Ltd',
    nicPassport: 'PV-991823',
    phone: '0114433221',
    email: 'contact@bluestarlogistics.com',
    address: 'No 80, D.R. Wijewardena Mawatha, Colombo 10',
    city: 'Colombo',
    occupation: 'Logistics',
    customerType: 'Corporate',
    createdAt: new Date()
  });

  // Leads
  const leadsCol = db.collection('leads');
  await leadsCol.insertOne({
    leadId: 'LEAD-001',
    customer: cust1.insertedId,
    interestedVehicle: v1.insertedId,
    source: 'Website',
    budget: 13500000,
    expectedPurchaseDate: new Date(),
    status: 'Quotation',
    priority: 'High',
    createdAt: new Date()
  });

  // Test Drives
  const testDrivesCol = db.collection('testdrives');
  await testDrivesCol.insertOne({
    testDriveId: 'TD-001',
    customer: cust1.insertedId,
    vehicle: v1.insertedId,
    date: new Date(),
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    drivingLicenseNo: 'B8910293',
    contactPhone: '0779988776',
    status: 'Completed',
    feedback: 'Customer loved the engine performance.',
    createdAt: new Date()
  });

  // Quotations
  const quotationsCol = db.collection('quotations');
  await quotationsCol.insertOne({
    quotationNumber: 'QT-2026-001',
    customer: cust1.insertedId,
    vehicle: v1.insertedId,
    vehiclePrice: 13500000,
    discount: 100000,
    additionalCharges: 25000,
    totalAmount: 13425000,
    advancePayment: 500000,
    balanceAmount: 12925000,
    validUntil: new Date(Date.now() + 7*24*60*60*1000),
    status: 'Active',
    createdAt: new Date()
  });

  // Reservations
  const reservationsCol = db.collection('reservations');
  await reservationsCol.insertOne({
    reservationId: 'RES-2026-001',
    customer: cust1.insertedId,
    vehicle: v3.insertedId,
    reservationDate: new Date(),
    expiryDate: new Date(Date.now() + 5*24*60*60*1000),
    reservationAmount: 500000,
    paymentMethod: 'Bank Transfer',
    notes: 'Customer deposited 500k to reserve Mercedes C200.',
    status: 'Active',
    createdAt: new Date()
  });

  // Sales
  const salesCol = db.collection('sales');
  const sale1 = await salesCol.insertOne({
    invoiceNumber: 'INV-2026-001',
    saleDate: new Date(),
    customer: cust2.insertedId,
    vehicle: v4.insertedId,
    vehiclePrice: 9950000,
    discount: 50000,
    additionalCharges: 15000,
    finalAmount: 9915000,
    paidAmount: 9915000,
    balance: 0,
    paymentMethod: 'Bank Transfer',
    saleStatus: 'Completed',
    createdAt: new Date()
  });

  // Payments
  const paymentsCol = db.collection('payments');
  await paymentsCol.insertOne({
    paymentId: 'PAY-2026-001',
    saleId: sale1.insertedId,
    customer: cust2.insertedId,
    amount: 9915000,
    paymentDate: new Date(),
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'TXN-991823910',
    receiptNumber: 'RCP-001',
    notes: 'Full payment for Nissan X-Trail',
    createdAt: new Date()
  });

  // Cash Transactions
  const cashTxCol = db.collection('cashtransactions');
  await cashTxCol.insertMany([
    {
      transactionId: 'CTX-001',
      transactionType: 'IN',
      category: 'Customer Payment',
      amount: 9915000,
      transactionDate: new Date(),
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'RCP-001',
      description: 'Full payment received for Nissan X-Trail sale (INV-2026-001)',
      createdAt: new Date()
    },
    {
      transactionId: 'CTX-002',
      transactionType: 'OUT',
      category: 'Vehicle Repair',
      amount: 120000,
      transactionDate: new Date(),
      paymentMethod: 'Cash',
      referenceNumber: 'VCH-881',
      description: 'Paid for Honda Vezel detailing & repair',
      createdAt: new Date()
    }
  ]);

  // Expenses
  const expCatCol = db.collection('expensecategories');
  const cat1 = await expCatCol.insertOne({ name: 'Vehicle Repair & Detailing', description: 'Repairs' });

  const expensesCol = db.collection('expenses');
  await expensesCol.insertOne({
    expenseId: 'EXP-001',
    category: cat1.insertedId,
    amount: 120000,
    date: new Date(),
    description: 'Brake pads replacement and full exterior detailing for Honda Vezel',
    vehicle: v2.insertedId,
    paymentMethod: 'Cash',
    receiptNumber: 'VCH-881',
    createdAt: new Date()
  });

  // Handovers
  const handoversCol = db.collection('vehiclehandovers');
  await handoversCol.insertOne({
    handoverId: 'HO-2026-001',
    sale: sale1.insertedId,
    customer: cust2.insertedId,
    vehicle: v4.insertedId,
    handoverDate: new Date(),
    checklist: {
      vehicleInspected: true,
      keys: true,
      spareKey: true,
      registrationDocs: true,
      insuranceDoc: true,
      serviceBook: true,
      userManual: true,
      accessories: true,
      numberPlates: true
    },
    status: 'Completed',
    customerSignature: 'Signed digitally',
    createdAt: new Date()
  });

  console.log('--- SEEDING COMPLETED SUCCESSFULLY! ---');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
