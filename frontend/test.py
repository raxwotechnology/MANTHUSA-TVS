import os
import re

filepath = 'src/app/dashboard/quotations/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print('Has showAddModal:', 'showAddModal' in content)
print('Has useState([:', 'useState([' in content)
print('Has useState<Quotation[]>([:', 'useState<Quotation[]>([' in content)
