'use client';

import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  Flame,
  X,
  MapPin,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { MAHARASHTRA_DISTRICTS } from '@/lib/districts';
import { NewsArticle } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminNewsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);

  // Form State
  const [titleMr, setTitleMr] = useState('');
  const [summaryMr, setSummaryMr] = useState('');
  const [contentMr, setContentMr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryMr, setCategoryMr] = useState('शेती व बाजारभाव');
  const [district, setDistrict] = useState('पुणे');
  const [taluka, setTaluka] = useState('बारामती');
  const [reporterName, setReporterName] = useState('प्रवीण जगताप');
  const [reporterBureau, setReporterBureau] = useState('पुणे ब्युरो चीफ');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);
  const [published, setPublished] = useState(true);

  const loadData = async () => {
    const list = await dbService.getNews();
    setNewsList(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setTitleMr('');
    setSummaryMr('');
    setContentMr('');
    setImageUrl('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80');
    setCategoryMr('शेती व बाजारभाव');
    setDistrict('पुणे');
    setTaluka('बारामती');
    setReporterName(user?.name || 'प्रवीण जगताप');
    setReporterBureau('पुणे ब्युरो');
    setIsBreaking(false);
    setIsFeatured(false);
    setPublished(true);
    setShowModal(true);
  };

  const handleOpenEdit = (article: NewsArticle) => {
    setEditing(article);
    setTitleMr(article.titleMr);
    setSummaryMr(article.summaryMr);
    setContentMr(article.contentMr);
    setImageUrl(article.imageUrl);
    setCategoryMr(article.categoryMr);
    setDistrict(article.district || 'पुणे');
    setTaluka(article.taluka || 'हवेली');
    setReporterName(article.reporter.nameMr);
    setReporterBureau(article.reporter.bureau);
    setIsBreaking(article.isBreaking);
    setIsFeatured(article.isFeatured);
    setPublished(article.published);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr.trim() || !contentMr.trim()) {
      toast('कृपया बातमी शीर्षक व मजकूर भरा', 'error');
      return;
    }

    const articleToSave: NewsArticle = {
      id: editing ? editing.id : `news-${Date.now()}`,
      title: titleMr,
      titleMr,
      slug: `news-${Date.now()}`,
      summary: summaryMr || titleMr,
      summaryMr: summaryMr || titleMr,
      content: contentMr,
      contentMr,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
      category: categoryMr,
      categoryMr,
      district,
      taluka,
      reporter: {
        id: editing?.reporter.id || `rep-${Date.now()}`,
        name: reporterName,
        nameMr: reporterName,
        bureau: reporterBureau,
      },
      publishedAt: editing ? editing.publishedAt : new Date().toISOString(),
      viewsCount: editing ? editing.viewsCount : 150,
      isBreaking,
      isFeatured,
      isTrending: true,
      tags: [categoryMr, district, 'महाराष्ट्र न्यूज'],
      published,
    };

    await dbService.saveNews(articleToSave, user?.name || 'Editor');
    toast(`बातमी यशस्वीरित्या प्रसिद्ध केली: ${articleToSave.titleMr}`, 'success');
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`खात्री आहे का? "${name}" बातमी हटवायची आहे?`)) {
      await dbService.deleteNews(id, user?.name || 'Editor');
      toast('बातमी हटवली गेली', 'info');
      loadData();
    }
  };

  const filtered = newsList.filter(
    n =>
      n.titleMr.toLowerCase().includes(search.toLowerCase()) ||
      (n.district && n.district.toLowerCase().includes(search.toLowerCase())) ||
      n.categoryMr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-orange-500" />
            डिजिटल वृत्त व्यवस्थापन (News CMS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ३६ जिल्ह्यांतील बातम्या, ब्रेकिंग न्यूज टिकर आणि वार्ताहर व्यवस्थापन
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          नवी बातमी तयार करा
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="बातमी, जिल्हा किंवा वर्गवारी शोधा..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3">छायाचित्र</th>
              <th className="pb-3">बातमी शीर्षक</th>
              <th className="pb-3">वर्गवारी</th>
              <th className="pb-3">जिल्हा व तालुका</th>
              <th className="pb-3">वार्ताहर (ब्युरो)</th>
              <th className="pb-3">ब्रेकिंग</th>
              <th className="pb-3">दिनांक</th>
              <th className="pb-3 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(article => (
              <tr key={article.id} className="text-slate-200">
                <td className="py-3">
                  <img
                    src={article.imageUrl}
                    alt={article.titleMr}
                    className="w-12 h-9 rounded-lg object-cover bg-slate-950"
                  />
                </td>
                <td className="py-3 max-w-xs">
                  <p className="font-bold text-white text-xs line-clamp-1">{article.titleMr}</p>
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-orange-400">
                    {article.categoryMr}
                  </span>
                </td>
                <td className="py-3">
                  <span className="text-slate-300">
                    {article.district} {article.taluka ? `(${article.taluka})` : ''}
                  </span>
                </td>
                <td className="py-3">
                  <p className="text-slate-200 font-semibold">{article.reporter.nameMr}</p>
                  <p className="text-[10px] text-slate-500">{article.reporter.bureau}</p>
                </td>
                <td className="py-3">
                  {article.isBreaking ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                      🔴 ब्रेकिंग
                    </span>
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </td>
                <td className="py-3 text-[11px] text-slate-400 font-mono">
                  {new Date(article.publishedAt).toLocaleDateString('mr-IN')}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(article)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id, article.titleMr)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editing ? 'बातमी संपादित करा' : 'नवी बातमी प्रसिद्ध करा'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">बातमी शीर्षक (मराठी) *</label>
                <input
                  type="text"
                  required
                  value={titleMr}
                  onChange={e => setTitleMr(e.target.value)}
                  placeholder="उदा. कांदा बाजारभाव विक्रमी पातळीवर..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">संक्षिप्त सारांश (Lead Paragraph) *</label>
                <textarea
                  required
                  rows={2}
                  value={summaryMr}
                  onChange={e => setSummaryMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">सविस्तर बातमी मजकूर *</label>
                <textarea
                  required
                  rows={6}
                  value={contentMr}
                  onChange={e => setContentMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">वर्गवारी *</label>
                  <select
                    value={categoryMr}
                    onChange={e => setCategoryMr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-orange-400"
                  >
                    <option value="शेती व बाजारभाव">शेती व बाजारभाव</option>
                    <option value="ग्रामीण विकास">ग्रामीण विकास</option>
                    <option value="राजकारण व समाजकारण">राजकारण व समाजकारण</option>
                    <option value="शासकीय योजना">शासकीय योजना</option>
                    <option value="गुन्हे व सुरक्षा">गुन्हे व सुरक्षा</option>
                    <option value="शिक्षण">शिक्षण</option>
                    <option value="रोजगार">रोजगार</option>
                    <option value="महाराष्ट्र बातम्या">महाराष्ट्र बातम्या</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">जिल्हा *</label>
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    {MAHARASHTRA_DISTRICTS.map(d => (
                      <option key={d.id} value={d.nameMr}>
                        {d.nameMr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">तालुका</label>
                  <input
                    type="text"
                    value={taluka}
                    onChange={e => setTaluka(e.target.value)}
                    placeholder="उदा. बारामती, निफाड"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">छायाचित्र URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">वार्ताहर नाव</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={e => setReporterName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={e => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="font-bold text-red-400">🔴 ब्रेकिंग न्यूज टिकरमध्ये दाखवा</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600"
                  />
                  <span>मुख्य बातमी (Featured)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold"
                >
                  बातमी जतन करा (Publish)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
