'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Tv,
  Sparkles,
  Shield,
  AlertCircle,
  Download
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Language } from '@/types';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { isAdmin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/movies', label: t('movies') },
    { href: '/news', label: t('news') },
    { href: '/podcasts', label: t('podcasts') },
    { href: '/grievance', label: t('publicGrievance') },
    { href: '/subscribe', label: t('subscriptions') },
    { href: '/app-download', label: t('appDownload') },
    { href: '/about', label: t('aboutUs') },
    { href: '/contact', label: t('contactUs') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 select-none shadow-2xl">
      {/* 1. TOP BROADCAST INFO BAR (Continuous Scrolling News Marquee + Direct 3-Language Switcher) */}
      <div className="bg-gradient-to-r from-green-950 via-slate-950 to-orange-950 border-b border-orange-500/30 text-white text-[11px] py-1.5 px-3 sm:px-6 flex items-center justify-between gap-3 overflow-hidden select-none">
        {/* Live Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-extrabold text-[10px] shrink-0 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          <span>{t('liveEdition')}</span>
        </div>

        {/* Continuously Scrolling Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative cursor-default">
          <div className="animate-marquee-scroll flex items-center gap-8 whitespace-nowrap text-xs">
            <span className="text-slate-200 font-medium">
              {t('tickerLine1')}
            </span>
            <span className="text-amber-400 font-bold">
              {t('tickerLine2')}
            </span>
            <span className="text-emerald-400 font-semibold">
              {t('tickerLine3')}
            </span>
            <span className="text-orange-400 font-medium">
              {t('tickerLine4')}
            </span>
            <span className="text-slate-300 font-medium">
              {t('tickerLine5')}
            </span>

            {/* Seamless Duplicate for Infinite Marquee */}
            <span className="text-slate-200 font-medium">
              {t('tickerLine1')}
            </span>
            <span className="text-amber-400 font-bold">
              {t('tickerLine2')}
            </span>
            <span className="text-emerald-400 font-semibold">
              {t('tickerLine3')}
            </span>
            <span className="text-orange-400 font-medium">
              {t('tickerLine4')}
            </span>
            <span className="text-slate-300 font-medium">
              {t('tickerLine5')}
            </span>
          </div>
        </div>

        {/* 3-Language Direct Switcher in Top Bar */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-orange-500/50 rounded-full p-0.5 shrink-0 z-20 shadow-md">
          <button
            type="button"
            onClick={() => setLanguage('mr')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
              language === 'mr'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="मराठी"
          >
            <span>🚩</span>
            <span>मराठी</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
              language === 'hi'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="हिन्दी"
          >
            <span>🇮🇳</span>
            <span>हिन्दी</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
              language === 'en'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="English"
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Emblem */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group py-0.5">
            <img
              src="/logo.png"
              alt="ग्रामीण भारत TV"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-[11px] text-orange-600 font-extrabold tracking-wide leading-none">
                {language === 'en'
                  ? 'Voice of Maharashtra'
                  : language === 'hi'
                  ? 'मिट्टी से जुड़ाव, महाराष्ट्र की आवाज'
                  : 'मातीची नाळ, महाराष्ट्राचा आवाज'}
              </span>
              <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase mt-1 leading-none">
                {language === 'en' ? 'Rural OTT & News Network' : 'अस्सल मराठी OTT • २४ तास न्यूज'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 px-2 py-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            {navLinks.slice(0, 9).map(link => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                    active
                      ? 'text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-md shadow-orange-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex relative items-center">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-48 xl:w-56 pl-8 pr-3 py-1.5 rounded-full text-xs bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:w-64 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </form>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Mobile 3-Language Selector Buttons */}
          <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-bold text-slate-400">भाषा / Language:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  language === 'mr'
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                🚩 मराठी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                🇮🇳 हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-3">
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                    active
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800/80'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.aurora.ott.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-bold text-xs text-center shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Google Play वरून ॲप डाउनलोड करा</span>
            </a>

            <Link
              href="/subscribe"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs text-center shadow-lg shadow-orange-600/30 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{t('getPremiumPrice')}</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('adminPanel')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
