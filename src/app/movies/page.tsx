'use client';

import React, { useEffect, useState } from 'react';
import { Film, Filter, Search, Sparkles } from 'lucide-react';
import { dbService } from '@/lib/db';
import { Movie } from '@/types';
import { ContentCard } from '@/components/ui/ContentCard';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<'all' | 'free' | 'premium'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const data = await res.json();
          if (data?.movies?.length > 0) {
            setMovies(data.movies);
            setFilteredMovies(data.movies);
            return;
          }
        }
      } catch {}
      const data = await dbService.getMovies();
      setMovies(data);
      setFilteredMovies(data);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    let result = [...movies];

    if (selectedAccess === 'free') {
      result = result.filter(m => !m.isPremium);
    } else if (selectedAccess === 'premium') {
      result = result.filter(m => m.isPremium);
    }

    if (selectedGenre !== 'all') {
      result = result.filter(m => m.genres.includes(selectedGenre));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.titleMr.toLowerCase().includes(q) ||
          m.descriptionMr.toLowerCase().includes(q)
      );
    }

    setFilteredMovies(result);
  }, [movies, selectedAccess, selectedGenre, searchQuery]);

  const allGenres = Array.from(new Set(movies.flatMap(m => m.genres)));

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              मराठी सिनेमा (Marathi Cinema & OTT)
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              अस्सल मराठी चित्रपट व माहितीपट
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              ग्रामीण महाराष्ट्र, शेती आणि सामाजिक संघर्षावर आधारित दर्जेदार चित्रपट
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="चित्रपट नाव शोधा..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Access Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAccess('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedAccess === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              सर्व ({movies.length})
            </button>
            <button
              onClick={() => setSelectedAccess('free')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedAccess === 'free'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              मोफत चित्रपट (Free)
            </button>
            <button
              onClick={() => setSelectedAccess('premium')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                selectedAccess === 'premium'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              प्रीमियम (Premium)
            </button>
          </div>

          {/* Genre filter */}
          {allGenres.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> प्रकार:
              </span>
              <button
                onClick={() => setSelectedGenre('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
                  selectedGenre === 'all'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                सर्व
              </button>
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${
                    selectedGenre === genre
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">चित्रपट सापडले नाहीत</h3>
            <p className="text-xs text-slate-400 mt-1">कृपया शोध संज्ञा किंवा फिल्टर्स बदला.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredMovies.map(movie => (
              <ContentCard key={movie.id} item={movie} type="movie" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
