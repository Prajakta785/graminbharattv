'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Plus, Check, Sparkles } from 'lucide-react';
import { Movie, WebSeries } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';

interface ContentCardProps {
  item: Movie | WebSeries;
  type: 'movie' | 'series';
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, type }) => {
  const { isInWatchlist, toggleWatchlist } = useAuth();
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const isSaved = isInWatchlist(item.id);
  const href = type === 'movie' ? `/movies/${item.id}` : `/series/${item.id}`;

  const isMovie = (x: Movie | WebSeries): x is Movie => 'duration' in x;

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(item.id);
    toast(
      isSaved
        ? language === 'en'
          ? 'Removed from Watchlist'
          : 'माझ्या यादीतून काढले'
        : language === 'en'
        ? 'Added to Watchlist'
        : 'माझ्या यादीत जोडले',
      'info'
    );
  };

  const displayTitle =
    language === 'en' && item.title ? item.title : item.titleMr || item.title;

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-950/20 hover:-translate-y-1 select-none">
      <Link href={href} className="relative block aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={item.posterUrl}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badges top */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {item.isPremium ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" />
              {t('premium')}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
              {t('free')}
            </span>
          )}

          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-slate-200 backdrop-blur-md border border-white/10">
            {item.contentRating}
          </span>
        </div>

        {/* Floating Play Action on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xl shadow-orange-600/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Watchlist toggle bottom right */}
        <button
          onClick={handleWatchlist}
          title={isSaved ? (language === 'en' ? 'Remove' : 'यादीतून काढा') : (language === 'en' ? 'Add' : 'यादीत जोडा')}
          className={`absolute bottom-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all z-10 ${
            isSaved
              ? 'bg-orange-600 text-white border-orange-500 shadow-md'
              : 'bg-black/60 text-slate-300 hover:text-white border-white/10 hover:bg-black/80'
          }`}
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </Link>

      {/* Meta Footer */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-slate-900/90">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-orange-400 font-medium mb-1">
            <span>{item.genres?.slice(0, 2).join(' • ')}</span>
          </div>
          <Link href={href}>
            <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
              {displayTitle}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <span>{item.language}</span>
          <span>
            {isMovie(item)
              ? `${item.duration} ${t('minutesSuffix') || 'मि.'}`
              : `${(item as WebSeries).seasons?.length || 1} ${language === 'en' ? 'Seasons' : 'सीझन'}`}
          </span>
        </div>
      </div>
    </div>
  );
};
