'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, ShieldCheck, Tv, Key, Smartphone } from 'lucide-react';
import { dbService } from '@/lib/db';
import { SiteSettings } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await dbService.getSettings();
      setSettings(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await dbService.saveSettings(settings, user?.name || 'Admin');
    toast('वेबसाइट व कॉर्पोरेट सेटिंग्ज यशस्वीरित्या जतन केल्या!', 'success');
  };

  if (loading || !settings) return null;

  return (
    <div className="space-y-6 select-none max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-500" />
            वेबसाइट व कॉर्पोरेट सेटिंग्ज (Platform Settings)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            CIN, GSTIN, तक्रार निवारण अधिकारी, Bunny.net व Razorpay इंटीग्रेशन कीज
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Corporate & Legal Details */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            १. कंपनी नोंदणी व वैधानिक तपशील (Corporate & Statutory Info)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                कंपनी नोंदणी क्रमांक (CIN)
              </label>
              <input
                type="text"
                value={settings.cin}
                onChange={e => setSettings({ ...settings, cin: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                जीएसटी क्रमांक (GSTIN)
              </label>
              <input
                type="text"
                value={settings.gstin}
                onChange={e => setSettings({ ...settings, gstin: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-semibold mb-1">
              नोंदणीकृत मुख्य कार्यालय पत्ता
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
            />
          </div>
        </div>

        {/* 2. Grievance Redressal Officer (IT Rules 2021) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            २. तक्रार निवारण अधिकारी (Grievance Officer - IT Rules 2021)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">अधिकाऱ्याचे नाव</label>
              <input
                type="text"
                value={settings.grievanceOfficerName}
                onChange={e => setSettings({ ...settings, grievanceOfficerName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">ईमेल</label>
              <input
                type="email"
                value={settings.grievanceOfficerEmail}
                onChange={e => setSettings({ ...settings, grievanceOfficerEmail: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">फोन / हेल्पलाईन</label>
              <input
                type="text"
                value={settings.grievanceOfficerPhone}
                onChange={e => setSettings({ ...settings, grievanceOfficerPhone: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Bunny.net Stream & Video CDN */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Tv className="w-4 h-4 text-purple-400" />
            ३. Bunny.net Stream Integration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Bunny Stream Video Library ID *
              </label>
              <input
                type="text"
                value={settings.bunnyLibraryId}
                onChange={e => setSettings({ ...settings, bunnyLibraryId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-orange-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">डिफॉल्ट: 809137</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                API Key स्थिती (Environment)
              </label>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between">
                <span>BUNNY_STREAM_API_KEY</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-600/30 text-emerald-400">
                  कॉन्फिगर केलेले आहे
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Android APK & Play Store Links */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Smartphone className="w-4 h-4 text-blue-400" />
            ४. ॲन्ड्रॉइड ॲप डाऊनलोड लिंक्स
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                अधिकृत APK Download URL
              </label>
              <input
                type="url"
                value={settings.androidApkUrl}
                onChange={e => setSettings({ ...settings, androidApkUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Google Play Store Package URL
              </label>
              <input
                type="url"
                value={settings.playStoreUrl}
                onChange={e => setSettings({ ...settings, playStoreUrl: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-xl shadow-orange-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            सर्व बदल जतन करा (Save Settings)
          </button>
        </div>
      </form>
    </div>
  );
}
