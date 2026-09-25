import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'showAddModal' in content or 'useState([' not in content:
        return

    print(f'Processing {filepath}')
    
    state_match = re.search(r'const\s+\[([a-zA-Z]+),\s+set[a-zA-Z]+\]\s*=\s*useState(?:<[^>]+>)?\(\[\s*\{\s*(.*?)\s*\}\s*(?:\]|,)', content, re.DOTALL)
    if not state_match:
        return
        
    state_var = state_match.group(1)
    first_obj = state_match.group(2)
    
    fields = []
    for line in first_obj.split('\n'):
        if ':' in line:
            key = line.split(':')[0].strip()
            if key and key != '_id':
                fields.append(key)
                
    state_hook = f"const [showAddModal, setShowAddModal] = useState(false);\n  const [newFormData, setNewFormData] = useState({{}});\n"
    content = re.sub(r'(const\s+\[[a-zA-Z]+,\s+set[a-zA-Z]+\]\s*=\s*useState.*?;)', r'\1\n  ' + state_hook, content, 1, flags=re.DOTALL)
    
    content = re.sub(r'(<button[^>]*class(?:Name)?="[^"]*bg-[a-zA-Z]+-[0-9]+[^"]*"[^>]*>)', r'\1 onClick={() => setShowAddModal(true)}', content, 1)
    
    form_inputs = ""
    for field in fields:
        form_inputs += f'''
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{field}</label>
                <input type="text" className="w-full border border-slate-300 rounded-lg p-2 text-xs" onChange={{(e) => setNewFormData({{...newFormData, {field}: e.target.value}})}} />
              </div>'''
              
    modal_jsx = f'''
      {{showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Record</h3>
            <div className="space-y-3">
              {form_inputs}
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={{() => setShowAddModal(false)}} className="px-4 py-2 border rounded-lg text-slate-600 font-semibold text-xs">Cancel</button>
              <button onClick={{() => {{ setShowAddModal(false); alert('Record Saved (Simulated)'); }}}} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-xs">Save</button>
            </div>
          </div>
        </div>
      )}}
    '''
    
    content = content.replace('</DashboardLayout>', modal_jsx + '\n    </DashboardLayout>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('src/app/dashboard'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
