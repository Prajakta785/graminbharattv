'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, WebSeries } from '@/types';
import { ContentCard } from './ContentCard';
import { useLanguage } from '@/context/LanguageContext';

interface ContentRowProps {
  title: string;
  titleMr: string;
  items: (Movie | WebSeries)[];
  type: 'movie' | 'series';
  viewAllHref?: string;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  titleMr,
  items,
  type,
  viewAllHref,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -450 : 450;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (!items || items.length === 0) return null;

  const displayTitle = language === 'en' ? title : titleMr;
  const secondaryTitle = language === 'en' ? titleMr : title;

  return (
    <div className="w-full py-6 select-none">
      <div className="flex items-end justify-between px-4 sm:px-8 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-600 rounded-full inline-block" />
            {displayTitle}
          </h2>
          <span className="text-xs text-slate-400 font-medium pl-3.5 block mt-0.5">{secondaryTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors mr-2 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-800/40"
            >
              {t('exploreMore')} →
            </Link>
          )}
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors border border-slate-700"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 sm:px-8 pb-4 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map(item => (
          <div key={item.id} className="w-[180px] sm:w-[220px] md:w-[240px] shrink-0">
            <ContentCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};
