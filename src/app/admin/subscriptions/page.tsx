'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Search, Download, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { dbService } from '@/lib/db';
import { PaymentTransaction } from '@/types';

export default function AdminSubscriptionsPage() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await dbService.getTransactions();
      setTransactions(data);
    };
    load();
  }, []);

  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);

  const filtered = transactions.filter(
    t =>
      t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.paymentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-500" />
            महसूल व वर्गणी व्यवहार (Revenue & Invoices)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Razorpay द्वारे प्राप्त वर्गणी, GST पावत्या आणि व्यवहार नोंदी
          </p>
        </div>

        <div className="p-3 px-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <div>
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
              एकूण महसूल
            </span>
            <p className="text-xl font-black text-white">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="पावती क्रमांक किंवा ग्राहक नाव शोधा..."
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
              <th className="pb-3">पावती क्रमांक (Invoice)</th>
              <th className="pb-3">ग्राहक नाव</th>
              <th className="pb-3">प्लॅन तपशील</th>
              <th className="pb-3">रक्कम</th>
              <th className="pb-3">पेमेंट गेटवे आयडी</th>
              <th className="pb-3">पेमेंट पद्धत</th>
              <th className="pb-3">दिनांक</th>
              <th className="pb-3 text-right">स्थिती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(tx => (
              <tr key={tx.id} className="text-slate-200">
                <td className="py-3 font-mono font-bold text-white">{tx.invoiceNumber}</td>
                <td className="py-3 font-semibold text-slate-200">{tx.userName}</td>
                <td className="py-3">
                  {tx.planId === 'annual_premium' ? 'वार्षिक प्रीमियम (₹३९९)' : 'मासिक मोबाईल (₹१४९)'}
                </td>
                <td className="py-3 font-black text-emerald-400 text-sm">₹{tx.amount}</td>
                <td className="py-3 font-mono text-[11px] text-slate-400">{tx.paymentId}</td>
                <td className="py-3 text-slate-300">{tx.paymentMethod}</td>
                <td className="py-3 text-slate-400">
                  {new Date(tx.createdAt).toLocaleDateString('mr-IN')}
                </td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                    यशस्वी (Success)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
