'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            कायदेशीर माहिती
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            गोपनीयता धोरण (Privacy Policy)
          </h1>
          <p className="text-xs text-slate-400 mt-1">शेवटचा बदल: नोव्हेंबर २०२६</p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-6 leading-relaxed">
          <p>
            ग्रामीण भारत टीव्ही नेटवर्क ("आम्ही", "आमचे") आपल्या गोपनीयतेचा आदर करते. हे गोपनीयता धोरण स्पष्ट करते की आम्ही आपल्या माहितीचे संकलन, वापर आणि संरक्षण कसे करतो.
          </p>

          <h3 className="text-base font-bold text-white">१. आम्ही संकलित केलेली माहिती:</h3>
          <p>
            - <strong>वैयक्तिक माहिती:</strong> नोंदणी करताना किंवा सबस्क्रिप्शन घेताना आपले नाव, ईमेल, मोबाईल क्रमांक.
            <br />
            - <strong>नागरिक तक्रार माहिती:</strong> तक्रार दाखल करताना गाव, तालुका, समस्या वर्णन आणि छायाचित्रे. आपला मोबाईल क्रमांक जनतेपासून पूर्णतः गोपनीय (Masked) ठेवला जातो.
            <br />
            - <strong>पेमेंट तपशील:</strong> सर्व आर्थिक व्यवहार थेट रिझर्व्ह बँक मान्यताप्राप्त पेमेंट गेटवे (Razorpay) द्वारे सुरक्षितपणे हाताळले जातात; आम्ही आपले कार्ड किंवा नेट बँकिंग पासवर्ड साठवत नाही.
          </p>

          <h3 className="text-base font-bold text-white">२. माहितीचा वापर:</h3>
          <p>
            - अखंड OTT व्हिडिओ स्ट्रीमिंग आणि Live TV सेवा प्रदान करण्यासाठी.
            <br />
            - नागरिक तक्रारींचे स्थानिक शासकीय अधिकाऱ्यांशी संपर्क साधून निवारण करण्यासाठी.
            <br />
            - खाते सुरक्षा, पासवर्ड रीसेट आणि महत्त्वाचे कृषी व हवामान अलर्ट्स पाठवण्यासाठी.
          </p>

          <h3 className="text-base font-bold text-white">३. संपर्क:</h3>
          <p>
            गोपनीयतेसंदर्भात कोणतीही विचारणा असल्यास कृपया <strong>privacy@graminbharattv.in</strong> वर संपर्क साधा.
          </p>
        </div>
      </div>
    </div>
  );
}
