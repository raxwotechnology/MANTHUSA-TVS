import { tvsBikesCatalog } from './seed-bikes';
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

/**
 * TVS Motorcycle Sales Management System Seed Script
 * Bootstraps:
 * 1. Roles & Permissions
 * 2. Requested Staff Accounts & Demo Customer
 * 3. Dealership Branches
 * 4. Website Settings & CMS for TVS Motorcycles
 * 5. TVS Motorcycle Catalog (Models, Variants, Colors, Specifications, Images, Branch Stocks)
 * 6. Sample Customer Requests, Bookings, Quotations, Invoices, and Payments
 */
async function seed() {
  const mongoUri =
    process.env.MONGO_URI ||
'mongodb+srv://raxwotechnology_db_user:0Bk8CNwvPAenfq1y@cluster0.nziv5e7.mongodb.net/?retryWrites=true&w=majority';

  console.log('Connecting to database...');
  await mongoose.connect(mongoUri);

  try {
    const db = mongoose.connection.db!;
    const now = new Date();

    const rolesColl = db.collection('roles');
    const usersColl = db.collection('users');
    const customersColl = db.collection('customers');
    const branchesColl = db.collection('branches');
    const settingsColl = db.collection('settings');
    const vehiclesColl = db.collection('vehicles');
    const leadsColl = db.collection('leads');
    const reservationsColl = db.collection('reservations');
    const quotationsColl = db.collection('quotations');
    const salesColl = db.collection('sales');
    const paymentsColl = db.collection('payments');
    const cashColl = db.collection('cashtransactions');

    // 1. Roles
    const roleDefs = [
      { name: 'Admin / Owner', description: 'Full system control, administrative configuration, and financial approvals' },
      { name: 'Inventory Manager', description: 'TVS motorcycle stock management, variants, specifications, and branch transfers' },
      { name: 'Sales & Operations', description: 'Motorcycle showroom sales, customer requests, bookings, quotations, and handovers' },
      { name: 'Accountant / Finance Staff', description: 'Financial operations, TVS motorcycle invoices, customer payments, and receipts' },
      { name: 'Customer', description: 'Customer portal access for bike requests, bookings, quotations, and order tracking' },
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
    console.log('✓ Verified system roles.');

    // 2. Staff Accounts requested by user:
    const seedUsers = [
      // MANTHUSA TVS Official Accounts
      { name: 'MANTHUSA TVS Admin', email: 'admin@manthusatvs.lk', password: 'admin123', role: rolesMap['Admin / Owner'] },
      { name: 'Raxwo Admin', email: 'admin@raxwotechnology.com', password: 'admin123', role: rolesMap['Admin / Owner'] },
      { name: 'Dealership Manager', email: 'manager@manthusatvs.lk', password: 'manager123', role: rolesMap['Inventory Manager'] },
      { name: 'Sales Executive', email: 'sales@manthusatvs.lk', password: 'sales123', role: rolesMap['Sales & Operations'] },
      { name: 'Finance Accountant', email: 'accountant@manthusatvs.lk', password: 'accountant123', role: rolesMap['Accountant / Finance Staff'] },
      { name: 'Demo Customer', email: 'customer@manthusatvs.lk', password: 'customer123', role: rolesMap['Customer'] },
      // Previous Accounts
      { name: 'Admin', email: 'admin@salesplus.com', password: 'admin123', role: rolesMap['Admin / Owner'] },
      { name: 'Manager', email: 'manager@salesplus.com', password: 'manager123', role: rolesMap['Inventory Manager'] },
      { name: 'Sales Executive', email: 'executive@salesplus.com', password: 'ex123', role: rolesMap['Sales & Operations'] },
      { name: 'Accountant', email: 'accountant@salesplus.com', password: 'accountant123', role: rolesMap['Accountant / Finance Staff'] },
      { name: 'Sales Manager', email: 'manager2@salesplus.com', password: 'manag123', role: rolesMap['Sales & Operations'] },
    ];

    const usersMap: Record<string, any> = {};
    for (const u of seedUsers) {
      const passwordHash = await bcrypt.hash(u.password, 12);
      const res = await usersColl.findOneAndUpdate(
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
        { upsert: true, returnDocument: 'after' }
      );
      usersMap[u.email] = res?._id || (await usersColl.findOne({ email: u.email }))?._id;
      console.log(`✓ Seeded user: ${u.email} (${u.name})`);
    }

    // 3. Dealership Branches
    const branchDefs = [
      {
        name: 'MANTHUSA TVS - Weliweriya Showroom',
        location: '386, New Kandy Road, Weliweriya',
        contactNumber: '075-6000 310 / 076-5710 601',
        isActive: true,
      },
    ];

    await branchesColl.deleteMany({
      name: { $nin: branchDefs.map((branch) => branch.name) },
    });

    const branchesMap: Record<string, any> = {};
    for (const b of branchDefs) {
      let branch = await branchesColl.findOne({ name: b.name });
      if (!branch) {
        const result = await branchesColl.insertOne({ ...b, createdAt: now, updatedAt: now });
        branch = { _id: result.insertedId, ...b };
      }
      branchesMap[b.name] = branch._id;
    }
    const projectBranchId = branchesMap[branchDefs[0].name];
    const projectBranchName = branchDefs[0].name;
    branchesMap['Colombo Central Flagship Hub'] = projectBranchId;
    branchesMap['Kandy City TVS Showroom'] = projectBranchId;
    branchesMap['Galle Coastal TVS Center'] = projectBranchId;
    branchesMap['Kurunegala North TVS Sales Hub'] = projectBranchId;
    console.log('✓ Verified dealership branches.');

    // 4. Default Demo Customer
    let demoCustomer = await customersColl.findOne({ email: 'kamal.perera@gmail.com' });
    if (!demoCustomer) {
      const custRes = await customersColl.insertOne({
        fullName: 'Kamal Perera',
        email: 'kamal.perera@gmail.com',
        phone: '0771234567',
        nicOrPassport: '199245892V',
        address: 'No. 45, Temple Road, Maharagama',
        city: 'Colombo',
        customerType: 'Individual',
        createdAt: now,
        updatedAt: now,
      });
      demoCustomer = { _id: custRes.insertedId, fullName: 'Kamal Perera', email: 'kamal.perera@gmail.com', phone: '0771234567' };

      // Link to a customer user account
      const custPassHash = await bcrypt.hash('customer123', 12);
      await usersColl.updateOne(
        { email: 'customer@tvsdealership.lk' },
        {
          $set: {
            name: 'Kamal Perera',
            email: 'customer@tvsdealership.lk',
            passwordHash: custPassHash,
            role: rolesMap['Customer'],
            customerId: demoCustomer._id,
            isActive: true,
            emailVerified: true,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );
    }
    console.log('✓ Verified demo customer account.');

    // 5. Dealership Settings & CMS for TVS Motorcycle Dealership
    await settingsColl.deleteMany({});
    
    const settingsDocs = [
      {
        key: 'general',
        value: {
          dealershipName: 'MANTHUSA TVS',
          tagline: 'Official TVS Motorcycles & Scooters Dealership, Service & Genuine Parts',
          registrationNumber: 'TVS-LK-89214/2026',
          taxNumber: 'VAT-119284729-7000',
logoUrl: '/manthusa-logo.png',
          faviconUrl: '/favicon.ico',
          footerText: '© 2026 MANTHUSA TVS. All rights reserved. Official TVS Warranty & Genuine Spares.',
          defaultLanguage: 'en',
          currency: 'LKR',
          currencySymbol: 'Rs.',
        },
      },
      {
        key: 'contact',
        value: {
          address: '386, New Kandy Road, Weliweriya, Sri Lanka',
          city: 'Weliweriya',
          province: 'Western Province',
          postalCode: '11710',
          phone: '075-6000 310',
          hotline: '076-5710 601 / 070-6510 601',
          salesEmail: 'sales@manthusatvs.lk',
          supportEmail: 'service@manthusatvs.lk',
          openingHours: 'Mon - Sat: 8:30 AM - 6:30 PM (Sun: 9:00 AM - 2:00 PM)',
          googleMapsUrl: 'https://maps.google.com/?q=386+New+Kandy+Road+Weliweriya',
        },
      },
      {
        key: 'commerce',
        value: {
          currency: 'LKR',
          currencySymbol: 'Rs.',
          vatPercentage: 18,
          quotationValidityDays: 14,
          reservationHoldDays: 3,
          minDownpaymentPercentage: 20,
          invoicePrefix: 'TVS-INV-',
          quotationPrefix: 'TVS-QT-',
          agreementPrefix: 'TVS-AGR-',
          purchasePrefix: 'TVS-PUR-',
          allowDiscountsWithoutApproval: false,
          maxStaffDiscountPercentage: 5,
        },
      },
      {
        key: 'vehicles',
        value: {
          mileageUnit: 'km',
          defaultWarrantyMonths: 24,
          defaultWarrantyKm: 30000,
          defaultTestDriveDurationMinutes: 30,
          requireDrivingLicenseForTestDrive: true,
          inspectionChecklistItems: [
            'Engine Oil Level & Quality Check',
            'Front & Rear Brake System (Roto-Petal Disc/Drum)',
            'Tyre Pressure & Tread Depth Inspection',
            'Drive Chain Tension, Lubrication & Alignment',
            'Battery Voltage & Electrical Systems',
            'Clutch & Throttle Free Play Adjustment',
            'Headlamp Aim & All Signal Indicators',
            'SmartXonnect Bluetooth Console Connectivity',
            'Suspension — Telescopic Fork & Monoshock Health',
            'Chassis & Frame Structural Inspection',
            'PDI Road Test & Idle RPM Calibration',
            'Documentation & Warranty Registration Book',
          ],
        },
      },
      {
        key: 'leasing',
        value: {
          defaultLeasingTenorMonths: 36,
          defaultInterestRate: 14.5,
          minimumDownPaymentPercent: 20,
          preferredPartners: [
            'Commercial Bank of Ceylon',
            'Hatton National Bank (HNB)',
            'Sampath Bank PLC',
            'LOLC Finance',
            'Central Finance',
            'LB Finance',
          ],
          termsAndNotes: 'Motorcycle leasing facilities subject to credit appraisal and CBSL lending regulations.',
        },
      },
      {
        key: 'receiptDesigner',
        value: {
          invoiceHeader: 'TVS MOTORCYCLE SALES INVOICE & DELIVERY ORDER',
          quotationHeader: 'OFFICIAL TVS MOTORCYCLE SALES QUOTATION',
          bankName: 'Commercial Bank of Ceylon PLC',
          bankAccountName: 'MANTHUSA TVS',
          bankAccountNumber: '1000 4829 3819',
          bankBranch: 'Weliweriya Branch',
          bankSwift: 'CCEYLKAX',
          authorizedSignatory: 'Director / Showroom General Manager',
          termsConditions:
            '1. All TVS motorcycles undergo comprehensive Pre-Delivery Inspection (PDI) prior to handover.\n2. Reservation deposits are non-refundable after the reservation hold duration passes.\n3. Full settlement required before revenue license registration and bike delivery.\n4. Standard TVS manufacturer warranty terms apply as detailed in the service booklet.',
          footerNote: 'Thank you for choosing MANTHUSA TVS! Ride safe and enjoy every kilometre.',
        },
      },
      {
        key: 'templates',
        value: {
          quotationTemplate:
            'Dear {customer_name}, your official TVS motorcycle quotation for {motorcycle_name} of Rs. {price} is ready. Valid until {expiry_date}. For details, contact {sales_phone}.',
          reservationTemplate:
            'Dear {customer_name}, {motorcycle_name} has been successfully reserved for you until {expiry_date}. Reference ID: {ref_id}. Thank you for choosing {dealership_name}.',
          testDriveTemplate:
            'Dear {customer_name}, your TVS test ride for {motorcycle_name} is confirmed for {scheduled_date} at {dealership_address}. Please bring your riding license.',
          handoverTemplate:
            'Congratulations {customer_name}! Your TVS motorcycle {motorcycle_name} is scheduled for handover. We look forward to seeing you at {dealership_name}. Ride safe!',
          paymentReminderTemplate:
            'Dear {customer_name}, friendly reminder that installment payment of Rs. {amount} for {motorcycle_name} is due on {due_date}. Beneficiary: {bank_name} A/C {account_no}.',
        },
      },
      {
        key: 'social',
        value: {
          whatsapp: '+94756000310',
          facebook: 'https://facebook.com/manthusatvs',
          instagram: 'https://instagram.com/manthusatvs',
          youtube: 'https://youtube.com/@manthusatvs',
          website: 'https://manthusatvs.lk',
          tiktok: '',
        },
      },
      {
        key: 'system',
        value: {
          maintenanceMode: false,
          enablePublicInquiries: true,
          autoExpireReservations: true,
          notifyOnNewLead: true,
          notifyOnDiscountRequest: true,
          sessionTimeoutMinutes: 60,
          timeZone: 'Asia/Colombo (GMT+5:30)',
        },
      },
      {
        key: 'website',
        value: {
          announcement: {
            enabled: true,
            text: 'Special Season Offer: Get Free Registration, 2 Helmets & 3 Free Periodic Services on all TVS Apache & NTORQ bookings!',
            phone: '075-6000 310 / 076-5710 601',
            hours: 'Mon - Sat: 8:30 AM - 6:30 PM',
          },
          hero: {
            headline: 'ENGINEERED FOR THRILL. BUILT FOR EVERY RIDE.',
            subheadline: 'Experience the track-tested TVS Apache Racing series, high-tech connected NTORQ smart scooters, dependable commuter champions, and clean electric mobility.',
            ctaPrimaryText: 'Explore TVS Lineup',
            ctaPrimaryLink: '/bikes',
            ctaSecondaryText: 'Configure & Book Online',
            ctaSecondaryLink: '/configure',
            backgroundImage: '/images/hero-tvs-bikes.png',
          },
          sections: {
            showFeatured: true,
            showLatestArrivals: true,
            showCategories: true,
            showWhyUs: true,
            showHowItWorks: true,
            showFinancePromo: true,
            showTradeInPromo: false,
            showContact: true,
          },
          pages: {
            about: 'MANTHUSA TVS is an authorized TVS dealership in Weliweriya providing brand-new TVS motorcycles, scooters, certified maintenance, genuine spare parts, and low-rate financing.',
            finance: 'We offer low-rate motorcycle leasing and installment plans starting from 10% down payment with instant approval.',
            terms: 'All motorcycle bookings are held for up to 7 days upon reservation deposit confirmation.',
            privacy: 'We take customer confidentiality seriously and protect your personal data according to applicable privacy standards.',
          },
        },
      },
    ];

    for (const doc of settingsDocs) {
      await settingsColl.updateOne(
        { key: doc.key },
        { $set: { key: doc.key, value: doc.value, updatedAt: now }, $setOnInsert: { createdAt: now } },
        { upsert: true }
      );
    }
    console.log('✓ Seeded TVS dealership settings and CMS in key-value structure.');

    // 6. TVS 36 Motorcycles Catalog
    const colomboId = projectBranchId;
    const tvsBikes = tvsBikesCatalog.map((b) => ({
      ...b,
      branch: projectBranchId,
      location: projectBranchId,
      branchStock: [
        {
          branchId: projectBranchId,
          branchName: projectBranchName,
          quantity: 5,
          availableColors: [b.color],
        },
      ],
    }));

    const savedBikes: any[] = [];
    for (const bike of tvsBikes) {
      const res = await vehiclesColl.findOneAndUpdate(
        { stockNumber: bike.stockNumber },
        {
          $set: {
            ...bike,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true, returnDocument: 'after' }
      );
      const doc = res || (await vehiclesColl.findOne({ stockNumber: bike.stockNumber }));
      savedBikes.push(doc);
      console.log(`✓ Seeded TVS Motorcycle: ${bike.model} (${bike.stockNumber})`);
    }

    // 7. Seed Complete End-to-End Workflow Examples for Demo Customer:
    const apacheBike = savedBikes.find((b: any) => b.model?.includes('Apache RTR 160')) || savedBikes[0];
    const ntorqBike = savedBikes.find((b: any) => b.model?.includes('NTORQ')) || savedBikes[1];
    const jupiterBike = savedBikes.find((b: any) => b.model?.includes('Jupiter')) || savedBikes[2];

    // A. Request 1: Active In-Progress Booking & Quotation
    const req1Id = 'TVS-REQ-10024';
    let lead1 = await leadsColl.findOne({ leadId: req1Id });
    if (!lead1) {
      const lRes = await leadsColl.insertOne({
        leadId: req1Id,
        customer: demoCustomer._id,
        interestedVehicle: apacheBike._id,
        interestedVehicleText: 'TVS Apache RTR 160 4V Special Edition Disc (Matte Black)',
        modelName: 'Apache RTR 160 4V',
        variantName: 'Special Edition Disc',
        selectedColor: 'Matte Black',
        preferredBranch: colomboId,
        preferredBranchName: projectBranchName,
        source: 'Website Configurator',
        assignedStaff: usersMap['executive@salesplus.com'],
        budget: 1025000,
        inquiryType: 'Motorcycle Booking Request',
        inquiryMessage: 'Customer selected Matte Black color and wishes to apply for 3-year leasing.',
        status: 'Converted to Booking',
        priority: 'High',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      });
      lead1 = { _id: lRes.insertedId, leadId: req1Id };
    }

    // Booking 1 for Request 1
    const bk1Number = 'TVS-BK-88201';
    let booking1 = await reservationsColl.findOne({ bookingNumber: bk1Number });
    if (!booking1) {
      const bRes = await reservationsColl.insertOne({
        bookingNumber: bk1Number,
        reservationId: bk1Number,
        customer: demoCustomer._id,
        vehicle: apacheBike._id,
        modelName: 'Apache RTR 160 4V',
        variantName: 'Special Edition Disc',
        selectedColor: 'Matte Black',
        branch: colomboId,
        branchName: projectBranchName,
        salesperson: usersMap['executive@salesplus.com'],
        reservationDeposit: 25000,
        agreedPrice: 1025000,
        expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        isRefundable: true,
        status: 'Active',
        leadId: lead1._id,
        chassisNumber: apacheBike.chassisNumber,
        engineNumber: apacheBike.engineNumber,
        notes: 'Deposit paid at Colombo Flagship showroom. Customer requested official quotation.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      });
      booking1 = { _id: bRes.insertedId, bookingNumber: bk1Number };
      await leadsColl.updateOne({ _id: lead1._id }, { $set: { bookingId: booking1._id } });
    }

    // Quotation 1 for Booking 1 (Ready for Customer Review & Acceptance)
    const qt1Number = 'TVS-QT-44102';
    let quote1 = await quotationsColl.findOne({ quotationNumber: qt1Number });
    if (!quote1) {
      const qRes = await quotationsColl.insertOne({
        quotationNumber: qt1Number,
        customer: demoCustomer._id,
        vehicle: apacheBike._id,
        booking: booking1._id,
        salesperson: usersMap['executive@salesplus.com'],
        modelName: 'Apache RTR 160 4V',
        variantName: 'Special Edition Disc',
        selectedColor: 'Matte Black',
        branch: colomboId,
        branchName: projectBranchName,
        vehiclePrice: 1025000,
        discount: 25000,
        registrationFee: 18500,
        insuranceFee: 26500,
        otherCharges: 5000, // Helmet and crash guards
        totalAmount: 1050000,
        advancePayment: 25000,
        validUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        status: 'Sent', // Ready for customer to click "Accept" in customer portal!
        termsAndConditions: '1. Official TVS manufacturer warranty of 5 years or 70,000 km applies.\n2. Three free periodic services included at any authorized TVS center.\n3. Price includes RMV registration and comprehensive insurance.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      });
      quote1 = { _id: qRes.insertedId, quotationNumber: qt1Number };
    }

    // B. Completed Order (Accepted Quotation -> Invoice -> Paid in Full -> Ready for Delivery)
    const inv1Number = 'TVS-INV-77319';
    let sale1 = await salesColl.findOne({ invoiceNumber: inv1Number });
    if (!sale1) {
      const sRes = await salesColl.insertOne({
        invoiceNumber: inv1Number,
        salesContractNumber: 'TVS-CNT-22019',
        customer: demoCustomer._id,
        vehicle: ntorqBike._id,
        branch: colomboId,
        branchName: projectBranchName,
        salesperson: usersMap['executive@salesplus.com'],
        modelName: 'NTORQ 125',
        variantName: 'Race Edition XT (SmartXonnect)',
        selectedColor: 'Combat Red',
        chassisNumber: ntorqBike.chassisNumber,
        engineNumber: ntorqBike.engineNumber,
        vehiclePrice: 765000,
        discount: 15000,
        registrationFee: 16500,
        insuranceFee: 21500,
        additionalCharges: 4000,
        finalAmount: 792000,
        paidAmount: 792000,
        balance: 0,
        paymentMethod: 'Bank Transfer',
        status: 'Paid in Full',
        deliveryStatus: 'Ready for Delivery',
        saleDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: now,
      });
      sale1 = { _id: sRes.insertedId, invoiceNumber: inv1Number };

      // Record payments for sale 1
      const p1Number = 'TVS-RCP-99120';
      await paymentsColl.updateOne(
        { receiptNumber: p1Number },
        {
          $set: {
            sale: sale1._id,
            customer: demoCustomer._id,
            amount: 792000,
            paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            paymentMethod: 'Bank Transfer',
            referenceNumber: 'TXN-COMMERCIAL-998811',
            bank: 'Commercial Bank of Ceylon',
            receiptNumber: p1Number,
            notes: 'Full settlement for TVS NTORQ 125 Race Edition XT invoice.',
            status: 'Completed',
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );
    }

    console.log('✓ Seeded complete end-to-end TVS workflow records for customer portal testing.');
    console.log('\n======================================================');
    console.log('TVS MOTORCYCLE SALES MANAGEMENT SYSTEM SEED COMPLETED!');
    console.log('Official MANTHUSA TVS Credentials:');
    console.log('• Admin: admin@manthusatvs.lk / admin123');
    console.log('• Raxwo Admin: admin@raxwotechnology.com / admin123');
    console.log('• Manager: manager@manthusatvs.lk / manager123');
    console.log('• Sales Executive: sales@manthusatvs.lk / sales123');
    console.log('• Accountant: accountant@manthusatvs.lk / accountant123');
    console.log('• Demo Customer: customer@manthusatvs.lk / customer123');
    console.log('======================================================\n');
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error) => {
  console.error('Bootstrap failed:', error);
  process.exitCode = 1;
  void mongoose.disconnect();
});
