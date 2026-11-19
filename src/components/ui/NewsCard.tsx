'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, User, Clock, Share2, Flame } from 'lucide-react';
import { NewsArticle } from '@/types';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/news/${article.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        toast(
          language === 'en'
            ? 'News link copied to clipboard'
            : 'बातमी लिंक कॉपी झाली',
          'success'
        );
      }
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const locale = language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'mr-IN';
      return d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const displayTitle =
    language === 'en' && article.title ? article.title : article.titleMr;
  const displaySummary =
    language === 'en' && article.summary ? article.summary : article.summaryMr;
  const displayCategory =
    language === 'en' && article.category ? article.category : article.categoryMr;

  if (featured) {
    return (
      <div className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl flex flex-col lg:flex-row">
        <Link href={`/news/${article.id}`} className="lg:w-1/2 relative aspect-video lg:aspect-auto overflow-hidden bg-slate-950">
          <img
            src={article.imageUrl}
            alt={displayTitle}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow-lg flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {displayCategory}
            </span>
            {article.isBreaking && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse shadow-lg">
                {t('breakingNews')}
              </span>
            )}
          </div>
        </Link>

        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
              {article.district && (
                <span className="flex items-center gap-1 text-orange-400 font-semibold bg-orange-950/40 px-2.5 py-1 rounded-md border border-orange-800/40">
                  <MapPin className="w-3 h-3" />
                  {article.district} {article.taluka ? `(${article.taluka})` : ''}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(article.publishedAt)}
              </span>
            </div>

            <Link href={`/news/${article.id}`}>
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                {displayTitle}
              </h3>
            </Link>

            <p className="text-slate-300 text-sm mt-3 line-clamp-3 leading-relaxed">
              {displaySummary}
            </p>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold overflow-hidden">
                {article.reporter.photoUrl ? (
                  <img src={article.reporter.photoUrl} alt={article.reporter.nameMr} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {language === 'en' && article.reporter.name ? article.reporter.name : article.reporter.nameMr}
                </p>
                <p className="text-[10px] text-slate-400">{article.reporter.bureau}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Share news"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
      <Link href={`/news/${article.id}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={article.imageUrl}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-600/90 text-white backdrop-blur-md">
            {displayCategory}
          </span>
          {article.isBreaking && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
              {t('breakingNews')}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
            {article.district && (
              <span className="text-orange-400 font-semibold">{article.district}</span>
            )}
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <Link href={`/news/${article.id}`}>
            <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
              {displayTitle}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-[11px]">
          <span className="text-slate-400 truncate max-w-[140px]">
            {language === 'en' && article.reporter.name ? article.reporter.name : article.reporter.nameMr}
          </span>
          <Link href={`/news/${article.id}`} className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-0.5">
            {t('readMore')} →
          </Link>
        </div>
      </div>
    </div>
  );
};
