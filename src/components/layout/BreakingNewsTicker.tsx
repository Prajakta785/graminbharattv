'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Bell, ChevronRight, Zap } from 'lucide-react';
import { dbService } from '@/lib/db';
import { INITIAL_NEWS } from '@/data/seedData';
import { NewsArticle } from '@/types';

export const BreakingNewsTicker: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>(() => {
    const breaking = INITIAL_NEWS.filter(n => n.isBreaking || n.isFeatured);
    return breaking.length > 0 ? breaking : INITIAL_NEWS.slice(0, 5);
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBreaking = async () => {
      const all = await dbService.getNews();
      const breaking = all.filter(n => n.isBreaking || n.isFeatured);
      setNews(breaking.length > 0 ? breaking : all.slice(0, 5));
    };

    fetchBreaking();

    const handler = () => fetchBreaking();
    window.addEventListener('gbtv_data_updated', handler);
    return () => window.removeEventListener('gbtv_data_updated', handler);
  }, []);

  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  const current = news[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-amber-700 border-b border-amber-400/40 text-white select-none shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3 text-xs">
        {/* TV Style Breaking Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded bg-yellow-400 text-black font-black uppercase tracking-wider flex items-center gap-1 shadow-md shadow-yellow-500/20 text-[11px] animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-current text-red-600" />
            ब्रेकिंग न्यूज
          </span>
        </div>

        {/* Live Scrolling Headline */}
        <div className="flex-1 overflow-hidden relative h-5">
          <Link
            href={`/news/${current.id}`}
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors truncate font-bold text-xs sm:text-sm drop-shadow"
          >
            {current.district && (
              <span className="text-yellow-300 font-extrabold shrink-0">
                【{current.district}】
              </span>
            )}
            <span className="truncate">{current.titleMr}</span>
          </Link>
        </div>

        {/* Controls / View All */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 text-white/90 text-[11px]">
          <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-white font-bold">
            {currentIndex + 1}/{news.length}
          </span>
          <Link
            href="/news"
            className="text-yellow-300 hover:text-white font-extrabold flex items-center gap-0.5 underline decoration-yellow-400"
          >
            सर्व बातम्या <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
