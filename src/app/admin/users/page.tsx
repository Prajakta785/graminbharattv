'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, CheckCircle2, UserCheck, Mail, Phone } from 'lucide-react';
import { dbService } from '@/lib/db';
import { UserProfile } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([
    {
      id: 'usr-1',
      name: 'सचिन कदम',
      email: 'sachin.kadam@graminbharattv.in',
      phone: '9822123456',
      role: 'super_admin',
      subscriptionStatus: 'active',
      planName: 'वार्षिक प्रीमियम (₹३९९)',
      registeredAt: '2026-01-01',
    },
    {
      id: 'usr-2',
      name: 'आनंदराव पाटील',
      email: 'anand.patil@example.com',
      phone: '9822011223',
      role: 'user',
      subscriptionStatus: 'active',
      planName: 'वार्षिक प्रीमियम (₹३९९)',
      registeredAt: '2026-02-10',
    },
    {
      id: 'usr-3',
      name: 'डॉ. शीतल मोहिते',
      email: 'sheetal.mohite@example.com',
      phone: '9422033445',
      role: 'user',
      subscriptionStatus: 'active',
      planName: 'वार्षिक प्रीमियम (₹३९९)',
      registeredAt: '2026-02-14',
    },
    {
      id: 'usr-4',
      name: 'विकास जगदाळे',
      email: 'vikas.j@example.com',
      phone: '9890044556',
      role: 'user',
      subscriptionStatus: 'active',
      planName: 'मोबाईल मासिक (₹१४९)',
      registeredAt: '2026-02-20',
    },
    {
      id: 'usr-5',
      name: 'प्रवीण जगताप (ब्युरो चीफ)',
      email: 'reporter.pune@graminbharattv.in',
      phone: '9423011111',
      role: 'reporter',
      subscriptionStatus: 'active',
      planName: 'स्टाफ ॲक्सेस',
      registeredAt: '2026-01-05',
    },
  ]);

  const [search, setSearch] = useState('');

  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search)
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            वापरकर्ते व ग्राहक व्यवस्थापन (User Management)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            नोंदणीकृत नागरिक सदस्य, सक्रिय वर्गणीदार आणि प्रशासकीय कर्मचारी
          </p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="नाव, ईमेल किंवा फोन शोधा..."
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
              <th className="pb-3">वापरकर्ता नाव</th>
              <th className="pb-3">ईमेल व फोन</th>
              <th className="pb-3">भूमिका (Role)</th>
              <th className="pb-3">सबस्क्रिप्शन स्थिती</th>
              <th className="pb-3">प्लॅन तपशील</th>
              <th className="pb-3">नोंदणी दिनांक</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(u => (
              <tr key={u.id} className="text-slate-200">
                <td className="py-3 font-bold text-white text-sm">{u.name}</td>
                <td className="py-3">
                  <p className="text-slate-300">{u.email}</p>
                  <p className="font-mono text-[10px] text-slate-500">{u.phone}</p>
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-orange-400 border border-slate-700">
                    {u.role}
                  </span>
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                    सक्रिय (Active)
                  </span>
                </td>
                <td className="py-3 text-slate-300">{u.planName}</td>
                <td className="py-3 font-mono text-slate-400">{u.registeredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
