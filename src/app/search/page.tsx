'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Film, Tv, Newspaper, Radio, AlertCircle } from 'lucide-react';
import { dbService } from '@/lib/db';
import { Movie, WebSeries, NewsArticle, PodcastEpisode } from '@/types';
import { ContentCard } from '@/components/ui/ContentCard';
import { NewsCard } from '@/components/ui/NewsCard';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<WebSeries[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);

    const [allMovies, allSeries, allNews, allPodcasts] = await Promise.all([
      dbService.getMovies(),
      dbService.getWebSeries(),
      dbService.getNews(),
      dbService.getPodcasts(),
    ]);

    const q = term.toLowerCase();

    setMovies(
      allMovies.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.titleMr.toLowerCase().includes(q) ||
          m.descriptionMr.toLowerCase().includes(q)
      )
    );

    setSeries(
      allSeries.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.titleMr.toLowerCase().includes(q) ||
          s.descriptionMr.toLowerCase().includes(q)
      )
    );

    setNews(
      allNews.filter(
        n =>
          n.titleMr.toLowerCase().includes(q) ||
          n.summaryMr.toLowerCase().includes(q) ||
          (n.district && n.district.toLowerCase().includes(q))
      )
    );

    setPodcasts(
      allPodcasts.filter(
        p =>
          p.titleMr.toLowerCase().includes(q) ||
          p.descriptionMr.toLowerCase().includes(q) ||
          p.host.nameMr.toLowerCase().includes(q)
      )
    );

    setLoading(false);
  };

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const totalResults = movies.length + series.length + news.length + podcasts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="चित्रपट, वेब सिरीज, बातम्या, पॉडकास्ट किंवा जिल्हा शोधा..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500 shadow-2xl"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
        </div>
        {queryParam && (
          <p className="text-xs text-slate-400 mt-2 text-center">
            "{queryParam}" साठी एकूण <strong className="text-orange-400">{totalResults}</strong> निकाल सापडले.
          </p>
        )}
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : totalResults === 0 && queryParam ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">कोणतेही निकाल सापडले नाहीत</h3>
          <p className="text-xs text-slate-400 mt-1">कृपया दुसरा शब्द किंवा मराठी शब्द वापरून पहा.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Movies Results */}
          {movies.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-orange-500" />
                चित्रपट ({movies.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map(m => (
                  <ContentCard key={m.id} item={m} type="movie" />
                ))}
              </div>
            </div>
          )}

          {/* Web Series Results */}
          {series.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Tv className="w-5 h-5 text-orange-500" />
                वेब सिरीज ({series.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {series.map(s => (
                  <ContentCard key={s.id} item={s} type="series" />
                ))}
              </div>
            </div>
          )}

          {/* News Results */}
          {news.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-orange-500" />
                बातम्या ({news.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(n => (
                  <NewsCard key={n.id} article={n} />
                ))}
              </div>
            </div>
          )}

          {/* Podcasts Results */}
          {podcasts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-orange-500" />
                पॉडकास्ट भाग ({podcasts.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {podcasts.map(p => (
                  <Link
                    key={p.id}
                    href="/podcasts"
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500 flex items-center gap-4 transition-all"
                  >
                    <img src={p.thumbnailUrl} alt={p.titleMr} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <span className="text-[10px] text-orange-400 font-bold">{p.categoryMr}</span>
                      <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">{p.titleMr}</h4>
                      <p className="text-[10px] text-slate-400 mt-1">{p.host.nameMr}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-10 select-none">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SearchPageContent />
      </Suspense>
    </div>
  );
}
