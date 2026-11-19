'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  Radio,
  Flame,
} from 'lucide-react';
import { dbService } from '@/lib/db';
import {
  INITIAL_BANNERS,
  INITIAL_MOVIES,
  INITIAL_WEB_SERIES,
  INITIAL_NEWS,
  INITIAL_PODCASTS,
  INITIAL_LIVE_CHANNELS,
} from '@/data/seedData';
import { Movie, WebSeries, NewsArticle, PodcastEpisode, LiveChannel, Banner } from '@/types';
import { ContentRow } from '@/components/ui/ContentRow';
import { NewsCard } from '@/components/ui/NewsCard';
import { AppDownloadBanner } from '@/components/layout/AppDownloadBanner';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [series, setSeries] = useState<WebSeries[]>(INITIAL_WEB_SERIES);
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(INITIAL_PODCASTS);
  const [liveChannels, setLiveChannels] = useState<LiveChannel[]>(INITIAL_LIVE_CHANNELS);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  const loadData = async () => {
    try {
      const [contentRes, bannersRes] = await Promise.all([
        fetch('/api/content').then(r => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/banners').then(r => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      if (contentRes?.success && contentRes.movies?.length > 0) {
        setMovies(contentRes.movies);
        setSeries(contentRes.series || []);
        if (contentRes.liveChannels) setLiveChannels(contentRes.liveChannels);
      } else {
        const [m, s, c] = await Promise.all([
          dbService.getMovies(),
          dbService.getWebSeries(),
          dbService.getLiveChannels(),
        ]);
        setMovies(m);
        setSeries(s);
        setLiveChannels(c);
      }

      if (bannersRes?.success && bannersRes.banners?.length > 0) {
        setBanners(bannersRes.banners.filter((item: Banner) => item.isActive));
      } else {
        const b = await dbService.getBanners();
        setBanners(b.filter(item => item.isActive));
      }
    } catch {
      const [b, m, s, c] = await Promise.all([
        dbService.getBanners(),
        dbService.getMovies(),
        dbService.getWebSeries(),
        dbService.getLiveChannels(),
      ]);
      setBanners(b.filter(item => item.isActive));
      setMovies(m);
      setSeries(s);
      setLiveChannels(c);
    }

    const [n, p] = await Promise.all([
      dbService.getNews(),
      dbService.getPodcasts(),
    ]);
    setNews(n);
    setPodcasts(p);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('gbtv_data_updated', handleUpdate);
    return () => window.removeEventListener('gbtv_data_updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const activeBanner = banners[currentBannerIdx] || banners[0];

  const govtSchemesNews = news.filter(
    n => n.categoryMr === 'शासकीय योजना' || n.category === 'शासकीय योजना'
  );

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* 1. HERO SECTION WITH VIBRANT OTT CINEMATIC BANNER */}
      {banners.length > 0 && activeBanner && (
        <div className="cinematic-hero relative w-full h-[58vh] sm:h-[72vh] lg:h-[84vh] overflow-hidden select-none bg-black">
          {/* Smooth One-by-One Cross-Fading Background Posters */}
          {banners.map((b, idx) => (
            <div
              key={b.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentBannerIdx === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                src={b.imageUrl}
                alt={language === 'en' && b.title ? b.title : b.titleMr}
                className="w-full h-full object-cover object-center brightness-105 contrast-105"
              />
            </div>
          ))}

          {/* Minimal Subtle Gradients - Keeps Image Bright and 100% Properly Visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none z-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent pointer-events-none z-1" />

          {/* Previous / Next Arrow Controls */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrentBannerIdx(prev => (prev - 1 + banners.length) % banners.length)}
                className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white items-center justify-center backdrop-blur-md border border-white/20 hover:border-orange-500 transition-all shadow-xl hover:scale-110 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentBannerIdx(prev => (prev + 1) % banners.length)}
                className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white items-center justify-center backdrop-blur-md border border-white/20 hover:border-orange-500 transition-all shadow-xl hover:scale-110 cursor-pointer"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Hero Content */}
          <div className="absolute bottom-6 sm:bottom-12 lg:bottom-16 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xl shadow-orange-600/30 border border-amber-400/40">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-white" />
                  {language === 'en'
                    ? activeBanner.badgeText || t('specialPremiere')
                    : activeBanner.badgeTextMr || t('specialPremiere')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-black/70 text-amber-300 border border-amber-500/30">
                  4K Ultra HD • HLS
                </span>
              </div>

              <h1
                style={{ color: '#FFFFFF', textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.9)' }}
                className="hero-title text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-tight"
              >
                {language === 'en' && activeBanner.title ? activeBanner.title : activeBanner.titleMr}
              </h1>

              {(activeBanner.subtitleMr || activeBanner.subtitle) && (
                <p
                  style={{ color: '#F8FAFC', textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
                  className="hero-subtitle mt-2 sm:mt-3 text-xs sm:text-base line-clamp-2 leading-relaxed font-medium"
                >
                  {language === 'en' && activeBanner.subtitle ? activeBanner.subtitle : activeBanner.subtitleMr}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-3 sm:mt-6">
                <Link
                  href={activeBanner.linkUrl || '/movies'}
                  className="px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-xs sm:text-base shadow-2xl shadow-orange-600/40 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white" />
                  <span style={{ color: '#FFFFFF' }} className="font-extrabold text-white">
                    {t('watchNow')}
                  </span>
                </Link>

                <Link
                  href="/subscribe"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#FFFFFF',
                    borderColor: 'rgba(234, 88, 12, 0.7)',
                    backdropFilter: 'blur(8px)',
                  }}
                  className="hero-subscribe-btn px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-base border hover:border-orange-500 hover:bg-slate-900 transition-all flex items-center gap-1.5 sm:gap-2 shadow-2xl"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                  <span style={{ color: '#FFFFFF' }} className="font-bold">
                    {t('getPremiumPrice')}
                  </span>
                </Link>
              </div>
            </div>

            {/* Banner Dots indicator */}
            {banners.length > 1 && (
              <div className="flex items-center gap-2 mt-8">
                {banners.map((b, idx) => (
                  <button
                    key={b.id}
                    onClick={() => setCurrentBannerIdx(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentBannerIdx === idx
                        ? 'w-8 bg-gradient-to-r from-orange-500 to-amber-400 shadow-md'
                        : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CONTINUE WATCHING */}
      {user?.watchHistory && user.watchHistory.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block" />
              {t('continueWatching')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.watchHistory.slice(0, 3).map(item => {
              const progressPct = Math.min(
                100,
                Math.round((item.progressSeconds / (item.durationSeconds || 1)) * 100)
              );
              return (
                <Link
                  key={item.contentId}
                  href={`/movies/${item.contentId}`}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-orange-500/50 p-3 flex gap-3 items-center transition-all shadow-md"
                >
                  <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20">
                      <Play className="w-5 h-5 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-orange-400">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {progressPct}% {language === 'en' ? 'watched' : 'पाहिले'} • {Math.round(item.progressSeconds / 60)} {t('minutesSuffix')} {language === 'en' ? 'left' : 'बाकी'}
                    </p>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. REAL MOVIES ROW */}
      <ContentRow
        title={t('featuredMoviesTitle')}
        titleMr="अस्सल मराठी चित्रपट"
        items={movies}
        type="movie"
        viewAllHref="/movies"
      />

      {/* 4. LATEST MAHARASHTRA NEWS PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {t('newsPortalTag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('newsPortalHeading')}
            </h2>
          </div>
          <Link
            href="/news"
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 px-4 py-2 rounded-xl bg-orange-950/40 border border-orange-800/40 flex items-center gap-1.5 w-fit"
          >
            {t('viewAllNews')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {news[0] && <NewsCard article={news[0]} featured={true} />}
        </div>
      </section>

      {/* 5. FEATURED GOVERNMENT SCHEMES */}
      {govtSchemesNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {t('schemesTag')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {t('schemesTitle')}
              </h2>
            </div>
            <Link
              href="/news?category=शासकीय योजना"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300"
            >
              {t('allSchemes')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {govtSchemesNews.slice(0, 2).map(item => (
              <div
                key={item.id}
                className="scheme-card rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-700/50 p-6 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                    {t('schemeBadge')}
                  </span>
                  <Link href={`/news/${item.id}`}>
                    <h3
                      style={{ color: '#FFFFFF' }}
                      className="text-lg font-bold hover:text-emerald-400 transition-colors mt-3"
                    >
                      {language === 'en' && item.title ? item.title : item.titleMr}
                    </h3>
                  </Link>
                  <p
                    style={{ color: '#E2E8F0' }}
                    className="text-xs mt-2 line-clamp-2 leading-relaxed"
                  >
                    {language === 'en' && item.summary ? item.summary : item.summaryMr}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span
                    style={{ color: '#94A3B8' }}
                    className="scheme-author font-medium"
                  >
                    {language === 'en' && item.reporter.name ? item.reporter.name : item.reporter.nameMr}
                  </span>
                  <Link
                    href={`/news/${item.id}`}
                    style={{ color: '#34D399' }}
                    className="scheme-cta font-bold hover:underline"
                  >
                    {t('schemeEligibility')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. POPULAR PODCASTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              {t('podcastsTag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('podcastsTitle')}
            </h2>
          </div>
          <Link
            href="/podcasts"
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 px-4 py-2 rounded-xl bg-orange-950/40 border border-orange-800/40 flex items-center gap-1.5 w-fit"
          >
            {t('listenAllPodcasts')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podcasts.map(pod => (
            <Link
              key={pod.id}
              href="/podcasts"
              className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 p-4 flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl"
            >
              <div>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-3 shadow">
                  <img
                    src={pod.thumbnailUrl}
                    alt={language === 'en' && pod.title ? pod.title : pod.titleMr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-slate-200">
                    {Math.round(pod.durationSeconds / 60)} {t('minutesSuffix')}
                  </span>
                </div>

                <span className="text-[11px] font-semibold text-orange-400">
                  {language === 'en' && pod.category ? pod.category : pod.categoryMr}
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 mt-1 leading-snug">
                  {language === 'en' && pod.title ? pod.title : pod.titleMr}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{language === 'en' && pod.host.name ? pod.host.name : pod.host.nameMr}</span>
                <span>
                  {pod.listensCount.toLocaleString()} {t('listensCountSuffix')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. CITIZEN GRIEVANCE PORTAL TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-red-950/70 via-slate-900 to-orange-950/60 border-2 border-red-700/40 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white uppercase tracking-wider shadow">
              {t('grievanceBannerTag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 leading-snug">
              {t('grievanceBannerTitle')}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {t('grievanceBannerDesc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/grievance"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105"
            >
              {t('submitGrievance')}
            </Link>
            <Link
              href="/grievance/track"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-all shadow"
            >
              {t('trackGrievance')}
            </Link>
          </div>
        </div>
      </section>

      {/* 8. SUBSCRIPTION PROMOTION (Single Active Plan Only) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-orange-950/80 via-slate-900 to-slate-950 border-2 border-orange-500/60 p-8 sm:p-12 text-center flex flex-col items-center shadow-2xl">
          <span className="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-600 text-white shadow-lg mb-3">
            {t('annualPlanTag')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t('pricingTitle')}
          </h2>
          <p className="max-w-xl text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            {t('pricingSubtitle')}
          </p>

          {/* 5 Official Benefits Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-3xl w-full my-8 text-left">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t('benefit1')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t('benefit2')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t('benefit3')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t('benefit4')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-200 sm:col-span-2 lg:col-span-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t('benefit5')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/subscribe"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 hover:from-orange-500 hover:to-amber-500 text-white font-black text-base shadow-2xl shadow-orange-600/50 transition-all hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>{t('subscribeNowBtn')}</span>
            </Link>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">
            {t('securePaymentNote')}
          </p>
        </div>
      </section>

      {/* 9. ANDROID APP DOWNLOAD BANNER */}
      <AppDownloadBanner />
    </div>
  );
}
