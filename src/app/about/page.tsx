'use client';

import React from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-12 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2 block">
            आमच्याबद्दल (About Gramin Bharat TV)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            मातीची नाळ, महाराष्ट्राचा आवाज
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl mx-auto">
            "ग्रामीण भारत टीव्ही (Gramin Bharat TV)" हे महाराष्ट्रातील शेतकरी, कष्टकरी आणि ग्रामीण भागातील जनतेचे हक्काचे डिजिटल व्यासपीठ आहे.
          </p>
        </div>

        {/* Corporate Details */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
            अधिकृत संस्थात्मक माहिती (Corporate Registration Details)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">कंपनी नोंदणी क्रमांक (CIN):</span>
              <strong className="text-white font-mono text-sm">U92100MH2026PTC389104</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">जीएसटी क्रमांक (GSTIN):</span>
              <strong className="text-white font-mono text-sm">27AABCG1234F1Z8</strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">नोंदणीकृत मुख्य कार्यालय:</span>
              <p className="text-slate-200 mt-1">ग्राम संवाद भवन, एफ.सी. रोड, शिवाजीनगर, पुणे, महाराष्ट्र - ४११००५</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">संपर्क व ईमेल:</span>
              <p className="text-orange-400 mt-1">contact@graminbharattv.in • +91 94230 00000</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/team"
            className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 inline-flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            आमचे संपादकीय मंडळ व संचालक भेटा
          </Link>
        </div>
      </div>
    </div>
  );
}
