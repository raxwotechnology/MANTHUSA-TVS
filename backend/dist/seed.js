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
    const adminName = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
    const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
    if (!adminName || !adminEmail || !adminPassword) {
        throw new Error('Set BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, and BOOTSTRAP_ADMIN_PASSWORD before seeding.');
    }
    if (adminPassword.length < 12) {
        throw new Error('BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters long.');
    }
    await mongoose_1.default.connect(mongoUri);
    try {
        const db = mongoose_1.default.connection.db;
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