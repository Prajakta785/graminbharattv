'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Plus, Trash2, Edit2, X, ExternalLink } from 'lucide-react';
import { dbService } from '@/lib/db';
import { Banner } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminBannersPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  // Form State
  const [titleMr, setTitleMr] = useState('');
  const [subtitleMr, setSubtitleMr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('/movies');
  const [badgeTextMr, setBadgeTextMr] = useState('विशेष प्रीमियर');
  const [buttonTextMr, setButtonTextMr] = useState('आता पहा');
  const [sortOrder, setSortOrder] = useState(1);

  const loadData = async () => {
    const list = await dbService.getBanners();
    setBanners(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setTitleMr('');
    setSubtitleMr('');
    setImageUrl('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80');
    setLinkUrl('/movies');
    setBadgeTextMr('विशेष प्रीमियर');
    setButtonTextMr('आता पहा');
    setSortOrder(banners.length + 1);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr.trim() || !imageUrl.trim()) {
      toast('माहिती भरा', 'error');
      return;
    }

    const bToSave: Banner = {
      id: editing ? editing.id : `b-${Date.now()}`,
      title: titleMr,
      titleMr,
      subtitleMr,
      imageUrl,
      linkUrl,
      badgeTextMr,
      buttonTextMr,
      type: 'movie',
      isActive: true,
      sortOrder: Number(sortOrder),
    };

    await dbService.saveBanner(bToSave);
    toast('बॅनर जतन केला', 'success');
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('हा बॅनर हटवायचा आहे का?')) {
      await dbService.deleteBanner(id);
      toast('बॅनर हटवला', 'info');
      loadData();
    }
  };

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500" />
            होमपेज बॅनर व कॅरोसेल व्यवस्थापन
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            OTT मुख्यपृष्ठावरील प्रमुख चित्रपट, लाइव्ह चॅनेल व ॲप प्रमोशन बॅनर्स
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          नवीन बॅनर जोडा
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="relative aspect-[16/8] overflow-hidden bg-slate-950">
              <img src={b.imageUrl} alt={b.titleMr} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white shadow">
                  क्रम: {b.sortOrder}
                </span>
                {b.badgeTextMr && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-slate-200">
                    {b.badgeTextMr}
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-base font-bold text-white drop-shadow">{b.titleMr}</h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">{b.subtitleMr}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between bg-slate-950/60 border-t border-slate-800 text-xs">
              <span className="text-orange-400 font-mono text-[11px] truncate max-w-[200px]">
                {b.linkUrl}
              </span>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">नवीन बॅनर जोडा</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">बॅनर शीर्षक (मराठी) *</label>
                <input
                  type="text"
                  required
                  value={titleMr}
                  onChange={e => setTitleMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">उपशीर्षक / टॅगलाइन</label>
                <input
                  type="text"
                  value={subtitleMr}
                  onChange={e => setSubtitleMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">इमेज URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">टार्गेट लिंक URL</label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">बटन मजकूर</label>
                  <input
                    type="text"
                    value={buttonTextMr}
                    onChange={e => setButtonTextMr(e.target.value)}
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
                  बॅनर जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
