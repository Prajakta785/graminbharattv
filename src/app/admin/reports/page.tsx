'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Filter, FileSpreadsheet } from 'lucide-react';
import { dbService } from '@/lib/db';
import { useToast } from '@/context/ToastContext';

export default function AdminReportsPage() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');

  const handleExportCSV = async () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `GBTV_Report_${reportType}_${Date.now()}.csv`;

    if (reportType === 'revenue' || reportType === 'subscriptions') {
      const txs = await dbService.getTransactions();
      csvContent += 'Invoice Number,User Name,Plan,Amount,Payment Method,Date,Status\n';
      txs.forEach(t => {
        csvContent += `"${t.invoiceNumber}","${t.userName}","${t.planId}","${t.amount}","${t.paymentMethod}","${t.createdAt}","${t.status}"\n`;
      });
    } else if (reportType === 'grievances') {
      const grvs = await dbService.getGrievances();
      csvContent += 'Tracking ID,Citizen Name,District,Taluka,Category,Status,Date\n';
      grvs.forEach(g => {
        csvContent += `"${g.trackingId}","${g.citizenName}","${g.district}","${g.taluka}","${g.categoryMr}","${g.status}","${g.submittedAt}"\n`;
      });
    } else {
      const news = await dbService.getNews();
      csvContent += 'ID,Title,District,Category,Reporter,Views,Date\n';
      news.forEach(n => {
        csvContent += `"${n.id}","${n.titleMr}","${n.district || ''}","${n.categoryMr}","${n.reporter.nameMr}","${n.viewsCount}","${n.publishedAt}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(`${filename} यशस्वीरित्या डाऊनलोड झाला`, 'success');
  };

  const dummyChartData = [
    { label: 'जानेवारी', views: 42000, revenue: 16800 },
    { label: 'फेब्रुवारी', views: 58000, revenue: 23200 },
    { label: 'मार्च', views: 74000, revenue: 31500 },
    { label: 'एप्रिल', views: 89000, revenue: 42000 },
    { label: 'मे', views: 110000, revenue: 54000 },
    { label: 'जून', views: 135000, revenue: 68000 },
  ];

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-500" />
            अहवाल व विश्लेषक (Reports & Analytics)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            प्रेक्षक संख्या, वर्गणी महसूल, तक्रार निवारण दर आणि CSV डेटा एक्सपोर्ट
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          CSV अहवाल डाऊनलोड करा (Export)
        </button>
      </div>

      {/* Filter Selector */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">अहवाल प्रकार:</span>
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-orange-400"
          >
            <option value="revenue">महसूल व वर्गणी अहवाल (Revenue Report)</option>
            <option value="grievances">तक्रार निवारण अहवाल (Grievance Resolution)</option>
            <option value="views">व्हिडिओ व बातमी प्रेक्षक अहवाल (Views Report)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">कालावधी:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
          >
            <option value="month">गेले ६ महिने</option>
            <option value="quarter">चालू त्रैमासिक</option>
            <option value="year">वार्षिक २०२६</option>
          </select>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            मासिक वृद्धी आलेख (Monthly Trend)
          </h3>
          <span className="text-xs text-emerald-400 font-semibold">+२८% मासिक वाढ</span>
        </div>

        <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-64 pt-8 border-b border-slate-800">
          {dummyChartData.map((d, i) => {
            const heightPct = Math.round((d.revenue / 70000) * 100);
            return (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{d.revenue.toLocaleString()}
                </span>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-orange-600 to-amber-500 rounded-t-xl transition-all duration-500 group-hover:from-orange-500 group-hover:to-amber-400 shadow-lg"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-xs font-semibold text-slate-300 mt-1">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
