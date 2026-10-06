"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = __importStar(require("bcrypt"));
async function seed() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/salesplus';
    const adminName = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || 'System Administrator';
    const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase() || 'admin@salesplus.com';
    const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD || 'AdminPass1234!';
    await mongoose_1.default.connect(mongoUri);
    try {
        const db = mongoose_1.default.connection.db;
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
            if (await db.collection(collection.name).estimatedDocumentCount()) {
                console.log(`Note: Collection ${collection.name} contains data; skipping duplicate seed.`);
            }
        }
        const now = new Date();
        const rolesColl = db.collection('roles');
        const usersColl = db.collection('users');
        const roleDefs = [
            { name: 'Admin / Owner', description: 'Full system control and administrative configuration' },
            { name: 'Sales & Operations', description: 'Daily sales, CRM leads, test drives, and vehicle operations' },
            { name: 'Accountant / Finance Staff', description: 'Financial operations, invoices, payments, and profit & loss' },
            { name: 'Inventory Manager', description: 'Vehicle stock management, specifications, and media updates' },
            { name: 'Customer', description: 'Customer portal access for vehicle inquiries and reservations' },
        ];
        const rolesMap = {};
        for (const r of roleDefs) {
            let existing = await rolesColl.findOne({ name: r.name });
            if (!existing) {
                const result = await rolesColl.insertOne({ ...r, createdAt: now, updatedAt: now });
                existing = { _id: result.insertedId, name: r.name };
            }
            rolesMap[r.name] = existing._id;
        }
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
    }
    finally {
        await mongoose_1.default.disconnect();
    }
}
seed().catch((error) => {
    console.error('Bootstrap failed:', error.message);
    process.exitCode = 1;
    void mongoose_1.default.disconnect();
});
//# sourceMappingURL=seed.js.map