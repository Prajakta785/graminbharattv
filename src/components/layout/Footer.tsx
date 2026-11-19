'use client';

import React from 'react';
import Link from 'next/link';
import {
  Tv,
  MapPin,
  ShieldCheck,
  Scale,
  Award,
  Heart
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white/95 rounded-xl p-1.5 shadow-md group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="ग्रामीण भारत TV Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white leading-tight">
                  {language === 'en' ? 'Gramin Bharat TV' : 'ग्रामीण भारत TV'}
                </span>
                <span className="text-xs text-orange-400 font-medium">
                  OTT, NEWS & CITIZEN PORTAL
                </span>
              </div>
            </Link>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              &quot;{t('tagline')}&quot;
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CIN: <strong className="text-white">U92100MH2026PTC389104</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>GSTIN: <strong className="text-white">27AABCG1234F1Z8</strong></span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {language === 'en'
                    ? 'Gram Samvad Bhavan, F.C. Road, Shivajinagar, Pune, Maharashtra - 411005'
                    : 'ग्राम संवाद भवन, एफ.सी. रोड, शिवाजीनगर, पुणे, महाराष्ट्र - ४११००५'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-orange-500 pl-2.5">
              {language === 'en' ? 'Platform Navigation' : 'प्लॅटफॉर्म नेव्हिगेशन'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/movies" className="hover:text-white transition-colors">
                  {t('movies')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  {t('news')}
                </Link>
              </li>
              <li>
                <Link href="/podcasts" className="hover:text-white transition-colors">
                  {t('podcasts')}
                </Link>
              </li>
              <li>
                <Link href="/grievance" className="hover:text-white transition-colors text-orange-400 font-semibold">
                  {t('publicGrievance')}
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="hover:text-white transition-colors">
                  {t('subscriptions')} (₹399)
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate & Bureau */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-green-600 pl-2.5">
              {language === 'en' ? 'Organization & Bureau' : 'संस्था व व्यवस्थापन'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  {language === 'en' ? 'Editorial Board & Team' : 'संपादकीय मंडळ व संचालक'}
                </Link>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.aurora.ott.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 text-emerald-400 font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>📲 {t('appDownload')} (Google Play)</span>
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-emerald-400 transition-colors font-semibold">
                  {t('adminPanel')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Compliance & Grievance Redressal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-amber-500 pl-2.5">
              {language === 'en' ? 'Legal & Compliance' : 'कायदेशीर व तक्रार निवारण'}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="font-bold text-slate-200">Grievance Officer (IT Rules):</p>
                <p className="text-[11px] text-orange-400 mt-0.5">
                  {language === 'en' ? 'Adv. Suhas Deshmukh' : 'एड. सुहास देशमुख'}
                </p>
                <p className="text-[10px] text-slate-400">grievance@graminbharattv.in</p>
                <p className="text-[10px] text-slate-400">+91 94230 00002</p>
              </div>

              <ul className="space-y-1.5 text-xs pt-1">
                <li>
                  <Link href="/legal/grievance-redressal" className="hover:text-white transition-colors flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-orange-400" />
                    {language === 'en' ? 'Grievance Redressal (IT Rules)' : 'तक्रार निवारण नियम (IT Rules 2021)'}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/ethics" className="hover:text-white transition-colors">
                    {t('ethics')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-white transition-colors">
                    {t('privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="hover:text-white transition-colors">
                    {t('terms')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/refund" className="hover:text-white transition-colors">
                    {t('refund')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 {t('allRightsReserved')}</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>
              {language === 'en'
                ? 'Dedicated to the farmers & rural citizens of Maharashtra'
                : 'महाराष्ट्रातील शेतकऱ्यांच्या सेवेसाठी समर्पित'}
            </span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
