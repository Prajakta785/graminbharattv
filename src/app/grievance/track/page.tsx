'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Shield,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { Grievance, GrievanceStatus } from '@/types';

function GrievanceTrackingContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [trackingQuery, setTrackingQuery] = useState(initialId);
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchGrievance = async (idToSearch: string) => {
    if (!idToSearch.trim()) return;
    setLoading(true);
    setSearched(true);
    const result = await dbService.getGrievanceByTrackingId(idToSearch.trim());
    setGrievance(result);
    setLoading(false);
  };

  useEffect(() => {
    if (initialId) {
      searchGrievance(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchGrievance(trackingQuery);
  };

  const getStatusBadge = (status: GrievanceStatus) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> समस्या सोडवली (Resolved)
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600/30 text-amber-400 border border-amber-500/50 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> काम प्रगतीपथावर (In Progress)
          </span>
        );
      case 'verified':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center gap-1.5">
            <Shield className="w-4 h-4" /> तक्रार पडताळली (Verified)
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600/30 text-rose-400 border border-rose-500/50 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> फेटाळली (Rejected)
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> प्राथमिक पुनरावलोकन (Pending)
          </span>
        );
    }
  };

  const steps = [
    { key: 'pending', label: 'तक्रार दाखल' },
    { key: 'verified', label: 'सत्यता पडताळणी' },
    { key: 'in_progress', label: 'प्रशासकीय पाठपुरावा' },
    { key: 'resolved', label: 'समस्या निवारण' },
  ];

  const getStepIndex = (status: GrievanceStatus) => {
    if (status === 'pending') return 0;
    if (status === 'verified') return 1;
    if (status === 'in_progress') return 2;
    if (status === 'resolved') return 3;
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center justify-center gap-1.5 mb-2">
          <Search className="w-3.5 h-3.5" />
          तक्रार ट्रॅकिंग यंत्रणा
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          आपल्या तक्रारीची सद्यस्थिती तपासा
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          आपला तक्रार आयडी (उदा. <code className="text-orange-400 font-mono">GB-2026-MH-4821</code>) प्रविष्ट करा.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row gap-3 mb-10"
      >
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder="तक्रार क्रमांक टाका (उदा. GB-2026-MH-4821)"
            value={trackingQuery}
            onChange={e => setTrackingQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-orange-500 uppercase"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'शोधत आहे...' : 'स्थिती पहा (Track)'}
        </button>
      </form>

      {/* Results Area */}
      {searched && (
        <div>
          {!grievance ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">या क्रमांकाची तक्रार सापडली नाही</h3>
              <p className="text-xs text-slate-400">
                कृपया आपण योग्य ट्रॅकिंग आयडी प्रविष्ट केला आहे याची खात्री करा.
              </p>
              <div className="pt-2 text-xs text-slate-400">
                नमुना तपासणीसाठी वापरा:{' '}
                <button
                  onClick={() => {
                    setTrackingQuery('GB-2026-MH-4821');
                    searchGrievance('GB-2026-MH-4821');
                  }}
                  className="text-orange-400 font-mono font-bold hover:underline"
                >
                  GB-2026-MH-4821
                </button>{' '}
                किंवा{' '}
                <button
                  onClick={() => {
                    setTrackingQuery('GB-2026-MH-7912');
                    searchGrievance('GB-2026-MH-7912');
                  }}
                  className="text-emerald-400 font-mono font-bold hover:underline"
                >
                  GB-2026-MH-7912 (निवारण झालेली)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-wider">
                    नोंदणी क्रमांक: {grievance.trackingId}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {grievance.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    {grievance.village}, तालुका: {grievance.taluka}, जिल्हा: {grievance.district}
                  </p>
                </div>
                <div>{getStatusBadge(grievance.status)}</div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  तक्रार निवारण प्रगती (Resolution Timeline)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                  {steps.map((st, idx) => {
                    const currentIdx = getStepIndex(grievance.status);
                    const isComplete = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={st.key} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-lg ${
                            isComplete
                              ? 'bg-orange-600 text-white shadow-orange-600/30'
                              : 'bg-slate-800 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-orange-500/30' : ''}`}
                        >
                          {isComplete ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs font-bold ${
                            isComplete ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    तक्रारदार तपशील
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">तक्रारदाराचे नाव:</span>
                      <span className="font-bold text-white">{grievance.citizenName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">मोबाईल:</span>
                      <span className="font-mono text-emerald-400">{grievance.mobileNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">वर्गवारी:</span>
                      <span className="text-orange-400 font-semibold">{grievance.categoryMr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">दाखल दिनांक:</span>
                      <span>{new Date(grievance.submittedAt).toLocaleDateString('mr-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    नियुक्त वार्ताहर व पाठपुरावा
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">जिल्हा प्रतिनिधी:</span>
                      <span className="font-bold text-white">
                        {grievance.assignedReporterName || 'जिल्हा बातमी कक्ष'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ब्युरो:</span>
                      <span>{grievance.district} जिल्हा बातमी कक्ष</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">शेवटचा अपडेट:</span>
                      <span>{new Date(grievance.updatedAt).toLocaleDateString('mr-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Remarks */}
              {grievance.adminRemarks && (
                <div className="p-5 rounded-2xl bg-orange-950/20 border-l-4 border-orange-500">
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                    प्रशासकीय शेरा व कारवाईची नोंद:
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {grievance.adminRemarks}
                  </p>
                </div>
              )}

              {/* Evidence Photos */}
              {grievance.photoUrls && grievance.photoUrls.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    संलग्न छायाचित्र पुरावे:
                  </h4>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {grievance.photoUrls.map((url, i) => (
                      <div
                        key={i}
                        className="w-48 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0"
                      >
                        <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Converted to News Article link */}
              {grievance.convertedToNewsId && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-emerald-300">
                      या समस्येवर ग्रामीण भारत टीव्हीने विशेष बातमी प्रसिद्ध केली आहे!
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      शासकीय प्रशासनाचे लक्ष वेधण्यासाठी हे वृत्त पोर्टलवर लाइव्ह आहे.
                    </p>
                  </div>
                  <Link
                    href={`/news/${grievance.convertedToNewsId}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5"
                  >
                    बातमी पहा <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GrievanceTrackingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-10 select-none">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <GrievanceTrackingContent />
      </Suspense>
    </div>
  );
}
