import os
import re

FIELD_PLACEHOLDERS = [
    # Specific patterns (pattern in name/label/id -> placeholder)
    (r'invoiceNumber|invoice', 'e.g. INV-2026-0089'),
    (r'supplierId', 'e.g. SUP-2026-012'),
    (r'supplierName|supplier', 'e.g. Lanka Auto Importers Ltd'),
    (r'supplierType', 'e.g. Japanese Auction / Local Dealer'),
    (r'contactPerson', 'e.g. Sunera Perera'),
    (r'outstandingBalance|balance', 'e.g. 500,000'),
    (r'fullName|customerName|name', 'e.g. Kasun Kalhara'),
    (r'nicOrPassport|nicPassport|nic|passport', 'e.g. 199012345678 / 901234567V'),
    (r'phone|mobile|contact', 'e.g. +94 77 123 4567'),
    (r'email', 'e.g. kasun@example.com'),
    (r'address|city|location', 'e.g. No. 45, Galle Road, Colombo 03'),
    (r'stockNumber|stock', 'e.g. STK-2026-001'),
    (r'make', 'e.g. Toyota / Honda / Nissan'),
    (r'model', 'e.g. Axio WxB / Grace / Civic'),
    (r'variant|grade', 'e.g. F EX Package'),
    (r'manufacturingYear|year', 'e.g. 2024'),
    (r'registrationNumber|registration|plate|reg', 'e.g. WP CAB-5678'),
    (r'chassisNumber|chassis|vin', 'e.g. NZE141-9012345'),
    (r'mileage|km', 'e.g. 45,000'),
    (r'color', 'e.g. Pearl White / Metallic Black'),
    (r'purchasePrice', 'e.g. 10,000,000'),
    (r'transportCost', 'e.g. 30,000'),
    (r'repairCost', 'e.g. 50,000'),
    (r'detailingCost', 'e.g. 20,000'),
    (r'sellingPrice|vehiclePrice', 'e.g. 12,000,000'),
    (r'minimumSellingPrice|minSellingPrice', 'e.g. 11,800,000'),
    (r'discount', 'e.g. 150,000'),
    (r'additionalCharges|charges|fee', 'e.g. 25,000'),
    (r'amount|price|cost|budget|target|commission', 'e.g. 1,500,000'),
    (r'occupation', 'e.g. Business Owner / Software Engineer'),
    (r'notes|description|reason|remarks|comment|details', 'e.g. Enter detailed description or notes...'),
    (r'token', 'e.g. 123456'),
    (r'password', '••••••••'),
]

def find_placeholder_for(ctx):
    ctx_clean = ctx.lower()
    for pattern, ph in FIELD_PLACEHOLDERS:
        if re.search(pattern, ctx, re.IGNORECASE):
            return ph
    if 'search' in ctx_clean:
        return 'e.g. Search by keyword, name, or code...'
    return 'e.g. Enter value...'

print("Script loaded")
