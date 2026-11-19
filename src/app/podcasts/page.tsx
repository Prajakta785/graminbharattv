'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Search, Filter, Play, Volume2, User, Clock, Sparkles } from 'lucide-react';
import { dbService } from '@/lib/db';
import { PodcastEpisode } from '@/types';
import { AudioPlayer } from '@/components/video/AudioPlayer';

const PODCAST_CATEGORIES = [
  'सर्व',
  'प्रगतीशील शेती',
  'सेंद्रिय शेती',
  'ग्रामीण उद्योजकता',
  'महिला सक्षमीकरण',
  'बचत गट क्रांती',
  'ग्रामीण यशोगाथा',
];

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('सर्व');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const data = await dbService.getPodcasts();
      setPodcasts(data);
      if (data.length > 0) {
        setActiveEpisode(data[0]);
      }
    };
    fetch();
  }, []);

  const filtered = podcasts.filter(p => {
    const matchesCat =
      selectedCategory === 'सर्व' ||
      p.categoryMr === selectedCategory ||
      p.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      p.titleMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.host.nameMr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              आवाज मातीचा (Podcasts & Audio Stories)
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
              ग्रामीण भारत ऑडिओ व्यासपीठ
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              प्रगतीशील शेती, सेंद्रिय तंत्रज्ञान, महिला बचत गट आणि यशस्वी शेतकऱ्यांच्या मुलाखती
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="पॉडकास्ट शोधा..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Featured Live Sticky Audio Player */}
        {activeEpisode && (
          <div className="mb-10">
            <AudioPlayer episode={activeEpisode} />
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {PODCAST_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Podcast Episode Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ep => {
            const isPlayingThis = activeEpisode?.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => setActiveEpisode(ep)}
                className={`group p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isPlayingThis
                    ? 'bg-gradient-to-b from-orange-950/40 to-slate-900 border-orange-500/60 shadow-xl shadow-orange-950/30'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 hover:-translate-y-1'
                }`}
              >
                <div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-4">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.titleMr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl ${
                          isPlayingThis
                            ? 'bg-orange-600 ring-4 ring-orange-500/40'
                            : 'bg-black/60 group-hover:bg-orange-600'
                        }`}
                      >
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                      {Math.round(ep.durationSeconds / 60)} मिनिटे
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-orange-400">
                    {ep.categoryMr}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors mt-1 line-clamp-2 leading-snug">
                    {ep.titleMr}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                    {ep.descriptionMr}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{ep.host.nameMr}</span>
                  </div>
                  <span>{ep.listensCount.toLocaleString()} श्रोते</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
