'use client';

import React from 'react';
import { Download, Bell, WifiOff, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const AppDownloadBanner: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 select-none">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-950 via-slate-950 to-orange-950/60 border border-green-800/40 p-8 sm:p-12 shadow-2xl">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Text */}
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600/30 text-orange-400 border border-orange-500/40 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              {t('appTag')}
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {language === 'en' ? (
                <>Download <span className="text-orange-500">Gramin Bharat TV</span> Android App</>
              ) : (
                <>{t('appTitle')}</>
              )}
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('appDesc')}
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('appBenefit1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{t('appBenefit2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('appBenefit3')}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{t('appBenefit4')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8">
              <a
                href="https://play.google.com/store/apps/details?id=com.aurora.ott.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm shadow-2xl shadow-emerald-600/40 transition-all hover:scale-105 flex items-center gap-2.5"
              >
                <Download className="w-5 h-5 text-white" />
                <span>Google Play वरून ॲप डाउनलोड करा</span>
              </a>
            </div>
          </div>

          {/* Right Phone Mockup Illustration */}
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="relative w-64 h-[440px] rounded-[40px] bg-slate-900 border-4 border-slate-700 shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden">
              {/* Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* Inner UI Preview */}
              <div className="flex-1 bg-slate-950 rounded-[30px] p-3 flex flex-col justify-between overflow-hidden border border-slate-800">
                <div className="space-y-2">
                  <div className="h-28 rounded-2xl bg-gradient-to-tr from-green-800 to-orange-700 p-3 flex flex-col justify-between text-white shadow-inner">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded w-fit">
                      LIVE 24x7
                    </span>
                    <p className="text-xs font-bold leading-tight">
                      {language === 'en' ? 'Direct Farm & Rural News' : 'थेट शेती व ग्रामीण घडामोडी'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-14 rounded-xl bg-slate-900 border border-slate-800" />
                    <div className="h-14 rounded-xl bg-slate-900 border border-slate-800" />
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-orange-600/20 border border-orange-500/40 text-center">
                  <p className="text-[10px] text-orange-400 font-bold">
                    {language === 'en' ? 'GBTV Regional OTT & News' : 'GBTV प्रादेशिक OTT व न्यूज'}
                  </p>
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
