'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            कायदेशीर करार
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            नियम व अटी (Terms & Conditions)
          </h1>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
          <p>
            ग्रामीण भारत टीव्ही वेबसाइट आणि ॲप वापरताना आपण खालील अटी व शर्तींना सहमती दर्शवत आहात.
          </p>

          <h3 className="text-base font-bold text-white">१. बौद्धिक संपदा हक्क:</h3>
          <p>
            या प्लॅटफॉर्मवरील सर्व चित्रपट, मालिका, बातम्या, ऑडिओ पॉडकास्ट, लोगो आणि ग्राफिक्स ग्रामीण भारत टीव्ही नेटवर्क किंवा त्यांच्या परवानाधारक मालकांच्या अधिकारात आहेत. परवानगीशिवाय पुनरुत्पादन किंवा अनधिकृत प्रसारण दंडनीय अपराध आहे.
          </p>

          <h3 className="text-base font-bold text-white">२. सबस्क्रिप्शन व स्ट्रीमिंग:</h3>
          <p>
            प्रीमियम सबस्क्रिप्शन वैयक्तिक आणि गैर-व्यावसायिक वापरासाठी आहे. वार्षिक प्लॅन एकाच वेळी ४ स्क्रीन्सवर तर मासिक मोबाईल प्लॅन एका मोबाईलवर वापरता येईल.
          </p>

          <h3 className="text-base font-bold text-white">३. नागरिक तक्रार आचारसंहिता:</h3>
          <p>
            नागरिक तक्रार दाखल करताना खोटी, दिशाभूल करणारी, बदनामीकारक किंवा समाजविघातक माहिती देणे प्रतिबंधित आहे. अशा कृत्यांसाठी कायदेशीर कारवाई केली जाऊ शकते.
          </p>
        </div>
      </div>
    </div>
  );
}
