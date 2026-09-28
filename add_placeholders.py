import os
import re

# Mapping of field labels / names to hidden example placeholders
PLACEHOLDERS = {
    'email': 'e.g. saman.perera@example.com',
    'phone': 'e.g. +94 77 123 4567',
    'contact': 'e.g. +94 77 123 4567',
    'mobile': 'e.g. +94 77 123 4567',
    'nic': 'e.g. 199012345678 / 901234567V',
    'passport': 'e.g. N1234567',
    'fullname': 'e.g. Sunera Perera',
    'name': 'e.g. Sunera Perera',
    'city': 'e.g. Colombo 03',
    'address': 'e.g. No. 45, Galle Road, Colombo 03',
    'occupation': 'e.g. Software Engineer / Business Owner',
    'stocknumber': 'e.g. STK-2026-001',
    'stock': 'e.g. STK-2026-001',
    'make': 'e.g. Toyota / Honda / Nissan',
    'model': 'e.g. Axio WxB / Grace / Civic',
    'variant': 'e.g. F EX Package',
    'year': 'e.g. 2024',
    'manufacturingyear': 'e.g. 2024',
    'registrationnumber': 'e.g. WP CAB-5678',
    'reg': 'e.g. WP CAB-5678',
    'chassisnumber': 'e.g. NZE141-9012345',
    'chassis': 'e.g. NZE141-9012345',
    'mileage': 'e.g. 45,000',
    'color': 'e.g. Pearl White / Metallic Black',
    'purchaseprice': 'e.g. 10,000,000',
    'transportcost': 'e.g. 30,000',
    'repaircost': 'e.g. 50,000',
    'detailingcost': 'e.g. 20,000',
    'sellingprice': 'e.g. 12,000,000',
    'minimumsellingprice': 'e.g. 11,800,000',
    'amount': 'e.g. 150,000',
    'price': 'e.g. 2,500,000',
    'cost': 'e.g. 50,000',
    'commission': 'e.g. 75,000',
    'target': 'e.g. 15,000,000',
    'notes': 'e.g. Enter detailed notes or specifications...',
    'description': 'e.g. Provide additional details...',
    'reason': 'e.g. State reason for approval or request...',
    'token': 'e.g. 123456',
    'password': '••••••••',
}

def get_placeholder(name_or_label, type_attr=""):
    key = re.sub(r'[^a-zA-Z]', '', name_or_label).lower()
    for k, v in PLACEHOLDERS.items():
        if k in key:
            return v
    if 'search' in key:
        return 'e.g. Search by keyword, ID, or name...'
    if type_attr == 'number':
        return 'e.g. 0'
    if type_attr == 'email':
        return 'e.g. user@example.com'
    if type_attr == 'date':
        return 'YYYY-MM-DD'
    return f'e.g. Enter {name_or_label.lower()}...'

print("Placeholder generator script ready.")
