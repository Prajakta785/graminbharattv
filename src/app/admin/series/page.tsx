'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { dbService } from '@/lib/db';
import { WebSeries } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminSeriesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [seriesList, setSeriesList] = useState<WebSeries[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<WebSeries | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [descriptionMr, setDescriptionMr] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [creator, setCreator] = useState('');
  const [genres, setGenres] = useState('राजकीय, ड्रामा');
  const [isPremium, setIsPremium] = useState(true);

  const loadData = async () => {
    const list = await dbService.getWebSeries();
    setSeriesList(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setTitle('');
    setTitleMr('');
    setDescriptionMr('');
    setPosterUrl('https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80');
    setBackdropUrl('https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=1600&q=80');
    setCreator('आनंद जाधव');
    setGenres('राजकीय, ड्रामा');
    setIsPremium(true);
    setShowModal(true);
  };

  const handleOpenEdit = (s: WebSeries) => {
    setEditing(s);
    setTitle(s.title);
    setTitleMr(s.titleMr);
    setDescriptionMr(s.descriptionMr);
    setPosterUrl(s.posterUrl);
    setBackdropUrl(s.backdropUrl || '');
    setCreator(s.creator);
    setGenres(s.genres?.join(', ') || '');
    setIsPremium(s.isPremium);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr.trim()) {
      toast('नाव भरा', 'error');
      return;
    }

    const seriesToSave: WebSeries = {
      id: editing ? editing.id : `ws-${Date.now()}`,
      title: title || titleMr,
      titleMr,
      description: descriptionMr,
      descriptionMr,
      posterUrl,
      backdropUrl: backdropUrl || posterUrl,
      genres: genres.split(',').map(g => g.trim()),
      language: 'मराठी',
      contentRating: 'U/A',
      isPremium,
      isFeatured: true,
      isTrending: true,
      creator,
      totalEpisodes: editing ? editing.totalEpisodes : 6,
      cast: editing?.cast || [
        { name: 'Upendra Limaye', nameMr: 'उपेंद्र लिमये', role: 'मुख्य भूमिका' },
      ],
      seasons: editing?.seasons || [
        {
          seasonNumber: 1,
          title: 'Season 1',
          titleMr: 'सीझन १',
          episodesCount: 3,
          episodes: [
            {
              id: `ep-${Date.now()}-1`,
              seriesId: editing ? editing.id : `ws-${Date.now()}`,
              seasonNumber: 1,
              episodeNumber: 1,
              title: 'भाग १',
              titleMr: 'भाग १: उमेदवारी अर्ज',
              synopsis: 'Election begins',
              synopsisMr: 'निवडणूक सुरू होते',
              thumbnailUrl: posterUrl,
              videoUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
              bunnyVideoId: '809137-ep1',
              bunnyLibraryId: '809137',
              duration: 35,
              isPremium: false,
              viewsCount: 400,
              releaseDate: '2026-01-01',
            },
          ],
        },
      ],
      createdAt: editing ? editing.createdAt : new Date().toISOString(),
      published: true,
    };

    await dbService.saveSeries(seriesToSave, user?.name || 'Admin');
    toast(`वेब सिरीज जतन केली: ${seriesToSave.titleMr}`, 'success');
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`खात्री आहे का? "${name}" मालिका हटवायची आहे?`)) {
      await dbService.deleteSeries(id, user?.name || 'Admin');
      toast('मालिका हटवली गेली', 'info');
      loadData();
    }
  };

  const filtered = seriesList.filter(
    s =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.titleMr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-orange-500" />
            वेब सिरीज व्यवस्थापन (Web Series Management)
          </h2>
          <p className="text-xs text-slate-400 mt-1">सीझन, एपिसोड्स आणि बन्नी.नेट व्हिडिओ व्यवस्थापन</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          नवीन वेब सिरीज जोडा
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="सिरीज शोधा..."
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
              <th className="pb-3">पोस्टर</th>
              <th className="pb-3">शीर्षक (मराठी)</th>
              <th className="pb-3">दिग्दर्शक / निर्माता</th>
              <th className="pb-3">सीझन व एकूण भाग</th>
              <th className="pb-3">प्रवेश</th>
              <th className="pb-3 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(s => (
              <tr key={s.id} className="text-slate-200">
                <td className="py-3">
                  <img src={s.posterUrl} alt={s.titleMr} className="w-12 h-16 rounded-lg object-cover" />
                </td>
                <td className="py-3 font-bold text-white text-sm">{s.titleMr}</td>
                <td className="py-3 text-slate-400">{s.creator}</td>
                <td className="py-3">
                  <span className="text-orange-400 font-bold">{s.seasons?.length || 1} सीझन</span>
                  <span className="text-slate-500 block">
                    ({s.seasons?.reduce((sum, sn) => sum + (sn.episodes?.length || 0), 0) || 0} भाग)
                  </span>
                </td>
                <td className="py-3">
                  {s.isPremium ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600/30 text-orange-400 border border-orange-500/40">
                      प्रीमियम
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                      मोफत
                    </span>
                  )}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.titleMr)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">
                {editing ? 'वेब सिरीज संपादित करा' : 'नवीन वेब सिरीज जोडा'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">नाव (मराठी) *</label>
                <input
                  type="text"
                  required
                  value={titleMr}
                  onChange={e => setTitleMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">सारांश *</label>
                <textarea
                  required
                  rows={3}
                  value={descriptionMr}
                  onChange={e => setDescriptionMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">पोस्टर URL</label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={e => setPosterUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">निर्माता / लेखक</label>
                  <input
                    type="text"
                    value={creator}
                    onChange={e => setCreator(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold"
                >
                  जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
