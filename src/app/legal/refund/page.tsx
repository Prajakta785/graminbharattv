'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPage() {
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
            आर्थिक धोरण
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            परतावा व रद्द करण्याचे धोरण (Refund & Cancellation Policy)
          </h1>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
          <p>
            ग्रामीण भारत टीव्ही ग्राहकांच्या पारदर्शक व्यवहारांना सर्वोच्च प्राधान्य देते.
          </p>

          <h3 className="text-base font-bold text-white">१. सबस्क्रिप्शन रद्द करणे:</h3>
          <p>
            आपण आपल्या प्रोफाइल पृष्ठावरून कधीही पुढील कालावधीचे ऑटो-रिन्यूअल बंद करू शकता. चालू कालावधी संपेपर्यंत आपल्याला सर्व प्रीमियम सेवा अखंड सुरू राहतील.
          </p>

          <h3 className="text-base font-bold text-white">२. दुहेरी किंवा चुकीचे पेमेंट (Double Debits):</h3>
          <p>
            तांत्रिक कारणामुळे एकाच व्यवहारासाठी दोनदा रक्कम कापली गेल्यास, अतिरिक्त रक्कम ५ ते ७ कार्यालयीन दिवसांच्या आत मूळ बँक खात्यात / UPI खात्यात आपोआप जमा केली जाईल.
          </p>

          <h3 className="text-base font-bold text-white">३. परतावा मागणी कशी करावी:</h3>
          <p>
            पेमेंट पावती किंवा बँक मेसेजचा स्क्रीनशॉट जोडून <strong>billing@graminbharattv.in</strong> वर ईमेल करा. आमचे लेखा पथक २४ तासांत पडताळणी करेल.
          </p>
        </div>
      </div>
    </div>
  );
}
