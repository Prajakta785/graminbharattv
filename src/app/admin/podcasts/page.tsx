'use client';

import React, { useEffect, useState } from 'react';
import { Radio, Plus, Search, Trash2, Edit2, Play, X } from 'lucide-react';
import { dbService } from '@/lib/db';
import { PodcastEpisode } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminPodcastsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PodcastEpisode | null>(null);

  // Form State
  const [titleMr, setTitleMr] = useState('');
  const [descriptionMr, setDescriptionMr] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [durationMins, setDurationMins] = useState(25);
  const [categoryMr, setCategoryMr] = useState('प्रगतीशील शेती');
  const [hostName, setHostName] = useState('डॉ. आनंद पाटील');

  const loadData = async () => {
    const list = await dbService.getPodcasts();
    setPodcasts(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditing(null);
    setTitleMr('');
    setDescriptionMr('');
    setThumbnailUrl('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80');
    setAudioUrl('https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/menu.ogg');
    setDurationMins(25);
    setCategoryMr('प्रगतीशील शेती');
    setHostName('डॉ. आनंद पाटील');
    setShowModal(true);
  };

  const handleOpenEdit = (p: PodcastEpisode) => {
    setEditing(p);
    setTitleMr(p.titleMr);
    setDescriptionMr(p.descriptionMr);
    setThumbnailUrl(p.thumbnailUrl);
    setAudioUrl(p.audioUrl);
    setDurationMins(Math.round(p.durationSeconds / 60));
    setCategoryMr(p.categoryMr);
    setHostName(p.host.nameMr);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr.trim()) {
      toast('नाव भरा', 'error');
      return;
    }

    const podToSave: PodcastEpisode = {
      id: editing ? editing.id : `pod-${Date.now()}`,
      title: titleMr,
      titleMr,
      description: descriptionMr,
      descriptionMr,
      thumbnailUrl,
      audioUrl: audioUrl || 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/menu.ogg',
      durationSeconds: Number(durationMins) * 60,
      category: categoryMr,
      categoryMr,
      host: {
        name: hostName,
        nameMr: hostName,
        role: 'पॉडकास्ट होस्ट',
      },
      listensCount: editing ? editing.listensCount : 120,
      publishedAt: editing ? editing.publishedAt : new Date().toISOString(),
    };

    await dbService.savePodcast(podToSave, user?.name || 'Admin');
    toast(`पॉडकास्ट भाग जतन केला: ${podToSave.titleMr}`, 'success');
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`खात्री आहे का? "${name}" पॉडकास्ट हटवायचा आहे?`)) {
      await dbService.deletePodcast(id, user?.name || 'Admin');
      toast('पॉडकास्ट हटवला गेला', 'info');
      loadData();
    }
  };

  const filtered = podcasts.filter(
    p =>
      p.titleMr.toLowerCase().includes(search.toLowerCase()) ||
      p.host.nameMr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-orange-500" />
            पॉडकास्ट व्यवस्थापन (Podcasts CMS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            कृषी यशोगाथा, सेंद्रिय तंत्रज्ञान व ऑडिओ मुलाखतींचे व्यवस्थापन
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          नवीन पॉडकास्ट भाग जोडा
        </button>
      </div>

      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="पॉडकास्ट शोधा..."
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
              <th className="pb-3">थंबनेल</th>
              <th className="pb-3">शीर्षक (मराठी)</th>
              <th className="pb-3">वर्गवारी</th>
              <th className="pb-3">निवेदक (Host)</th>
              <th className="pb-3">कालावधी</th>
              <th className="pb-3">श्रोते</th>
              <th className="pb-3 text-right">कृती</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(pod => (
              <tr key={pod.id} className="text-slate-200">
                <td className="py-3">
                  <img src={pod.thumbnailUrl} alt={pod.titleMr} className="w-12 h-12 rounded-xl object-cover bg-slate-950" />
                </td>
                <td className="py-3 font-bold text-white max-w-xs">
                  <p className="line-clamp-1">{pod.titleMr}</p>
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-orange-400">
                    {pod.categoryMr}
                  </span>
                </td>
                <td className="py-3 text-slate-300">{pod.host.nameMr}</td>
                <td className="py-3 font-mono">{Math.round(pod.durationSeconds / 60)} मिनिटे</td>
                <td className="py-3 text-emerald-400 font-bold">{pod.listensCount.toLocaleString()}</td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(pod)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pod.id, pod.titleMr)}
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
                {editing ? 'पॉडकास्ट भाग संपादित करा' : 'नवीन पॉडकास्ट जोडा'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">पॉडकास्ट शीर्षक (मराठी) *</label>
                <input
                  type="text"
                  required
                  value={titleMr}
                  onChange={e => setTitleMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">संक्षिप्त माहिती / विषय वर्णन *</label>
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
                  <label className="block text-slate-300 mb-1">वर्गवारी (Category)</label>
                  <select
                    value={categoryMr}
                    onChange={e => setCategoryMr(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="प्रगतीशील शेती">प्रगतीशील शेती</option>
                    <option value="सेंद्रिय शेती">सेंद्रिय शेती</option>
                    <option value="ग्रामीण उद्योजकता">ग्रामीण उद्योजकता</option>
                    <option value="महिला सक्षमीकरण">महिला सक्षमीकरण</option>
                    <option value="बचत गट क्रांती">बचत गट क्रांती</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">निवेदक नाव (Host)</label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={e => setHostName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">ऑडिओ फाइल URL (.mp3 / .ogg)</label>
                  <input
                    type="url"
                    value={audioUrl}
                    onChange={e => setAudioUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">कालावधी (मिनिटे)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={e => setDurationMins(Number(e.target.value))}
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
                  पॉडकास्ट जतन करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
