'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';

export default function GrievanceRedressalPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-12 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> मुख्यपृष्ठावर परत जा
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-2 block">
            कायदेशीर अनुपालन (Legal Compliance)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            तक्रार निवारण धोरण व माहिती तंत्रज्ञान नियम (IT Rules 2021)
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Compliance under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
          </p>
        </div>

        {/* Grievance Officer Box */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-orange-500/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 border border-orange-500/40 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">तक्रार निवारण अधिकारी (Grievance Redressal Officer)</h2>
              <p className="text-xs text-orange-400 font-semibold">नियम ११(२)(अ) अंतर्गत अधिकृत नियुक्ती</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">अधिकाऱ्याचे नाव व पद:</span>
              <strong className="text-white text-sm">एड. सुहास देशमुख</strong>
              <p className="text-[11px] text-slate-400 mt-0.5">वरिष्ठ विधी सल्लागार व तक्रार निवारण अधिकारी</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block mb-1">ईमेल व संपर्क:</span>
              <strong className="text-orange-400 text-sm">grievance@graminbharattv.in</strong>
              <p className="text-[11px] text-slate-400 mt-0.5">दूरध्वनी: +91 94230 00002</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500 block mb-1">पत्ता:</span>
            <p>ग्राम संवाद भवन, एफ.सी. रोड, शिवाजीनगर, पुणे, महाराष्ट्र - ४११००५</p>
          </div>
        </div>

        {/* Legal Text */}
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
          <h3 className="text-base font-bold text-white">१. तक्रार दाखल करण्याची प्रक्रिया:</h3>
          <p>
            ग्रामीण भारत टीव्ही (वेबसाइट, मोबाइल ॲप किंवा Live TV) वर प्रसारित झालेल्या कोणत्याही बातमी, व्हिडिओ, मजकूर किंवा सामग्रीबाबत आक्षेप असल्यास नागरिक किंवा संस्था वरील ईमेलवर लेखी तक्रार नोंदवू शकतात. तक्रारीमध्ये बातमीची तारीख, लिंक आणि आक्षेपाचे कारण स्पष्टपणे नमूद असावे.
          </p>

          <h3 className="text-base font-bold text-white">२. निवारणाची कालमर्यादा:</h3>
          <p>
            माहिती तंत्रज्ञान नियम २०२१ नुसार तक्रार प्राप्त झाल्याची पोहोच पावती २४ तासांच्या आत दिली जाईल आणि संपूर्ण चौकशी करून १५ दिवसांच्या आत त्यावर अंतिम निर्णय घेतला जाईल किंवा दुरुस्ती केली जाईल.
          </p>

          <h3 className="text-base font-bold text-white">३. स्वयंनियमन संस्था (Self-Regulatory Body):</h3>
          <p>
            ग्रामीण भारत टीव्ही केंद्र सरकारच्या माहिती व प्रसारण मंत्रालयाद्वारे (MIB) मान्यताप्राप्त डिजिटल न्यूज प्रकाशक स्वयंनियमन संस्थेशी संलग्न असून संस्थेच्या मार्गदर्शक तत्त्वांचे तंतोतंत पालन करते.
          </p>
        </div>
      </div>
    </div>
  );
}
