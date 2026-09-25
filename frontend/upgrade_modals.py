import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for our injected alert
    if "alert('Record Saved (Simulated)')" not in content:
        return
        
    print(f'Upgrading {filepath}')
    
    # Get the state variable name
    state_match = re.search(r'const\s+\[([a-zA-Z]+),\s+set[a-zA-Z]+\]\s*=\s*useState(?:<[^>]+>)?\(\[\s*\{\s*(.*?)\s*\}\s*(?:\]|,)', content, re.DOTALL)
    if not state_match:
        return
        
    state_var = state_match.group(1)
    # capital case setter
    setter_var = 'set' + state_var[0].upper() + state_var[1:]
    
    # Replace alert with state update
    # onClick={() => { setShowAddModal(false); setQuotations([{_id: Date.now().toString(), ...newFormData}, ...quotations]); }}
    content = content.replace(
        "alert('Record Saved (Simulated)')", 
        f"{setter_var}([{{_id: Date.now().toString(), ...newFormData}}, ...{state_var}])"
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('src/app/dashboard'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
