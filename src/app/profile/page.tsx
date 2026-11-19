'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Shield,
  Clock,
  Sparkles,
  Heart,
  CreditCard,
  FileText,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/lib/db';
import { Movie, WebSeries, PaymentTransaction, Grievance } from '@/types';
import { ContentCard } from '@/components/ui/ContentCard';
import { useToast } from '@/context/ToastContext';

export default function ProfilePage() {
  const { user, logout, switchRole, userRole } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'subscription' | 'watchlist' | 'history' | 'payments' | 'grievances'>('subscription');
  const [watchlistItems, setWatchlistItems] = useState<(Movie | WebSeries)[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    const load = async () => {
      const [movies, series, txs, grvs] = await Promise.all([
        dbService.getMovies(),
        dbService.getWebSeries(),
        dbService.getTransactions(),
        dbService.getGrievances(),
      ]);

      const allContent = [...movies, ...series];
      const saved = allContent.filter(item => user?.watchlist?.includes(item.id));
      setWatchlistItems(saved);
      setTransactions(txs);
      setGrievances(grvs);
    };

    load();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-4 text-white">
        <User className="w-16 h-16 text-slate-500 mb-4" />
        <h2 className="text-xl font-bold">कृपया लॉगिन करा</h2>
        <Link href="/admin/login" className="mt-4 px-6 py-2.5 rounded-xl bg-orange-600 text-xs font-bold">
          लॉगिन पृष्ठावर जा
        </Link>
      </div>
    );
  }

  const isSubscribed = user.subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-10 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-950 text-orange-400 border border-orange-800">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {isSubscribed ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    सक्रिय प्रीमियम सदस्य
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                    मोफत सदस्य (Free Tier)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick role switcher for demo */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 pl-2">भूमिका चाचणी:</span>
              <select
                value={userRole}
                onChange={e => {
                  switchRole(e.target.value as any);
                  toast(`भूमिका बदलली: ${e.target.value}`, 'info');
                }}
                className="bg-transparent text-xs text-orange-400 font-bold focus:outline-none pr-2 cursor-pointer"
              >
                <option value="super_admin">Super Admin</option>
                <option value="news_editor">News Editor</option>
                <option value="content_manager">Content Manager</option>
                <option value="video_manager">Video Manager</option>
                <option value="reporter">Reporter</option>
                <option value="finance_manager">Finance Manager</option>
                <option value="user">Regular User</option>
              </select>
            </div>

            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              लॉग आउट
            </button>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-800 scrollbar-none">
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'subscription'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            सबस्क्रिप्शन तपशील
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'watchlist'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            माझी यादी ({watchlistItems.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            पाहिलेले व्हिडिओ ({user.watchHistory?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            पेमेंट व्यवहार व पावत्या
          </button>

          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'grievances'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            माझ्या दाखल तक्रारी
          </button>
        </div>

        {/* Tab 1: Subscription */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            {isSubscribed && user.subscription ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/50 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow">
                    सक्रिय सबस्क्रिप्शन
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    ID: {user.subscription.paymentId}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{user.subscription.planName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">सुरू दिनांक:</span>
                    <p className="font-bold text-white mt-1">{user.subscription.startDate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">मुदत संपण्याचा दिनांक:</span>
                    <p className="font-bold text-orange-400 mt-1">{user.subscription.expiryDate}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">भरलेली रक्कम:</span>
                    <p className="font-bold text-emerald-400 mt-1">₹{user.subscription.amount}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-orange-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">आपल्याकडे सक्रिय सबस्क्रिप्शन नाही</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  सर्व प्रीमियम चित्रपट, वेब सिरीज आणि जाहिरातमुक्त Live TV पाहण्यासाठी आजच प्रीमियम प्लॅन सुरू करा.
                </p>
                <Link
                  href="/subscribe"
                  className="inline-block px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30"
                >
                  सबस्क्रिप्शन प्लॅन्स पहा (₹३९९/वर्ष)
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Watchlist */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlistItems.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">आपल्या यादीत चित्रपट नाहीत</h3>
                <Link href="/movies" className="mt-3 inline-block text-xs text-orange-400 hover:underline">
                  चित्रपट पहा व जोडा →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlistItems.map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    type={'duration' in item ? 'movie' : 'series'}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {(!user.watchHistory || user.watchHistory.length === 0) ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">पाहिल्या गेलेल्या व्हिडिओंची नोंद नाही</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.watchHistory.map(item => (
                  <Link
                    key={item.contentId}
                    href={item.contentType === 'movie' ? `/movies/${item.contentId}` : `/series/${item.contentId}`}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 flex gap-4 items-center transition-all"
                  >
                    <div className="w-20 aspect-video rounded-xl overflow-hidden bg-slate-950 shrink-0">
                      <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        शेवटचे पाहिले: {new Date(item.lastWatchedAt).toLocaleDateString('mr-IN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Payments & Invoices */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">कोणतेही पेमेंट व्यवहार नाहीत</h3>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">पावती क्रमांक (Invoice)</th>
                      <th className="pb-3">प्लॅन</th>
                      <th className="pb-3">रक्कम</th>
                      <th className="pb-3">पद्धत</th>
                      <th className="pb-3">दिनांक</th>
                      <th className="pb-3">स्थिती</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="text-slate-200">
                        <td className="py-3 font-mono font-bold text-white">{tx.invoiceNumber}</td>
                        <td className="py-3">{tx.planId === 'annual_premium' ? 'वार्षिक प्रीमियम' : 'मासिक मोबाईल'}</td>
                        <td className="py-3 font-bold text-emerald-400">₹{tx.amount}</td>
                        <td className="py-3 text-slate-400">{tx.paymentMethod}</td>
                        <td className="py-3">{new Date(tx.createdAt).toLocaleDateString('mr-IN')}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                            यशस्वी (Success)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Grievances */}
        {activeTab === 'grievances' && (
          <div className="space-y-4">
            {grievances.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">कोणतीही तक्रार नोंदवलेली नाही</h3>
                <Link href="/grievance" className="mt-3 inline-block text-xs text-orange-400 hover:underline">
                  नवीन तक्रार नोंदवा →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {grievances.map(grv => (
                  <div
                    key={grv.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-orange-400 font-bold text-xs">
                          {grv.trackingId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {grv.categoryMr}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{grv.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {grv.village}, {grv.taluka}, {grv.district}
                      </p>
                    </div>
                    <Link
                      href={`/grievance/track?id=${grv.trackingId}`}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shrink-0 text-center"
                    >
                      स्थिती पहा
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
