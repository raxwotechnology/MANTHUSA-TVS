import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to match body: JSON.stringify(varName)
    # We will replace it with the _id removal trick
    def repl(m):
        var_name = m.group(1)
        # Avoid replacing things that are not simple variables or already fixed
        if var_name.startswith('(') or var_name == 'payload':
            return m.group(0)
        return f'body: JSON.stringify((() => {{ const {{ _id, ...rest }} = {var_name}; return rest; }})())'
        
    new_content = re.sub(r'body:\s*JSON\.stringify\(([a-zA-Z0-9_]+)\)', repl, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('frontend/src/app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
