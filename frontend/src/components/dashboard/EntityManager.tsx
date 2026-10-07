'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus } from 'lucide-react';

export type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  options?: string[];
  endpoint?: string;
  optionLabel?: (row: any) => string;
};

type Column = { label: string; value: (row: any) => unknown };
type Props = {
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
  columns: Column[];
  initialValues?: Record<string, unknown>;
  canEdit?: boolean;
  updateMethod?: 'PATCH' | 'PUT';
};

export function getSmartPlaceholder(field: Field): string {
  if (field.placeholder) return field.placeholder;
  const name = field.name.toLowerCase();
  const label = field.label.toLowerCase();

  if (name.includes('email') || label.includes('email')) return 'e.g. saman.perera@example.com';
  if (name.includes('license') || name.includes('licence') || label.includes('license') || label.includes('licence')) return 'e.g. B1234567';
  if (name.includes('chassis') || name === 'vin' || name.startsWith('vin') || label.includes('chassis') || label.includes('vin')) return 'e.g. NZE141-9012345';
  if (name.includes('reg') || name.includes('plate') || label.includes('reg')) return 'e.g. WP CAB-5678';
  if (name.includes('amount') || name.includes('price') || name.includes('cost') || name.includes('value') || name.includes('target') || name.includes('commission') || name.includes('budget') || name.includes('fee')) return 'e.g. 1,500,000';
  if (name.includes('year')) return 'e.g. 2024';
  if (name.includes('mileage') || name.includes('km')) return 'e.g. 45,000';
  if (name.includes('nic') || name.includes('passport')) return 'e.g. 199012345678 / 901234567V';
  if (name.includes('make') || label.includes('make')) return 'e.g. Toyota / Honda / Nissan';
  if (name.includes('model') || label.includes('model')) return 'e.g. Axio / Grace / Civic';
  if (name.includes('color')) return 'e.g. Pearl White / Metallic Black';
  if (name.includes('name') || label.includes('name')) return 'e.g. Sunera Fernando';
  if (name.includes('address') || name.includes('city') || label.includes('address')) return 'e.g. No. 45, Galle Road, Colombo 03';
  if (name.includes('note') || name.includes('description') || name.includes('comment') || name.includes('reason') || name.includes('feedback') || name.includes('details')) return 'e.g. Enter detailed notes or specifications...';

  if (field.type === 'number') return 'e.g. 0';
  if (field.type === 'date') return 'YYYY-MM-DD';

  return `e.g. Enter ${field.label.toLowerCase()}`;
}

export function EntityManager({ title, description, endpoint, fields, columns, initialValues = {}, canEdit = true, updateMethod = 'PUT' }: Props) {
  const [rows, setRows] = useState<any[]>([]);
  const [options, setOptions] = useState<Record<string, any[]>>({});
  const [form, setForm] = useState<Record<string, any>>(initialValues);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingRow, setViewingRow] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getPath = (source: any, path: string) => path.split('.').reduce((value, part) => value?.[part], source);
  const setPath = (source: Record<string, any>, path: string, value: any) => {
    const result = { ...source }; const parts = path.split('.'); let target = result;
    parts.slice(0, -1).forEach((part) => { target[part] = { ...(target[part] || {}) }; target = target[part]; });
    target[parts[parts.length - 1]] = value; return result;
  };

  const load = async () => {
    const response = await apiFetch(endpoint);
    if (!response.ok) throw new Error('Could not load records. Check your access and API connection.');
    setRows(await response.json());
  };
  useEffect(() => {
    load().catch((e) => setError(e.message));
    const endpoints = [...new Set(fields.map((field) => field.endpoint).filter(Boolean))] as string[];
    Promise.all(endpoints.map(async (url) => {
      const response = await apiFetch(url);
      if (!response.ok) throw new Error(`Could not load options from ${url}.`);
      return [url, await response.json()] as const;
    })).then((items) => setOptions(Object.fromEntries(items))).catch((e) => setError(e.message));
  // Fields are page configuration and remain constant for this component instance.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const save = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const payload = Object.entries(form).reduce((result, [key, value]) => setPath(result, key, value === '' ? undefined : value), {} as Record<string, any>);
      const response = await apiFetch(editingId ? `${endpoint}/${editingId}` : endpoint, { method: editingId ? updateMethod : 'POST', body: JSON.stringify(payload) });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(Array.isArray(result.message) ? result.message.join(' ') : result.message || 'Could not save record.');
      }
      await load(); setOpen(false); setEditingId(null); setForm(initialValues);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save record.'); }
    finally { setBusy(false); }
  };

  const remove = async (id: string) => {
    setBusy(true); setError('');
    try {
      const response = await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(Array.isArray(result.message) ? result.message.join(' ') : result.message || 'Could not delete record.');
      }
      setRows((current) => current.filter((row) => row._id !== id));
      setDeletingId(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not delete record.'); }
    finally { setBusy(false); }
  };

  const display = (value: unknown) => {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'object') return (value as any).fullName || (value as any).name || (value as any).make && `${(value as any).make} ${(value as any).model || ''}` || (value as any).invoiceNumber || '—';
    return String(value);
  };

  return <DashboardLayout><div className="mb-6 flex items-center justify-between gap-4"><div><h1 className="text-2xl font-extrabold text-slate-900">{title}</h1><p className="text-xs text-slate-500">{description}</p></div><button onClick={() => { setError(''); setOpen(true); }} className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"><Plus className="w-4 h-4" /><span>Add Record</span></button></div>
    {error && <div role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4"><table className="w-full text-left text-xs"><thead><tr className="border-b bg-slate-50">{columns.map((column) => <th key={column.label} className="px-3 py-3 font-semibold">{column.label}</th>)}<th className="px-3 py-3">Actions</th></tr></thead><tbody className="divide-y">{rows.map((row) => <tr key={row._id}>{columns.map((column) => <td key={column.label} className="px-3 py-3">{display(column.value(row))}</td>)}<td className="px-3 py-3"><div className="flex flex-wrap gap-2"><button onClick={() => setViewingRow(row)} className="rounded border px-3 py-1.5">View</button>{canEdit && <><button onClick={()=>{ setEditingId(row._id); setForm(Object.fromEntries(fields.map((field)=>{ let value=getPath(row,field.name); if (value && typeof value==='object' && value._id) value=value._id; if (field.type==='date' && value) value=new Date(value).toISOString().slice(0,10); if (field.type==='datetime-local' && value) value=new Date(value).toISOString().slice(0,16); if (field.type==='month' && value) value=String(value).slice(0,7); return [field.name,value ?? '']; }))); setError(''); setOpen(true); }} className="rounded border border-emerald-200 px-3 py-1.5 text-emerald-700">Edit</button><button onClick={() => setDeletingId(row._id)} className="rounded border border-rose-200 px-3 py-1.5 text-rose-700">Delete</button></>}</div></td></tr>)}{rows.length === 0 && <tr><td colSpan={columns.length+1} className="py-8 text-center text-slate-500">No records found.</td></tr>}</tbody></table></div>
    {viewingRow && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewingRow(null); }}><section role="dialog" aria-modal="true" className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6"><div className="mb-4 flex items-center justify-between border-b pb-3"><h2 className="font-bold">{title} details</h2><button onClick={() => setViewingRow(null)} className="rounded border px-3 py-1.5">Close</button></div><dl className="grid gap-3 sm:grid-cols-2">{fields.map((field) => <div key={field.name} className="rounded-lg bg-slate-50 p-3"><dt className="text-[11px] font-semibold text-slate-500">{field.label}</dt><dd className="mt-1 break-words text-sm text-slate-900">{display(getPath(viewingRow, field.name))}</dd></div>)}</dl></section></div>}
    {deletingId && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6"><h2 className="text-lg font-bold">Delete this {title.toLowerCase()} record?</h2><p className="mt-2 text-sm text-slate-600">This action cannot be undone.</p>{error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}<div className="mt-6 flex justify-end gap-2"><button disabled={busy} onClick={() => setDeletingId(null)} className="rounded border px-4 py-2">Cancel</button><button disabled={busy} onClick={() => remove(deletingId)} className="rounded bg-rose-600 px-4 py-2 text-white disabled:opacity-50">{busy ? 'Deleting…' : 'Delete'}</button></div></section></div>}
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><form onSubmit={save} className="max-h-[90vh] w-full max-w-xl space-y-3 overflow-y-auto rounded-2xl bg-white p-6"><h2 className="text-lg font-bold">{editingId ? 'Edit' : 'Add'} {title} Record</h2>{fields.map((field) => <label key={field.name} className="block text-xs font-semibold text-slate-700">{field.type==='checkbox' ? <span className="flex items-center gap-2"><input type="checkbox" checked={Boolean(getPath(form,field.name))} onChange={(e)=>setForm(setPath(form,field.name,e.target.checked))}/>{field.label}</span> : <>{field.label}{field.endpoint ? <select required={field.required} value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="mt-1 w-full rounded-lg border p-2 text-sm text-slate-900"><option value="">-- Select {field.label} --</option>{(options[field.endpoint] || []).map((option) => <option key={option._id} value={option._id}>{field.optionLabel?.(option) || option.fullName || option.name || option.invoiceNumber || option._id}</option>)}</select> : field.options ? <select required={field.required} value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="mt-1 w-full rounded-lg border p-2 text-sm text-slate-900"><option value="">-- Select {field.label} --</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea required={field.required} placeholder={getSmartPlaceholder(field)} value={getPath(form,field.name) || ''} onChange={(e) => setForm(setPath(form,field.name,e.target.value))} className="mt-1 w-full rounded-lg border p-2 text-sm text-slate-900 placeholder:text-slate-400" /> : <input required={field.required} type={field.type || 'text'} min={field.type === 'number' ? 0 : undefined} placeholder={getSmartPlaceholder(field)} value={getPath(form,field.name) ?? ''} onChange={(e) => setForm(setPath(form,field.name,e.target.value))} className="mt-1 w-full rounded-lg border p-2 text-sm text-slate-900 placeholder:text-slate-400" />}</>}</label>)}<div className="flex justify-end gap-2 border-t pt-4"><button type="button" onClick={() => {setOpen(false);setEditingId(null);setForm(initialValues);}} className="rounded-lg border px-4 py-2 text-xs">Cancel</button><button disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save'}</button></div></form></div>}
  </DashboardLayout>;
}
