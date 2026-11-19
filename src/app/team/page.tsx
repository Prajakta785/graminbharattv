'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Mail, Phone, MapPin, User, Shield } from 'lucide-react';

export default function TeamPage() {
  const bureauChiefs = [
    {
      nameMr: 'प्रवीण जगताप',
      nameEn: 'Pravin Jagtap',
      role: 'पुणे व पश्चिम महाराष्ट्र ब्युरो चीफ',
      location: 'पुणे, सातारा, सांगली, सोलापूर, कोल्हापूर',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    },
    {
      nameMr: 'सुनील सोनावणे',
      nameEn: 'Sunil Sonawane',
      role: 'उत्तर महाराष्ट्र ब्युरो चीफ',
      location: 'नाशिक, जळगाव, धुळे, नंदुरबार, अहिल्यानगर',
      photoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    },
    {
      nameMr: 'गणेश शिंदे',
      nameEn: 'Ganesh Shinde',
      role: 'मराठवाडा विभाग प्रमुख',
      location: 'छत्रपती संभाजीनगर, जालना, बीड, लातूर, नांदेड, परभणी, हिंगोली, धाराशिव',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      nameMr: 'अशोक मडावी',
      nameEn: 'Ashok Madavi',
      role: 'विदर्भ विशेष ब्युरो चीफ',
      location: 'नागपूर, अमरावती, गडचिरोली, चंद्रपूर, यवतमाळ, अकोला, बुलढाणा',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      nameMr: 'अमोल कदम',
      nameEn: 'Amol Kadam',
      role: 'कोकण विभाग प्रमुख',
      location: 'ठाणे, पालघर, रायगड, रत्नागिरी, सिंधुदुर्ग',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-12 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2 block">
            संपादकीय व व्यवस्थापन (Leadership & Editorial Team)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ग्रामीण भारत टीव्हीचे नेतृत्व
          </h1>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            अनुभवी पत्रकार, डिजिटल तंत्रज्ञान तज्ज्ञ आणि ग्रामीण विकास अभ्यासकांचे समर्पित पथक
          </p>
        </div>

        {/* Managing Director Profile (id="md") */}
        <div id="md" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-green-950/60 via-slate-900 to-slate-900 border border-green-800/40 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden bg-slate-950 border-2 border-orange-500/50 shadow-2xl shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              alt="Managing Director"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600/30 text-orange-400 border border-orange-500/40 inline-block">
              व्यवस्थापकीय संचालक (Managing Director & Editor-in-Chief)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              मा. श्री. बाळकृष्ण (बाळासाहेब) पाटील
            </h2>
            <p className="text-xs text-orange-400 font-semibold">
              ज्येष्ठ कृषी पत्रकार व संस्थापक, ग्रामीण भारत टीव्ही नेटवर्क
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              "गेल्या २५ वर्षांपासून महाराष्ट्राच्या शेती, पाणी आणि ग्रामीण अर्थकारणाचा प्रत्यक्ष अभ्यास करताना एक गोष्ट जाणवली – खेड्यातील माणसाचा खरा आवाज मुंबई-पुण्यातील मोठ्या वाहिन्यांवर हवा तसा उमटत नाही. 'ग्रामीण भारत टीव्ही' याच जाणिवेतून जन्माला आला आहे. तंत्रज्ञानाचा वापर करून खेड्यापाड्यातील प्रश्न तात्काळ सोडवणे आणि अस्सल मराठी संस्कृती जगासमोर आणणे हाच आमचा ध्यास आहे."
            </p>
          </div>
        </div>

        {/* Regional Bureau Chiefs */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 border-l-4 border-orange-500 pl-3">
            विभागीय ब्युरो चीफ (Regional Bureau Chiefs)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bureauChiefs.map((chief, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                    <img src={chief.photoUrl} alt={chief.nameMr} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{chief.nameMr}</h3>
                    <p className="text-[11px] text-orange-400 font-semibold">{chief.role}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-500 block">कार्यक्षेत्र (Districts):</span>
                  <p className="text-slate-200 mt-0.5 leading-relaxed">{chief.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
