import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the POST fetch block:
    # try {
    #   await fetch(getApiUrl('...'), {
    #     method: 'POST',
    #     headers: { 'Content-Type': 'application/json' },
    #     body: JSON.stringify(item)
    #   });
    # } catch (err) { ... }
    #
    # We want to replace it with the new payload extraction and state update.
    
    # Actually, a simpler way is to replace ody: JSON.stringify(item) 
    # with ody: JSON.stringify((() => { const { _id, ...rest } = item; return rest; })())
    
    new_content = content.replace('body: JSON.stringify(item)', 'body: JSON.stringify((() => { const { _id, ...rest } = item; return rest; })())')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('frontend/src/app'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
