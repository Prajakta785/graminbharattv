'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Tv,
  Newspaper,
  AlertCircle,
  Users,
  CreditCard,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  Sparkles
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { AuditLog } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [s, logs] = await Promise.all([
      dbService.getDashboardStats(),
      dbService.getAuditLogs(),
    ]);
    setStats(s);
    setAuditLogs(logs.slice(0, 6));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('gbtv_data_updated', handleUpdate);
    return () => window.removeEventListener('gbtv_data_updated', handleUpdate);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    {
      title: 'सक्रिय वर्गणीदार (Subscribers)',
      value: stats.activeSubscribers.toLocaleString(),
      subtext: 'वार्षिक व मासिक ग्राहक',
      icon: Users,
      color: 'from-orange-600 to-amber-600',
    },
    {
      title: 'एकूण महसूल (Revenue)',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subtext: `${stats.totalTransactions} यशस्वी व्यवहार`,
      icon: CreditCard,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      title: 'नागरिक तक्रारी (Grievances)',
      value: stats.totalGrievances,
      subtext: `${stats.pendingGrievances} प्रलंबित • ${stats.resolvedGrievances} सोडवल्या`,
      icon: AlertCircle,
      color: 'from-red-600 to-rose-600',
    },
    {
      title: 'प्रसिद्ध बातम्या (News Articles)',
      value: stats.totalNews,
      subtext: '३६ जिल्ह्यांतील वार्तांकन',
      icon: Newspaper,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      title: 'चित्रपट व माहितीपट (Movies)',
      value: stats.totalMovies,
      subtext: 'Bunny.net Stream 809137',
      icon: Film,
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: 'वेब सिरीज भाग (Episodes)',
      value: stats.totalEpisodes,
      subtext: `${stats.totalSeries} मूळ मालिका`,
      icon: Tv,
      color: 'from-amber-600 to-yellow-600',
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-900 border border-orange-600/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow">
            प्रशासक नियंत्रण कक्ष
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            ग्रामीण भारत टीव्ही • केंद्रीय डॅशबोर्ड
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            महाराष्ट्रातील २ लाईव्ह चॅनेल, शेती बातम्या, नागरिक तक्रारी आणि महसूल नियंत्रण
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/news"
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            नवी बातमी जोडा
          </Link>
          <Link
            href="/admin/movies"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2"
          >
            <Film className="w-4 h-4" />
            चित्रपट जोडा
          </Link>
          <Link
            href="/admin/grievances"
            className="px-4 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 font-semibold text-xs border border-red-800 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            तक्रारी पहा
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">{kpi.title}</p>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">{kpi.value}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{kpi.subtext}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live System Status & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Audit Trail */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" />
              अलीकडील प्रशासकीय नोंदी (Audit Trail)
            </h3>
            <Link href="/admin/audit" className="text-xs text-orange-400 hover:underline">
              सर्व लॉग्स →
            </Link>
          </div>

          <div className="space-y-3">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.adminName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-orange-400">
                      {log.module}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick System Health */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            सिस्टीम स्थिती (Infrastructure)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Bunny.net Stream</p>
                <p className="text-[10px] text-slate-400">Library ID: 809137</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                कनेक्टेड (Online)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Razorpay Gateway</p>
                <p className="text-[10px] text-slate-400">UPI / Cards / NetBanking</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                सक्रिय (Active)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">HLS Live Stream १</p>
                <p className="text-[10px] text-slate-400">Gramin Bharat Live</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                ON AIR
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">HLS Live Stream २</p>
                <p className="text-[10px] text-slate-400">Namdar Maharashtra Live</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                ON AIR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
