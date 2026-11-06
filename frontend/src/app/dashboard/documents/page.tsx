'use client';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch, getApiUrl } from '@/lib/api';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { exportPdf, exportExcel } from '@/lib/exportUtils';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [entityType, setEntityType] = useState('Vehicle');
  const [entityId, setEntityId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const response = await apiFetch('/documents');
    if (!response.ok) throw new Error('Could not load documents.');
    setDocuments(await response.json());
  };

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    const body = new FormData();
    body.set('file', file);
    body.set('entityType', entityType);
    body.set('entityId', entityId.trim());
    try {
      const response = await apiFetch('/documents', { method: 'POST', body });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Upload failed.');
      }
      setFile(null);
      (event.currentTarget as HTMLFormElement).reset();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const download = async (document: any) => {
    const response = await apiFetch(`/documents/${document._id}/download`);
    if (!response.ok) {
      setError('Document download failed.');
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const link = documentCreateLink(url, document.originalName);
    link.click();
    URL.revokeObjectURL(url);
  };

  const documentColumns = [
    { label: 'File Name', value: (r: any) => r.originalName },
    { label: 'Record Type', value: (r: any) => r.entityType },
    { label: 'Record ID', value: (r: any) => r.entityId },
    { label: 'MIME Type', value: (r: any) => r.mimeType },
    { label: 'Size (KB)', value: (r: any) => (r.size / 1024).toFixed(0) },
    { label: 'Uploaded At', value: (r: any) => r.createdAt && new Date(r.createdAt).toLocaleString() },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Document Management</h1>
          <p className="text-xs text-slate-500">Upload PDF, JPG, PNG or WEBP files up to 10 MB and attach them to a customer, vehicle or sale.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportPdf('Document Registry', 'documents.pdf', documentColumns, documents)}
            disabled={!documents.length}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => exportExcel('documents.xlsx', documentColumns, documents)}
            disabled={!documents.length}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 px-3.5 py-2 text-xs font-semibold text-white shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>
      {error && <div role="alert" className="mb-4 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      <form onSubmit={upload} className="mb-6 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-4">
        <label className="text-xs">Record type
          <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className="mt-1 w-full rounded border p-2">
            <option>Vehicle</option>
            <option>Customer</option>
            <option>Sale</option>
            <option>Supplier</option>
            <option>Lead</option>
          </select>
        </label>
        <label className="text-xs">Record ID
          <input required value={entityId} onChange={(e) => setEntityId(e.target.value)} className="mt-1 w-full rounded border p-2" placeholder="Paste record ID" />
        </label>
        <label className="text-xs">File
          <input required type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 w-full rounded border p-1.5" />
        </label>
        <button disabled={busy} className="self-end rounded bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
          {busy ? 'Uploading…' : 'Upload document'}
        </button>
      </form>
      <div className="overflow-x-auto rounded-xl border bg-white p-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-3">Name</th>
              <th className="p-3">Record type</th>
              <th className="p-3">Record ID</th>
              <th className="p-3">Type / Size</th>
              <th className="p-3">Uploaded</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id} className="border-b">
                <td className="p-3">{doc.originalName}</td>
                <td className="p-3">{doc.entityType}</td>
                <td className="p-3 font-mono">{doc.entityId}</td>
                <td className="p-3">{doc.mimeType} · {(doc.size / 1024).toFixed(0)} KB</td>
                <td className="p-3">{new Date(doc.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <button onClick={() => download(doc)} className="rounded border px-3 py-1.5">Download</button>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No documents uploaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

function documentCreateLink(url: string, name: string) {
  const link = window.document.createElement('a');
  link.href = url;
  link.download = name;
  return link;
}
