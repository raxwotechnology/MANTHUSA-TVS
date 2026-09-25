import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for the state update we just added
    if "} as any, ..." not in content:
        content = re.sub(
            r'(\[{_id: Date\.now\(\)\.toString\(\), \.\.\.newFormData)(\}, \.\.\.[a-zA-Z]+\]\); \}\})',
            r'\1} as any\2',
            content
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

for root, dirs, files in os.walk('src/app/dashboard'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
