'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Newspaper, Search, Filter, Flame } from 'lucide-react';
import { dbService } from '@/lib/db';
import { NewsArticle } from '@/types';
import { NewsCard } from '@/components/ui/NewsCard';

const CATEGORIES = [
  'सर्व',
  'शेती व बाजारभाव',
  'ग्रामीण विकास',
  'राजकारण व समाजकारण',
  'गुन्हे व सुरक्षा',
  'शासकीय योजना',
  'शिक्षण',
  'आरोग्य',
  'रोजगार',
  'महाराष्ट्र बातम्या',
  'देश-विदेश',
];

function NewsPortalContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'सर्व';

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      const data = await dbService.getNews();
      setNews(data);
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesCategory =
      selectedCategory === 'सर्व' ||
      item.categoryMr === selectedCategory ||
      item.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      item.titleMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summaryMr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.district && item.district.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const featured = filteredNews.find(n => n.isFeatured) || filteredNews[0];
  const list = filteredNews.filter(n => n.id !== featured?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* News Portal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5" />
            डिजिटल न्यूज पोर्टल (Digital News Network)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            महाराष्ट्राचा आवाज – डिजिटल वृत्तसेवा
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            शेती, बाजारभाव, शासकीय योजना आणि ३६ जिल्ह्यांतील जनतेच्या ज्वलंत समस्यांचे निर्भीड वार्तांकन
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="बातमी किंवा जिल्हा शोधा..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Content Layout */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
          <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">बातम्या उपलब्ध नाहीत</h3>
          <p className="text-xs text-slate-400 mt-1">कृपया दुसरी वर्गवारी निवडा.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Hero Article */}
          {featured && <NewsCard article={featured} featured={true} />}

          {/* News Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsPortalPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-8 select-none">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <NewsPortalContent />
      </Suspense>
    </div>
  );
}
