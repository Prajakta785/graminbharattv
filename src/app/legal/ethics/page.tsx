'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function EthicsPage() {
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
            संपादकीय मूल्ये
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            डिजिटल मीडिया आचारसंहिता (Code of Ethics)
          </h1>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
          <p>
            ग्रामीण भारत टीव्ही भारतीय प्रेस परिषद (PCI) आणि डिजिटल न्यूज पब्लिशर्स असोसिएशन (DNPA) च्या मार्गदर्शक तत्त्वांचे काटेकोर पालन करते.
          </p>

          <h3 className="text-base font-bold text-white">१. अचूकता आणि वस्तुनिष्ठता:</h3>
          <p>
            कोणतीही बातमी प्रसिद्ध करण्यापूर्वी संबंधित जिल्हा वार्ताहर, स्थानिक प्रत्यक्षदर्शी किंवा अधिकृत कागदपत्रांद्वारे वस्तुस्थितीची १००% पडताळणी केली जाते.
          </p>

          <h3 className="text-base font-bold text-white">२. शेतकऱ्यांची व वंचित घटकांची बाजू:</h3>
          <p>
            आम्ही कॉर्पोरेट किंवा राजकीय दबावाला बळी न पडता दुष्काळ, पीक विमा भरपाई, कृषी मालाचे दर आणि पायाभूत सुविधांच्या अभावाबाबत निष्पक्षपणे वार्तांकन करण्यास बांधील आहोत.
          </p>

          <h3 className="text-base font-bold text-white">३. दुरुस्तीचे धोरण:</h3>
          <p>
            अनावधानाने कोणतीही चूक निदर्शनास आल्यास आम्ही त्याच वेगाने आणि प्रामाणिकपणे ती दुरुस्त करून वाचकांना योग्य माहिती देतो.
          </p>
        </div>
      </div>
    </div>
  );
}
