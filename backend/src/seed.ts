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
      {
        name: 'Kandy City TVS Showroom',
        location: 'No. 88, Peradeniya Road, Kandy',
        contactNumber: '+94 81 223 4500',
        isActive: true,
      },
      {
        name: 'Galle Coastal TVS Center',
        location: 'No. 215, Colombo Road, Galle',
        contactNumber: '+94 91 224 5600',
        isActive: true,
      },
      {
        name: 'Kurunegala North TVS Sales Hub',
        location: 'No. 54, Negombo Road, Kurunegala',
        contactNumber: '+94 37 228 9100',
        isActive: true,
      },
    ];

    const branchesMap: Record<string, any> = {};
    for (const b of branchDefs) {
      let branch = await branchesColl.findOne({ name: b.name });
      if (!branch) {
        const result = await branchesColl.insertOne({ ...b, createdAt: now, updatedAt: now });
        branch = { _id: result.insertedId, ...b };
      }
      branchesMap[b.name] = branch._id;
    }
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
            backgroundImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80',
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

    // 6. TVS Motorcycle Models
    const colomboId = branchesMap['Colombo Central Flagship Hub'];
    const kandyId = branchesMap['Kandy City TVS Showroom'];
    const galleId = branchesMap['Galle Coastal TVS Center'];
    const kurunegalaId = branchesMap['Kurunegala North TVS Sales Hub'];

    const tvsBikes = [
      {
        stockNumber: 'TVS-RTR160-01',
        make: 'TVS',
        model: 'Apache RTR 160 4V',
        variant: 'Special Edition Disc',
        category: 'Sport Motorcycles',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: '5-Speed Manual',
        engineCapacity: '159.7 cc',
        engineType: 'SI, 4-stroke, 4-valve, Oil cooled, Fuel Injection',
        maxPower: '17.55 PS @ 9250 rpm',
        maxTorque: '14.73 Nm @ 7250 rpm',
        coolingSystem: 'Oil Cooled',
        fuelSystem: 'RT-Fi (Race Tuned Fuel Injection)',
        startingSystem: 'Electric Start',
        topSpeed: '114 km/h',
        mileage: 45,
        fuelTankCapacity: '12 Litres',
        frontBrake: '270mm Roto Petal Disc',
        rearBrake: '200mm Roto Petal Disc',
        brakingSystem: 'Single Channel Super-Moto ABS',
        frontSuspension: 'Telescopic Fork with Hydraulic Dampers',
        rearSuspension: 'Mono Tube - Inverted Gas-filled Shox (MIG)',
        wheelType: '17-inch Alloy with Red Rim Stripes',
        tyreDimensions: 'Front: 90/90-17, Rear: 130/70-17 Tubeless Radial',
        groundClearance: '180 mm',
        seatHeight: '800 mm',
        kerbWeight: '146 kg',
        smartFeatures: [
          'SmartXonnect Bluetooth Console',
          'Urban, Rain and Sport Riding Modes',
          'Glide Through Traffic (GTT) Technology',
          'Signature LED Headlamp with DRL',
          'Adjustable Clutch and Brake Levers',
        ],
        color: 'Matte Black',
        variants: [
          { name: 'Drum', code: 'RTR160-DRUM', price: 925000, colors: ['Racing Red', 'Metallic Blue'], isDefault: false },
          { name: 'Single Disc', code: 'RTR160-SD', price: 965000, colors: ['Racing Red', 'Knight Blue', 'Matte Black'], isDefault: false },
          { name: 'Special Edition Disc', code: 'RTR160-SE', price: 1025000, colors: ['Matte Black', 'Pearl White'], isDefault: true },
        ],
        colors: [
          { name: 'Matte Black', code: 'MBK', hex: '#1C1C1E', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Racing Red', code: 'RRD', hex: '#DC2626', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Knight Blue', code: 'KBL', hex: '#1E3A8A', imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Pearl White', code: 'PWH', hex: '#F8FAFC', imageUrl: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 6, availableColors: ['Matte Black', 'Racing Red', 'Knight Blue'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 3, availableColors: ['Matte Black', 'Racing Red'] },
          { branchId: galleId, branchName: 'Galle Coastal TVS Center', quantity: 2, availableColors: ['Knight Blue'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 4, availableColors: ['Racing Red', 'Matte Black'] },
        ],
        sellingPrice: 1025000,
        purchasePrice: 850000,
        totalInvestment: 875000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: 'The pinnacle of 160cc racing performance with SmartXonnect and 3 ride modes.',
        description: 'Born from 40 years of racing pedigree on TVS Racing circuits, the TVS Apache RTR 160 4V features a 4-valve oil-cooled race tuned engine, GTT traffic assist, radial tyres and Bluetooth telemetry navigation.',
        images: [
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625CK45N2A89012',
        engineNumber: 'RTR4V9812034',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-RTR200-01',
        make: 'TVS',
        model: 'Apache RTR 200 4V',
        variant: 'Dual Channel ABS with Ride Modes',
        category: 'Sport Motorcycles',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: '5-Speed with RT-Slipper Clutch',
        engineCapacity: '197.75 cc',
        engineType: 'SI, 4-stroke, 4-valve, Oil-cooled with Ram-Air Assist',
        maxPower: '20.82 PS @ 9000 rpm (Sport Mode)',
        maxTorque: '17.25 Nm @ 7800 rpm',
        coolingSystem: 'Oil Cooled with Ram Air Assist',
        fuelSystem: 'Bosch Closed Loop Fuel Injection',
        startingSystem: 'Electric Start',
        topSpeed: '127 km/h',
        mileage: 40,
        fuelTankCapacity: '12 Litres',
        frontBrake: '270mm Wave Disc with Dual Channel ABS',
        rearBrake: '240mm Wave Disc',
        brakingSystem: 'Dual Channel Super-Moto ABS',
        frontSuspension: 'Showa Preload Adjustable Telescopic Forks',
        rearSuspension: 'Showa Monoshock with Preload Adjuster',
        wheelType: '17-inch Eurogrip Protorq SR Racing Radial',
        tyreDimensions: 'Front: 90/90-17, Rear: 130/70-R17 Radial',
        groundClearance: '180 mm',
        seatHeight: '800 mm',
        kerbWeight: '152 kg',
        smartFeatures: [
          '3 Ride Modes (Sport, Urban, Rain)',
          'Race Tuned Showa Adjustable Suspension',
          'RT Slipper Clutch',
          'SmartXonnect with Lean Angle Mode',
          'High Intensity Aggressive Twin LED DRL',
        ],
        color: 'Gloss Black',
        variants: [
          { name: 'Single Channel ABS', code: 'RTR200-SABS', price: 1195000, colors: ['Gloss Black', 'Pearl White'], isDefault: false },
          { name: 'Dual Channel ABS with Ride Modes', code: 'RTR200-DABS', price: 1285000, colors: ['Gloss Black', 'Matte Blue', 'Pearl White'], isDefault: true },
        ],
        colors: [
          { name: 'Gloss Black', code: 'GBK', hex: '#0F172A', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Matte Blue', code: 'MBL', hex: '#2563EB', imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Pearl White', code: 'PWH', hex: '#FFFFFF', imageUrl: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 4, availableColors: ['Gloss Black', 'Matte Blue'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 2, availableColors: ['Gloss Black'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 2, availableColors: ['Pearl White'] },
        ],
        sellingPrice: 1285000,
        purchasePrice: 1080000,
        totalInvestment: 1110000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: 'Unmatched 200cc racing beast with Showa adjustable forks and race telemetry.',
        description: 'Engineered for true track enthusiasts, the Apache RTR 200 4V features segment-first Showa adjustable suspension, multiple riding modes, and race tuned slipper clutch.',
        images: [
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625CK45N2B99124',
        engineNumber: 'RTR200N78213',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-RR310-01',
        make: 'TVS',
        model: 'Apache RR 310',
        variant: 'Race Replica BTO',
        category: 'Premium Motorcycles',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: '6-Speed with Bi-Directional Quickshifter',
        engineCapacity: '312.2 cc',
        engineType: 'SI, 4-stroke, 4-valve, Liquid-cooled, Reverse Inclined DOHC',
        maxPower: '34 PS @ 9700 rpm (Track/Sport Mode)',
        maxTorque: '27.3 Nm @ 7700 rpm',
        coolingSystem: 'Liquid Cooled',
        fuelSystem: 'Bosch Closed Loop Electronic Fuel Injection with Ride-by-Wire',
        startingSystem: 'Electric Start',
        topSpeed: '160 km/h',
        mileage: 34,
        fuelTankCapacity: '11 Litres',
        frontBrake: '300mm Petal Disc with ByBre Radial Caliper',
        rearBrake: '240mm Petal Disc',
        brakingSystem: 'Dual Channel ABS with Cornering ABS',
        frontSuspension: 'KYB Inverted Cartridge Telescopic Fork (USD)',
        rearSuspension: 'KYB Monotube Floating Piston Gas Assist Shock',
        wheelType: '17-inch Cast Alloy with Michelin Road 5 Tyres',
        tyreDimensions: 'Front: 110/70-ZR17, Rear: 150/60-ZR17 W-Rated',
        groundClearance: '180 mm',
        seatHeight: '810 mm',
        kerbWeight: '174 kg',
        smartFeatures: [
          '5-inch Vertical TFT Multifunction Race Display',
          '4 Riding Modes: Track, Sport, Urban, Rain',
          'Ride-by-Wire Electronic Throttle Control',
          'Bi-Directional Quickshifter with Auto-Blipper',
          'Aerodynamic Bi-LED Twin Projector Headlamps',
        ],
        color: 'Racing Red',
        variants: [
          { name: 'Standard Edition', code: 'RR310-STD', price: 2350000, colors: ['Titanium Black', 'Racing Red'], isDefault: false },
          { name: 'Race Replica BTO', code: 'RR310-BTO', price: 2490000, colors: ['Racing Red', 'Titanium Black'], isDefault: true },
        ],
        colors: [
          { name: 'Racing Red', code: 'RRD', hex: '#DC2626', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Titanium Black', code: 'TBK', hex: '#1E293B', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 2, availableColors: ['Racing Red', 'Titanium Black'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 1, availableColors: ['Racing Red'] },
        ],
        sellingPrice: 2490000,
        purchasePrice: 2150000,
        totalInvestment: 2200000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: 'Flagship super-sport motorcycle co-developed with BMW Motorrad with 34 PS power.',
        description: 'The pinnacle of TVS Racing technology. Featuring a reverse-inclined 312cc DOHC engine, aerodynamic shark design bodywork, 5-inch TFT console and multi-mode electronic throttle.',
        images: [
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625RR310N890123',
        engineNumber: 'RR312N998811',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-NTORQ-01',
        make: 'TVS',
        model: 'NTORQ 125',
        variant: 'Race Edition XT',
        category: 'Scooters',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: 'CVT Automatic',
        engineCapacity: '124.8 cc',
        engineType: 'Single Cylinder, 4-stroke, SI, 3-valve, Air-cooled, Fuel Injection',
        maxPower: '9.38 PS @ 7000 rpm',
        maxTorque: '10.5 Nm @ 5500 rpm',
        coolingSystem: 'Forced Air Cooled',
        fuelSystem: 'RT-Fi (Race Tuned Fuel Injection)',
        startingSystem: 'Electric and Kick Start',
        topSpeed: '95 km/h',
        mileage: 50,
        fuelTankCapacity: '5.8 Litres',
        frontBrake: '220mm Roto Petal Disc',
        rearBrake: '130mm Drum',
        brakingSystem: 'Synchronized Braking Technology (SBT)',
        frontSuspension: 'Telescopic Suspension with Hydraulic Dampers',
        rearSuspension: 'Coil Spring with Hydraulic Dampers',
        wheelType: '12-inch Diamond Cut Alloy Wheels',
        tyreDimensions: 'Front: 100/80-12, Rear: 110/80-12 Tubeless',
        groundClearance: '155 mm',
        seatHeight: '770 mm',
        kerbWeight: '118 kg',
        smartFeatures: [
          'SmartXonnect Hybrid Dual Screen Color TFT Console',
          'Voice Assist & Turn-by-Turn GPS Navigation',
          'Caller ID, SMS & WhatsApp Notification Alerts',
          'Stealth Aircraft Inspired Aerodynamic Body Styling',
          'External Fuel Filling Cap with One-Key Operation',
          'Underseat USB Phone Charger & LED Boot Light',
        ],
        color: 'Combat Red',
        variants: [
          { name: 'Standard Disc', code: 'NTORQ-STD', price: 685000, colors: ['Matte Yellow', 'Combat Red'], isDefault: false },
          { name: 'Race Edition', code: 'NTORQ-RACE', price: 725000, colors: ['Combat Red', 'Stealth Black', 'Marine Blue'], isDefault: false },
          { name: 'Race Edition XT (SmartXonnect)', code: 'NTORQ-XT', price: 765000, colors: ['Neon Green', 'Combat Red', 'Stealth Black'], isDefault: true },
        ],
        colors: [
          { name: 'Combat Red', code: 'CRD', hex: '#E11D48', imageUrl: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Stealth Black', code: 'SBK', hex: '#18181B', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Marine Blue', code: 'MBL', hex: '#0284C7', imageUrl: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Neon Green', code: 'NGR', hex: '#84CC16', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 10, availableColors: ['Combat Red', 'Stealth Black', 'Marine Blue'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 6, availableColors: ['Combat Red', 'Stealth Black'] },
          { branchId: galleId, branchName: 'Galle Coastal TVS Center', quantity: 4, availableColors: ['Marine Blue', 'Combat Red'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 5, availableColors: ['Combat Red', 'Stealth Black'] },
        ],
        sellingPrice: 765000,
        purchasePrice: 620000,
        totalInvestment: 640000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: "Sri Lanka's #1 sporty smart scooter with Bluetooth, Voice Assist and 3-valve engine.",
        description: 'Designed for youth and daily commuters seeking sporty styling and connectivity, the TVS NTORQ 125 delivers brisk acceleration, signature exhaust sound, and class-leading SmartXonnect features.',
        images: [
          'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625NT125N778899',
        engineNumber: 'NT125Q445566',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-JUPITER-01',
        make: 'TVS',
        model: 'Jupiter 125',
        variant: 'SmartXonnect Disc',
        category: 'Scooters',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: 'CVT Automatic',
        engineCapacity: '124.8 cc',
        engineType: 'Single Cylinder, 4-stroke, Air Cooled, ET-Fi',
        maxPower: '8.15 PS @ 6500 rpm',
        maxTorque: '10.5 Nm @ 4500 rpm',
        coolingSystem: 'Air Cooled',
        fuelSystem: 'ET-Fi (Eco Thrust Fuel Injection)',
        startingSystem: 'Silent i-Touch Electric Start',
        topSpeed: '88 km/h',
        mileage: 58,
        fuelTankCapacity: '5.1 Litres Front External',
        frontBrake: '220mm Disc',
        rearBrake: '130mm Drum',
        brakingSystem: 'Synchronized Braking Technology (SBT)',
        frontSuspension: 'Telescopic Hydraulic Suspension',
        rearSuspension: 'Monotube Inverted Gas-filled Shox (3-step adjustable)',
        wheelType: '12-inch Premium Alloy Wheels',
        tyreDimensions: 'Front: 90/90-12, Rear: 90/90-12 Tubeless',
        groundClearance: '163 mm',
        seatHeight: '765 mm',
        kerbWeight: '108 kg',
        smartFeatures: [
          'Largest in Segment 33-Litre Dual Full-Face Helmet Storage',
          'Front Fuel Fill Port - No need to dismount or lift the seat',
          'IntelliGO Intelligent Stop-Start Fuel Saver',
          'SmartXonnect Bluetooth with Live Mileage & Weather',
          'All-in-One Multifunction Ignition Lock',
        ],
        color: 'Dawn Orange',
        variants: [
          { name: 'Drum Alloy', code: 'JUP125-DRUM', price: 635000, colors: ['Titanium Grey', 'Pristine White'], isDefault: false },
          { name: 'Disc Alloy', code: 'JUP125-DISC', price: 675000, colors: ['Dawn Orange', 'Indiblue', 'Titanium Grey'], isDefault: false },
          { name: 'SmartXonnect Disc', code: 'JUP125-SX', price: 715000, colors: ['Dawn Orange', 'Indiblue', 'Pristine White'], isDefault: true },
        ],
        colors: [
          { name: 'Dawn Orange', code: 'DOR', hex: '#EA580C', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Indiblue', code: 'IBL', hex: '#1D4ED8', imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Titanium Grey', code: 'TGY', hex: '#64748B', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Pristine White', code: 'PWH', hex: '#F1F5F9', imageUrl: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 8, availableColors: ['Dawn Orange', 'Indiblue'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 5, availableColors: ['Titanium Grey', 'Dawn Orange'] },
          { branchId: galleId, branchName: 'Galle Coastal TVS Center', quantity: 3, availableColors: ['Pristine White'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 6, availableColors: ['Dawn Orange', 'Indiblue'] },
        ],
        sellingPrice: 715000,
        purchasePrice: 590000,
        totalInvestment: 610000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: 'The ultimate family scooter with massive 33L underseat storage and front fuel fill.',
        description: 'TVS Jupiter 125 redefines convenience and fuel efficiency. It features the largest underseat boot capable of holding two full-face helmets, silent start, and front-apron fuel filler.',
        images: [
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625JUP125N123456',
        engineNumber: 'JUP125E99281',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-RAIDER-01',
        make: 'TVS',
        model: 'Raider 125',
        variant: 'SmartXonnect TFT Edition',
        category: 'Commuter Motorcycles',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: '5-Speed Manual',
        engineCapacity: '124.8 cc',
        engineType: 'Single Cylinder, 4-stroke, 3-valve, Air & Oil-cooled',
        maxPower: '11.38 PS @ 7500 rpm',
        maxTorque: '11.2 Nm @ 6000 rpm',
        coolingSystem: 'Air & Oil Cooled',
        fuelSystem: 'Eco-Thrust Fuel Injection (ET-Fi)',
        startingSystem: 'Silent Electric Start (ISG)',
        topSpeed: '99 km/h',
        mileage: 65,
        fuelTankCapacity: '10 Litres',
        frontBrake: '240mm Roto Petal Disc',
        rearBrake: '130mm Drum with SBT',
        brakingSystem: 'Synchronized Braking Technology',
        frontSuspension: 'Telescopic Fork',
        rearSuspension: '5-Step Adjustable Gas-Charged Monoshock',
        wheelType: '17-inch Sport Alloy Wheels',
        tyreDimensions: 'Front: 80/100-17, Rear: 100/90-17 Tubeless',
        groundClearance: '180 mm',
        seatHeight: '780 mm',
        kerbWeight: '123 kg',
        smartFeatures: [
          '5-inch Color TFT Display with SmartXonnect',
          'Eco and Power Riding Modes',
          'Integrated Underseat Storage Compartment',
          'Distinctive Animalistic LED Headlamp & Tail Lamp',
          'USB Smartphone Fast Charging Socket',
        ],
        color: 'Fiery Yellow',
        variants: [
          { name: 'Drum', code: 'RAID-DRUM', price: 710000, colors: ['Striking Red', 'Wicked Black'], isDefault: false },
          { name: 'Disc', code: 'RAID-DISC', price: 755000, colors: ['Fiery Yellow', 'Blazing Blue', 'Wicked Black'], isDefault: false },
          { name: 'SmartXonnect TFT Edition', code: 'RAID-SX', price: 795000, colors: ['Fiery Yellow', 'Wicked Black', 'Striking Red'], isDefault: true },
        ],
        colors: [
          { name: 'Fiery Yellow', code: 'FYL', hex: '#FACC15', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Wicked Black', code: 'WBK', hex: '#111827', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Striking Red', code: 'SRD', hex: '#EF4444', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Blazing Blue', code: 'BBL', hex: '#3B82F6', imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 7, availableColors: ['Fiery Yellow', 'Wicked Black'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 4, availableColors: ['Striking Red', 'Fiery Yellow'] },
          { branchId: galleId, branchName: 'Galle Coastal TVS Center', quantity: 3, availableColors: ['Wicked Black'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 5, availableColors: ['Fiery Yellow', 'Striking Red'] },
        ],
        sellingPrice: 795000,
        purchasePrice: 650000,
        totalInvestment: 670000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: 'The wicked 125cc streetfighter with 65 km/l economy, TFT screen and monoshock.',
        description: 'TVS Raider 125 combines aggressive naked streetfighter styling with outstanding fuel economy, silent start, gas-charged monoshock suspension, and multiple driving modes.',
        images: [
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625RAID125N456789',
        engineNumber: 'RAID125M88912',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-RONIN-01',
        make: 'TVS',
        model: 'Ronin 225',
        variant: 'Triple Tone TD Special',
        category: 'Premium Motorcycles',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: '5-Speed with Assist & Slipper Clutch',
        engineCapacity: '225.9 cc',
        engineType: 'Single Cylinder, 4-stroke, 4-valve, SOHC, Oil-Cooled',
        maxPower: '20.4 PS @ 7750 rpm',
        maxTorque: '19.93 Nm @ 3750 rpm (High Low-End Torque)',
        coolingSystem: 'Oil Cooled',
        fuelSystem: 'Bosch Electronic Closed Loop Fuel Injection',
        startingSystem: 'Silent Integrated Starter Generator',
        topSpeed: '120 km/h',
        mileage: 42,
        fuelTankCapacity: '14 Litres Tear-Drop Tank',
        frontBrake: '300mm Disc with Dual Channel ABS',
        rearBrake: '240mm Disc',
        brakingSystem: 'Dual Channel ABS (Urban & Rain Modes)',
        frontSuspension: '41mm Showa Big Piston Inverted USD Front Forks',
        rearSuspension: 'Gas-Charged Monoshock with 7-step Preload Adjust',
        wheelType: '9-Spoke Machined Alloy Wheels',
        tyreDimensions: 'Front: 110/70-17, Rear: 130/70-17 Block Pattern Dual-Purpose',
        groundClearance: '181 mm',
        seatHeight: '795 mm',
        kerbWeight: '160 kg',
        smartFeatures: [
          'Showa 41mm Gold Inverted Upside Down (USD) Forks',
          'Asymmetric Round Full LCD Speedometer with SmartXonnect',
          'Voice Assistance & Turn-by-Turn GPS Navigation',
          'Signature T-Shaped Signature LED Headlamp',
          'Retro-Modern Scrambler Exhaust with Heavy Bass Roar',
        ],
        color: 'Galactic Grey',
        variants: [
          { name: 'Single Tone (SS)', code: 'RON-SS', price: 1320000, colors: ['Magma Red', 'Lightning Black'], isDefault: false },
          { name: 'Dual Tone (DS)', code: 'RON-DS', price: 1390000, colors: ['Delta Blue', 'Stargaze Black'], isDefault: false },
          { name: 'Triple Tone (TD) Special', code: 'RON-TD', price: 1475000, colors: ['Galactic Grey', 'Dawn Orange'], isDefault: true },
        ],
        colors: [
          { name: 'Galactic Grey', code: 'GGY', hex: '#4B5563', imageUrl: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Dawn Orange', code: 'DOR', hex: '#F97316', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Lightning Black', code: 'LBK', hex: '#111827', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Magma Red', code: 'MRD', hex: '#DC2626', imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 5, availableColors: ['Galactic Grey', 'Dawn Orange'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 3, availableColors: ['Galactic Grey', 'Lightning Black'] },
          { branchId: galleId, branchName: 'Galle Coastal TVS Center', quantity: 2, availableColors: ['Dawn Orange'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 3, availableColors: ['Galactic Grey'] },
        ],
        sellingPrice: 1475000,
        purchasePrice: 1240000,
        totalInvestment: 1280000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: 'Modern-retro scrambler cruiser featuring Showa USD forks and low-end torque.',
        description: 'TVS Ronin is built for effortless cruising and weekend scrambles. Powered by a refined 225cc motor tuned for strong bottom-end torque, Showa inverted forks, slipper clutch, and dual-channel ABS.',
        images: [
          'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625RON225N654321',
        engineNumber: 'RON225K112233',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-XL100-01',
        make: 'TVS',
        model: 'XL 100 Heavy Duty',
        variant: 'Comfort i-Touch Start',
        category: 'Commuter Motorcycles',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Petrol',
        transmission: 'Single Speed Centrifugal Automatic',
        engineCapacity: '99.7 cc',
        engineType: '4-stroke Single Cylinder, Air Cooled, EcoThrust Fuel Injection',
        maxPower: '4.4 PS @ 6000 rpm',
        maxTorque: '6.5 Nm @ 3500 rpm',
        coolingSystem: 'Air Cooled',
        fuelSystem: 'ET-Fi (EcoThrust Fuel Injection)',
        startingSystem: 'Silent i-Touch Electric Start & Kick',
        topSpeed: '65 km/h',
        mileage: 80,
        fuelTankCapacity: '4 Litres',
        frontBrake: '110mm Drum',
        rearBrake: '110mm Drum',
        brakingSystem: 'Synchronized Braking Technology (SBT)',
        frontSuspension: 'Telescopic Spring Type Hydraulic Suspension',
        rearSuspension: 'Heavy Duty Dual Hydraulic Shocks with Swingarm',
        wheelType: 'Heavy Duty Spoke Wheels with Reinforced Rims',
        tyreDimensions: 'Front: 2.50-16, Rear: 2.50-16 Heavy Duty',
        groundClearance: '155 mm',
        seatHeight: '770 mm',
        kerbWeight: '88 kg',
        smartFeatures: [
          'Detachable Pillion Seat for Maximum Heavy Cargo Carrying',
          'Integrated USB Mobile Phone Charging Socket',
          'Silent Roll-Over Starter System (i-Touch Start)',
          'High Rigidity Heavy Duty Rugged Tubular Chassis',
          'Outstanding 80 km/l EcoThrust Fuel Efficiency',
        ],
        color: 'Mineral Purple',
        variants: [
          { name: 'Heavy Duty Kick Start', code: 'XL100-KS', price: 345000, colors: ['Black', 'Green'], isDefault: false },
          { name: 'Comfort i-Touch Start', code: 'XL100-COMF', price: 385000, colors: ['Mineral Purple', 'Delight Blue', 'Beaver Brown'], isDefault: true },
        ],
        colors: [
          { name: 'Mineral Purple', code: 'MPR', hex: '#581C87', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Delight Blue', code: 'DBL', hex: '#1E40AF', imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Beaver Brown', code: 'BBR', hex: '#78350F', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 15, availableColors: ['Mineral Purple', 'Delight Blue'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 8, availableColors: ['Mineral Purple', 'Beaver Brown'] },
          { branchId: galleId, branchName: 'Galle Coastal TVS Center', quantity: 6, availableColors: ['Delight Blue'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 12, availableColors: ['Mineral Purple', 'Delight Blue', 'Beaver Brown'] },
        ],
        sellingPrice: 385000,
        purchasePrice: 295000,
        totalInvestment: 305000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: false,
        shortDescription: 'The legendary workhorse of Sri Lanka with 80 km/l fuel economy and detachable cargo seat.',
        description: 'TVS XL 100 Heavy Duty is the undisputed champion of utility mobility in Sri Lanka. Renowned for carrying heavy cargo with ease, it features electric start, USB mobile charger, and ultra-durable suspension.',
        images: [
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625XL100N332211',
        engineNumber: 'XL100H443322',
        branch: colomboId,
        location: colomboId,
      },
      {
        stockNumber: 'TVS-IQUBE-01',
        make: 'TVS',
        model: 'iQube Electric',
        variant: 'iQube S (3.4 kWh)',
        category: 'Electric Two-Wheelers',
        year: 2026,
        manufacturingYear: 2026,
        condition: 'Brand New',
        fuelType: 'Electric',
        transmission: 'Direct Drive Automatic',
        engineCapacity: '4.4 kW BLDC Hub Motor',
        engineType: 'Permanent Magnet BLDC Hub Motor with Regenerative Braking',
        maxPower: '4.4 kW (5.9 PS Peak)',
        maxTorque: '140 Nm at Wheel (Instant Torque)',
        coolingSystem: 'Air Cooled Battery Pack IP67 Water Resistant',
        fuelSystem: '3.4 kWh Lithium-ion NMC Battery Pack',
        startingSystem: 'Smart Keyless Electronic Start',
        topSpeed: '78 km/h',
        mileage: 100, // Range 100 km per charge
        fuelTankCapacity: '3.4 kWh Battery Pack (100 km Real Range)',
        frontBrake: '220mm Disc',
        rearBrake: '130mm Drum',
        brakingSystem: 'Electronic Regenerative Braking + Q-Park Assist',
        frontSuspension: 'Telescopic Hydraulic Fork',
        rearSuspension: 'Hydraulic Twin Shock Absorber',
        wheelType: '12-inch Aero-Optimized Lightweight Alloy',
        tyreDimensions: 'Front: 90/90-12, Rear: 90/90-12 Low Rolling Resistance',
        groundClearance: '157 mm',
        seatHeight: '770 mm',
        kerbWeight: '118 kg',
        smartFeatures: [
          '7-inch Interactive Color Display with 5-way Joystick',
          '100 km Certified Real-World Range on a Single Charge',
          'Q-Park Assist Reverse & Forward Creep Function',
          'Fast Charging (0 to 80% in 2 hours 45 mins)',
          'Smart Remote Battery Charge Monitoring via TVS App',
          'Geo-Fencing, Crash Alert and Anti-Theft Navigation Tracker',
        ],
        color: 'Pearl White',
        variants: [
          { name: 'iQube Standard (2.2 kWh)', code: 'IQUBE-STD', price: 895000, colors: ['Shining Red', 'Pearl White'], isDefault: false },
          { name: 'iQube S (3.4 kWh)', code: 'IQUBE-S', price: 1095000, colors: ['Pearl White', 'Titanium Grey Matte', 'Shining Red'], isDefault: true },
          { name: 'iQube ST (5.1 kWh / 140km)', code: 'IQUBE-ST', price: 1295000, colors: ['Starlight Blue', 'Titanium Grey Matte'], isDefault: false },
        ],
        colors: [
          { name: 'Pearl White', code: 'PWH', hex: '#FFFFFF', imageUrl: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Titanium Grey Matte', code: 'TGY', hex: '#4B5563', imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80', available: true },
          { name: 'Shining Red', code: 'SRD', hex: '#DC2626', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80', available: true },
        ],
        branchStock: [
          { branchId: colomboId, branchName: 'Colombo Central Flagship Hub', quantity: 6, availableColors: ['Pearl White', 'Titanium Grey Matte'] },
          { branchId: kandyId, branchName: 'Kandy City TVS Showroom', quantity: 3, availableColors: ['Pearl White'] },
          { branchId: kurunegalaId, branchName: 'Kurunegala North TVS Sales Hub', quantity: 2, availableColors: ['Shining Red'] },
        ],
        sellingPrice: 1095000,
        purchasePrice: 920000,
        totalInvestment: 950000,
        status: 'In Stock',
        isPublished: true,
        isFeatured: true,
        shortDescription: '100% smart electric scooter with 100km range, 7" joystick display and silent power.',
        description: 'Embrace sustainable mobility with the TVS iQube Electric. Offering silent whisper-quiet acceleration, regenerative braking, smart remote app connectivity, and ultra-low running costs of under Rs. 1 per km.',
        images: [
          'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        ],
        chassisNumber: 'MD625IQ34N991122',
        engineNumber: 'IQ4400E776655',
        branch: colomboId,
        location: colomboId,
      },
    ];

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
    const apacheBike = savedBikes[0]; // TVS Apache RTR 160 4V
    const ntorqBike = savedBikes[3]; // TVS NTORQ 125
    const jupiterBike = savedBikes[4]; // TVS Jupiter 125

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
        preferredBranchName: 'Colombo Central Flagship Hub',
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
        branchName: 'Colombo Central Flagship Hub',
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
        branchName: 'Colombo Central Flagship Hub',
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
        branchName: 'Colombo Central Flagship Hub',
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
