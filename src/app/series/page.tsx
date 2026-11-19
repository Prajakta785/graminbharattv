'use client';

import React, { useEffect, useState } from 'react';
import { Tv, Search } from 'lucide-react';
import { dbService } from '@/lib/db';
import { WebSeries } from '@/types';
import { ContentCard } from '@/components/ui/ContentCard';

export default function SeriesCatalogPage() {
  const [series, setSeries] = useState<WebSeries[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const data = await dbService.getWebSeries();
      setSeries(data);
    };
    fetch();
  }, []);

  const filtered = series.filter(
    s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.titleMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.descriptionMr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              मराठी वेब सिरीज (Original Web Series)
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              ग्रामीण भारत ओरिजिनल वेब सिरीज
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              सत्तेचा खेळ, ग्रामीण सत्ताकारण आणि संवेदनशील कौटुंबिक मालिका
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="सिरीज शोधा..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">वेब सिरीज सापडली नाही</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filtered.map(s => (
              <ContentCard key={s.id} item={s} type="series" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
