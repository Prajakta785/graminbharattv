'use client';

import React, { useEffect, useState } from 'react';
import { ClipboardList, Search, Activity, ShieldCheck, Clock } from 'lucide-react';
import { dbService } from '@/lib/db';
import { AuditLog } from '@/types';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await dbService.getAuditLogs();
      setLogs(data);
    };
    load();
  }, []);

  const filtered = logs.filter(
    l =>
      l.adminName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-orange-500" />
            प्रशासकीय ऑडिट नोंदी (Security & Audit Logs)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            प्रत्येक संपादकीय व प्रशासकीय कृतीची अपरिवर्तनीय डिजिटल नोंद
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="नोंद किंवा ॲडमिन नाव शोधा..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3">वेळ व दिनांक</th>
              <th className="pb-3">प्रशासक / वापरकर्ता</th>
              <th className="pb-3">मॉड्यूल (Module)</th>
              <th className="pb-3">कृती (Action)</th>
              <th className="pb-3">तपशील व शेरा</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(log => (
              <tr key={log.id} className="text-slate-200">
                <td className="py-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('mr-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
                <td className="py-3 font-bold text-white whitespace-nowrap">
                  {log.adminName}
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-orange-400">
                    {log.module}
                  </span>
                </td>
                <td className="py-3 font-mono text-[11px] text-emerald-400 font-bold whitespace-nowrap">
                  {log.action}
                </td>
                <td className="py-3 text-slate-300 max-w-md">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
