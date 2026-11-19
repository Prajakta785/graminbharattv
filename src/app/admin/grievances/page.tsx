'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  Search,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  ExternalLink,
  Edit2,
  X,
  FileText,
  Sparkles
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { Grievance, GrievanceStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminGrievancesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingGrievance, setEditingGrievance] = useState<Grievance | null>(null);

  // Edit Modal State
  const [status, setStatus] = useState<GrievanceStatus>('pending');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [assignedReporterName, setAssignedReporterName] = useState('');

  const loadData = async () => {
    const list = await dbService.getGrievances();
    setGrievances(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (grv: Grievance) => {
    setEditingGrievance(grv);
    setStatus(grv.status);
    setAdminRemarks(grv.adminRemarks || '');
    setAssignedReporterName(grv.assignedReporterName || 'प्रवीण जगताप (ब्युरो चीफ)');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrievance) return;

    const updated: Grievance = {
      ...editingGrievance,
      status,
      adminRemarks,
      assignedReporterName,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : editingGrievance.resolvedAt,
    };

    await dbService.updateGrievance(updated, user?.name || 'Admin');
    toast(`तक्रार स्थिती अद्ययावत केली: ${updated.trackingId}`, 'success');
    setEditingGrievance(null);
    loadData();
  };

  // Convert Grievance to News Article
  const handleConvertToNews = async (grv: Grievance) => {
    if (confirm(`या तक्रारीचे रूपांतर पोर्टलवरील अधिकृत बातमीमध्ये करायचे का?`)) {
      const article = await dbService.convertGrievanceToNews(grv.id, user?.name || 'Editor');
      if (article) {
        toast(`तक्रारीचे रूपांतर बातमीमध्ये झाले: ${article.titleMr}`, 'success');
        loadData();
      }
    }
  };

  const filtered = grievances.filter(g => {
    const matchesSearch =
      g.trackingId.toLowerCase().includes(search.toLowerCase()) ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.district.toLowerCase().includes(search.toLowerCase()) ||
      g.citizenName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || g.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            नागरिक तक्रार निवारण कक्ष (Public Grievance CMS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            नागरिकांच्या समस्यांची पडताळणी, वार्ताहर नियुक्ती व थेट बातमीत रूपांतर
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ट्रॅकिंग आयडी, नाव, जिल्हा किंवा समस्या शोधा..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['all', 'pending', 'verified', 'in_progress', 'resolved'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedStatus === st
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all'
                ? 'सर्व'
                : st === 'pending'
                ? 'पडताळणी बाकी'
                : st === 'verified'
                ? 'सत्यता पडताळली'
                : st === 'in_progress'
                ? 'प्रगतीपथावर'
                : 'सोडवली'}
            </button>
          ))}
        </div>
      </div>

      {/* Grievances Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3">नोंदणी आयडी</th>
              <th className="pb-3">तक्रारदार</th>
              <th className="pb-3">जिल्हा, तालुका व गाव</th>
              <th className="pb-3">विषय व समस्या शीर्षक</th>
              <th className="pb-3">नियुक्त वार्ताहर</th>
              <th className="pb-3">सद्यस्थिती</th>
              <th className="pb-3 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(grv => (
              <tr key={grv.id} className="text-slate-200">
                <td className="py-3 font-mono font-bold text-orange-400">
                  {grv.trackingId}
                </td>
                <td className="py-3">
                  <p className="font-bold text-white">{grv.citizenName}</p>
                  <p className="font-mono text-slate-400 text-[10px]">{grv.mobileNumber}</p>
                </td>
                <td className="py-3">
                  <p className="text-white font-medium">{grv.village}</p>
                  <p className="text-[10px] text-slate-400">
                    {grv.taluka}, {grv.district}
                  </p>
                </td>
                <td className="py-3 max-w-xs">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-orange-400 mr-1">
                    {grv.categoryMr}
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">{grv.title}</p>
                </td>
                <td className="py-3 text-slate-300">
                  {grv.assignedReporterName || 'अद्याप नाही'}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      grv.status === 'resolved'
                        ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                        : grv.status === 'in_progress'
                        ? 'bg-amber-600/30 text-amber-400 border border-amber-500/40'
                        : grv.status === 'verified'
                        ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {grv.status === 'resolved'
                      ? 'सोडवली'
                      : grv.status === 'in_progress'
                      ? 'प्रगतीपथावर'
                      : grv.status === 'verified'
                      ? 'सत्यता पडताळली'
                      : 'पडताळणी बाकी'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Convert to news button */}
                    {!grv.convertedToNewsId && (
                      <button
                        onClick={() => handleConvertToNews(grv)}
                        className="px-2.5 py-1 rounded-lg bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white border border-orange-500/40 transition-colors text-[10px] font-bold"
                        title="तक्रारीचे बातमीत रूपांतर करा"
                      >
                        📰 बातमी बनवा
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenEdit(grv)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="तपासणी व शेरा"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingGrievance && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="font-mono text-xs text-orange-400 font-bold">
                  {editingGrievance.trackingId}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  तक्रार स्थिती व प्रशासकीय शेरा
                </h3>
              </div>
              <button
                onClick={() => setEditingGrievance(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <p className="font-bold text-white">{editingGrievance.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">{editingGrievance.description}</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  तक्रार स्थिती (Status) *
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as GrievanceStatus)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-orange-400"
                >
                  <option value="pending">प्राथमिक पडताळणी बाकी (Pending)</option>
                  <option value="verified">सत्यता पडताळली (Verified)</option>
                  <option value="in_progress">काम प्रगतीपथावर (In Progress)</option>
                  <option value="resolved">समस्या सोडवली (Resolved)</option>
                  <option value="rejected">फेटाळली (Rejected)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  नियुक्त जिल्हा वार्ताहर (Assigned Reporter)
                </label>
                <input
                  type="text"
                  value={assignedReporterName}
                  onChange={e => setAssignedReporterName(e.target.value)}
                  placeholder="उदा. प्रवीण जगताप (पुणे ब्युरो)"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  प्रशासकीय शेरा व कारवाईची नोंद (Citizen Visible Remarks) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={adminRemarks}
                  onChange={e => setAdminRemarks(e.target.value)}
                  placeholder="स्थानिक PWD किंवा तहसीलदारांशी संपर्क साधला, नवीन ट्रान्सफॉर्मर बसवला..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingGrievance(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold"
                >
                  शेरा जतन करा (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
