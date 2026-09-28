'use client';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiFetch } from '@/lib/api';
export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { apiFetch('/audit-logs?limit=250').then(async (response) => { if (!response.ok) throw new Error('Audit logs are available to Admin / Owner accounts.'); setLogs(await response.json()); }).catch((e) => setError(e.message)); }, []);
  return <DashboardLayout><div className="mb-6"><h1 className="text-2xl font-extrabold">System Audit Logs</h1><p className="text-xs text-slate-500">Successful changes recorded by the API.</p></div>{error&&<div role="alert" className="mb-4 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}<div className="overflow-x-auto rounded-2xl border bg-white p-5"><table className="w-full text-left text-xs"><thead><tr className="border-b bg-slate-50">{['User','Action','Entity','Record','Change details','Time'].map((x)=><th key={x} className="px-3 py-3">{x}</th>)}</tr></thead><tbody>{logs.map((log)=><tr key={log._id} className="border-b"><td className="p-3">{log.user?.name || 'System'}</td><td className="p-3">{log.action}</td><td className="p-3">{log.entity}</td><td className="p-3 font-mono">{log.entityId || '—'}</td><td className="max-w-sm truncate p-3">{log.newValue ? JSON.stringify(log.newValue) : log.oldValue ? JSON.stringify(log.oldValue) : '—'}</td><td className="p-3">{log.createdAt && new Date(log.createdAt).toLocaleString()}</td></tr>)}{logs.length===0&&!error&&<tr><td colSpan={6} className="p-8 text-center text-slate-500">No audit records have been created.</td></tr>}</tbody></table></div></DashboardLayout>;
}
