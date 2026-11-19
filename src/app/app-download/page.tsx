'use client';

import React from 'react';
import { Download, Smartphone, CheckCircle2, ShieldCheck, WifiOff, Bell, AlertCircle, Sparkles } from 'lucide-react';

export default function AppDownloadPage() {
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.aurora.ott.app';

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-12 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600/30 text-orange-400 border border-orange-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            अधिकृत ॲन्ड्रॉइड ॲप्लिकेशन (Android App)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ग्रामीण भारत टीव्ही मोबाईल ॲप
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            कमी डेटा वापरात अखंड मराठी चित्रपट, थेट २४ तास Live TV, कृषी बाजारभाव आणि थेट गावपातळीवरून समस्या मांडण्याची डिजिटल सुविधा.
          </p>
        </div>

        {/* Hero Showcase Card */}
        <div className="rounded-3xl bg-gradient-to-br from-green-950/80 via-slate-900 to-orange-950/40 border border-green-800/40 p-8 sm:p-12 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              मातीशी जोडलेले महाराष्ट्राचे पहिले संपूर्ण प्रादेशिक OTT व वृत्त ॲप
            </h2>

            <div className="space-y-4 my-8 text-xs sm:text-sm text-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">४K व हाय-डेफिनिशन HLS स्ट्रीमिंग:</strong>
                  <p className="text-slate-400 text-xs mt-0.5">Bunny.net CDN तंत्रज्ञानामुळे 2G/3G/4G नेटवर्कवरही विना-बफरिंग व्हिडिओ प्ले होतो.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <WifiOff className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">ऑफलाइन डाऊनलोड सुविधा:</strong>
                  <p className="text-slate-400 text-xs mt-0.5">चित्रपट आणि वेब सिरीज एका क्लिकवर डाऊनलोड करा आणि इंटरनेट नसतानाही प्रवासात किंवा शेतात पहा.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">तात्काळ पुश नोटिफिकेशन्स:</strong>
                  <p className="text-slate-400 text-xs mt-0.5">कापूस, सोयाबीन, कांदा बाजारभाव आणि हवामानाचे महत्त्वाचे अलर्ट्स मोबाईलवर सर्वात आधी मिळवा.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">कॅमेरा वापरून थेट तक्रार नोंदणी:</strong>
                  <p className="text-slate-400 text-xs mt-0.5">आपल्या गावातील खड्डे किंवा पाण्याचा तुटवडा थेट मोबाईल कॅमेऱ्याने फोटो काढून तक्रार दाखल करा.</p>
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm shadow-2xl shadow-emerald-600/40 transition-all hover:scale-105 flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                <span>Google Play Store वरून ॲप डाउनलोड करा</span>
              </a>
            </div>
          </div>

          {/* Smartphone Mockup */}
          <div className="relative shrink-0 w-64 sm:w-72">
            <div className="relative mx-auto border-gray-800 bg-gray-900 border-[12px] rounded-[3rem] h-[520px] w-[260px] shadow-2xl shadow-green-950/80 overflow-hidden flex flex-col justify-between">
              <div className="w-24 h-4 bg-gray-800 top-0 left-1/2 -translate-x-1/2 absolute rounded-b-xl z-20" />
              <div className="p-3 pt-6 flex flex-col h-full bg-slate-950 text-white justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-bold text-orange-400">Gramin Bharat TV</span>
                    <span className="text-emerald-400">● Live 1080p</span>
                  </div>

                  <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-slate-900 relative shadow">
                    <img
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"
                      alt="Screen preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow">
                        ▶
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-[10px]">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-bold text-white">
                      🌾 आजचे APMC बाजारभाव थेट
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                      📢 जलजीवन योजनेतून ४५० पाड्यांमध्ये पाणी...
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-orange-600 text-white text-[11px] font-bold text-center">
                  ग्रामीण भारत टीव्ही मोबाईल ॲप
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4">Google Play Store वरून ॲप इन्स्टॉल करण्याची सोपी पद्धत:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold mb-2">१</span>
              <strong className="text-white">Play Store उघडा:</strong>
              <p className="text-slate-400 mt-1">वरील 'Google Play Store' बटणावर क्लिक करा किंवा Play Store मध्ये 'Gramin Bharat TV' शोधा.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold mb-2">२</span>
              <strong className="text-white">Install वर क्लिक करा:</strong>
              <p className="text-slate-400 mt-1">अधिकृत आणि १००% सुरक्षित ॲप तुमच्या मोबाईलमध्ये सेकंदात डाउनलोड होईल.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold mb-2">३</span>
              <strong className="text-white">ॲप उघडा:</strong>
              <p className="text-slate-400 mt-1">आपला मोबाईल क्रमांक किंवा ईमेल टाकून त्वरित मोफत 4K स्ट्रीमिंग सुरू करा.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
