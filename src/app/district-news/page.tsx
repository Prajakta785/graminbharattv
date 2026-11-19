'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Search, Filter, Newspaper, ChevronRight } from 'lucide-react';
import { MAHARASHTRA_DISTRICTS } from '@/lib/districts';
import { dbService } from '@/lib/db';
import { NewsArticle, District } from '@/types';
import { NewsCard } from '@/components/ui/NewsCard';

export default function DistrictNewsPage() {
  const [districts] = useState<District[]>(MAHARASHTRA_DISTRICTS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [villageSearch, setVillageSearch] = useState<string>('');
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await dbService.getNews();
      setAllNews(data);
    };
    fetch();
  }, []);

  // When district changes, reset taluka
  const handleDistrictChange = (dName: string) => {
    setSelectedDistrict(dName);
    setSelectedTaluka('all');
  };

  const activeDistrictObj = districts.find(
    d => d.nameMr === selectedDistrict || d.nameEn === selectedDistrict
  );

  const filtered = allNews.filter(article => {
    const matchesDistrict =
      selectedDistrict === 'all' ||
      article.district === selectedDistrict ||
      (activeDistrictObj && (article.district === activeDistrictObj.nameMr || article.district === activeDistrictObj.nameEn));

    const matchesTaluka =
      selectedTaluka === 'all' ||
      article.taluka === selectedTaluka;

    const matchesCategory =
      selectedCategory === 'all' ||
      article.categoryMr === selectedCategory ||
      article.category === selectedCategory;

    const matchesVillage =
      !villageSearch.trim() ||
      (article.village && article.village.toLowerCase().includes(villageSearch.toLowerCase())) ||
      article.titleMr.toLowerCase().includes(villageSearch.toLowerCase());

    return matchesDistrict && matchesTaluka && matchesCategory && matchesVillage;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            स्थानिक वार्तांकन (District & Taluka Bureau)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            महाराष्ट्रातील ३६ जिल्हे व तालुके बातम्या
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            आपल्या गावातील, तालुक्यातील आणि जिल्ह्यातील अधिकृत घडामोडी थेट आपल्या स्थानिक प्रतिनिधींकडून
          </p>
        </div>

        {/* Filter Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. District Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                १. जिल्हा निवडा ({districts.length} जिल्हे)
              </label>
              <select
                value={selectedDistrict}
                onChange={e => handleDistrictChange(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="all">सर्व ३६ जिल्हे (All)</option>
                {districts.map(d => (
                  <option key={d.id} value={d.nameMr}>
                    {d.nameMr} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Taluka Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                २. तालुका निवडा
              </label>
              <select
                value={selectedTaluka}
                onChange={e => setSelectedTaluka(e.target.value)}
                disabled={selectedDistrict === 'all' || !activeDistrictObj}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500 disabled:opacity-40"
              >
                <option value="all">सर्व तालुके</option>
                {activeDistrictObj?.talukas.map(t => (
                  <option key={t.id} value={t.nameMr}>
                    {t.nameMr} ({t.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                ३. विषय / वर्गवारी
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="all">सर्व विषय (All)</option>
                <option value="शेती व बाजारभाव">शेती व बाजारभाव</option>
                <option value="ग्रामीण विकास">ग्रामीण विकास</option>
                <option value="राजकारण व समाजकारण">राजकारण व समाजकारण</option>
                <option value="शासकीय योजना">शासकीय योजना</option>
                <option value="गुन्हे व सुरक्षा">गुन्हे व सुरक्षा</option>
                <option value="शिक्षण">शिक्षण</option>
                <option value="रोजगार">रोजगार</option>
              </select>
            </div>

            {/* 4. Village or Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                ४. गाव / ग्रामपंचायत नाव शोधा
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="उदा. बारामती, शिरूर, वडगाव..."
                  value={villageSearch}
                  onChange={e => setVillageSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500 placeholder-slate-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Quick Active Filter Pill info */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span>
              एकूण सापडलेल्या बातम्या: <strong className="text-orange-400">{filtered.length}</strong>
            </span>
            {(selectedDistrict !== 'all' || selectedCategory !== 'all' || villageSearch) && (
              <button
                onClick={() => {
                  setSelectedDistrict('all');
                  setSelectedTaluka('all');
                  setSelectedCategory('all');
                  setVillageSearch('');
                }}
                className="text-orange-400 hover:underline font-semibold"
              >
                सर्व फिल्टर्स क्लिअर करा
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Newspaper className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">या भागातील बातम्या सापडल्या नाहीत</h3>
            <p className="text-xs text-slate-400 mt-1">कृपया फिल्टर बदला किंवा गाव नाव तपासा.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
