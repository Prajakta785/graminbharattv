'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  User,
  Flame,
  Bookmark,
  Send
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { NewsArticle } from '@/types';
import { NewsCard } from '@/components/ui/NewsCard';
import { useToast } from '@/context/ToastContext';

function NewsDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const newsId = resolvedParams.id;
  const { toast } = useToast();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const item = await dbService.getNewsById(newsId);
      const all = await dbService.getNews();
      setArticle(item);
      setRelatedNews(all.filter(n => n.id !== newsId).slice(0, 3));
      setLoading(false);
    };
    load();
  }, [newsId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">बातमी सापडली नाही</h2>
        <Link href="/news" className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-xs font-bold">
          बातम्यांकडे परत जा
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('बातमी लिंक कॉपी केली (Link copied)');
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('mr-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> सर्व ताज्या बातम्यांकडे परत
      </Link>

      {/* Category & Location Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow">
          {article.categoryMr}
        </span>
        {article.isBreaking && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse flex items-center gap-1 shadow">
            <Flame className="w-3.5 h-3.5 fill-current" />
            ब्रेकिंग न्यूज
          </span>
        )}
        {article.district && (
          <span className="flex items-center gap-1 text-xs text-orange-400 font-semibold bg-orange-950/40 px-2.5 py-1 rounded-md border border-orange-800/40">
            <MapPin className="w-3.5 h-3.5" />
            {article.district} {article.taluka ? `(${article.taluka})` : ''}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
        {article.titleMr}
      </h1>

      {/* Author / Date Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 my-6 border-y border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold overflow-hidden shrink-0">
            {article.reporter.photoUrl ? (
              <img src={article.reporter.photoUrl} alt={article.reporter.nameMr} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{article.reporter.nameMr}</p>
            <p className="text-xs text-orange-400">{article.reporter.bureau}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-slate-500" />
            {formatDate(article.publishedAt)}
          </span>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-semibold">शेअर</span>
          </button>
        </div>
      </div>

      {/* Main News Image */}
      <div className="rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 mb-8 shadow-2xl">
        <img
          src={article.imageUrl}
          alt={article.titleMr}
          className="w-full aspect-[16/9] object-cover"
        />
        {article.district && (
          <p className="p-3 text-[11px] text-slate-400 bg-slate-900/90 border-t border-slate-800 italic">
            छायाचित्र: {article.district} जिल्ह्यातील वार्तांकन • ग्रामीण भारत टीव्ही विशेष वृत्त
          </p>
        )}
      </div>

      {/* Summary Callout */}
      <div className="p-6 rounded-2xl bg-orange-950/20 border-l-4 border-orange-500 text-slate-200 text-base font-semibold leading-relaxed mb-8">
        {article.summaryMr}
      </div>

      {/* Full Rich Content */}
      <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-base sm:text-lg space-y-6">
        {article.contentMr.split('\n\n').map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-8 mt-8 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">टॅग्ज:</span>
          {article.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg text-xs bg-slate-900 text-slate-300 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related News */}
      {relatedNews.length > 0 && (
        <div className="pt-12 mt-12 border-t border-slate-800">
          <h3 className="text-xl font-bold text-white mb-6">इतर महत्त्वाच्या घडामोडी</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedNews.map(item => (
              <NewsCard key={item.id} article={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-8 select-none">
      <Suspense fallback={
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <NewsDetailContent params={params} />
      </Suspense>
    </div>
  );
}
