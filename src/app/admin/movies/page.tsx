'use client';

import React, { useEffect, useState } from 'react';
import {
  Film,
  Plus,
  Search,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  Play,
  Upload
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { Movie } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { FALLBACK_STREAMS } from '@/lib/bunny';

export default function AdminMoviesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleMr, setTitleMr] = useState('');
  const [descriptionMr, setDescriptionMr] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [bunnyVideoId, setBunnyVideoId] = useState('');
  const [duration, setDuration] = useState(120);
  const [releaseYear, setReleaseYear] = useState(2026);
  const [genres, setGenres] = useState('नाटक, सामाजिक');
  const [isPremium, setIsPremium] = useState(false);
  const [published, setPublished] = useState(true);

  const loadMovies = async () => {
    const list = await dbService.getMovies();
    setMovies(list);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleOpenCreate = () => {
    setEditingMovie(null);
    setTitle('');
    setTitleMr('');
    setDescriptionMr('');
    setPosterUrl('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80');
    setBackdropUrl('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80');
    setVideoUrl(FALLBACK_STREAMS.FEATURED_MOVIE);
    setBunnyVideoId('809137-new-movie');
    setDuration(125);
    setReleaseYear(2026);
    setGenres('नाटक, शेती, सामाजिक');
    setIsPremium(false);
    setPublished(true);
    setShowModal(true);
  };

  const handleOpenEdit = (m: Movie) => {
    setEditingMovie(m);
    setTitle(m.title);
    setTitleMr(m.titleMr);
    setDescriptionMr(m.descriptionMr);
    setPosterUrl(m.posterUrl);
    setBackdropUrl(m.backdropUrl || '');
    setVideoUrl(m.videoUrl);
    setBunnyVideoId(m.bunnyVideoId || '');
    setDuration(m.duration);
    setReleaseYear(m.releaseYear);
    setGenres(m.genres?.join(', ') || '');
    setIsPremium(m.isPremium);
    setPublished(m.published);
    setShowModal(true);
  };

  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleMr.trim() || !title.trim()) {
      toast('कृपया चित्रपटाचे नाव भरा', 'error');
      return;
    }

    const movieToSave: Movie = {
      id: editingMovie ? editingMovie.id : `m-${Date.now()}`,
      title,
      titleMr,
      description: descriptionMr,
      descriptionMr,
      posterUrl,
      backdropUrl: backdropUrl || posterUrl,
      videoUrl: videoUrl || FALLBACK_STREAMS.FEATURED_MOVIE,
      bunnyVideoId: bunnyVideoId || '809137-stream',
      bunnyLibraryId: '809137',
      duration: Number(duration),
      releaseYear: Number(releaseYear),
      genres: genres.split(',').map(g => g.trim()).filter(Boolean),
      language: 'मराठी',
      contentRating: 'U/A',
      isPremium,
      isFeatured: true,
      isTrending: true,
      viewsCount: editingMovie ? editingMovie.viewsCount : 1200,
      director: editingMovie?.director || {
        name: 'Director Name',
        nameMr: 'संतोष शिंदे',
      },
      cast: editingMovie?.cast || [
        { name: 'Lead Actor', nameMr: 'मकरंद अनासपुरे', role: 'मुख्य भूमिका' },
      ],
      createdAt: editingMovie ? editingMovie.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published,
    };

    await dbService.saveMovie(movieToSave, user?.name || 'Admin');
    toast(`चित्रपट यशस्वीरित्या जतन केला: ${movieToSave.titleMr}`, 'success');
    setShowModal(false);
    loadMovies();
  };

  const handleDeleteMovie = async (id: string, name: string) => {
    if (confirm(`खात्री आहे का? "${name}" चित्रपट हटवायचा आहे?`)) {
      await dbService.deleteMovie(id, user?.name || 'Admin');
      toast('चित्रपट हटवला गेला', 'info');
      loadMovies();
    }
  };

  const filtered = movies.filter(
    m =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.titleMr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Film className="w-6 h-6 text-orange-500" />
            चित्रपट व्यवस्थापन (Movies Management)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Bunny.net Stream Library 809137 सह चित्रपट अपलोड व व्यवस्थापन करा
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          नवीन चित्रपट जोडा
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="चित्रपट नाव शोधा..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      {/* Movies Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3">पोस्टर</th>
              <th className="pb-3">चित्रपट नाव (मराठी/English)</th>
              <th className="pb-3">कालावधी व वर्ष</th>
              <th className="pb-3">वर्गवारी (प्रकार)</th>
              <th className="pb-3"> Buny.net Video ID</th>
              <th className="pb-3">प्रवेश (Access)</th>
              <th className="pb-3">स्थिती</th>
              <th className="pb-3 text-right">कृती (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(movie => (
              <tr key={movie.id} className="text-slate-200">
                <td className="py-3">
                  <img
                    src={movie.posterUrl}
                    alt={movie.titleMr}
                    className="w-12 h-16 rounded-lg object-cover bg-slate-950 border border-slate-800"
                  />
                </td>
                <td className="py-3">
                  <p className="font-bold text-white text-sm">{movie.titleMr}</p>
                  <p className="text-[11px] text-slate-400">{movie.title}</p>
                </td>
                <td className="py-3">
                  <p>{movie.duration} मिनिटे</p>
                  <p className="text-[10px] text-slate-400">{movie.releaseYear}</p>
                </td>
                <td className="py-3">
                  <span className="text-orange-400">{movie.genres?.join(', ')}</span>
                </td>
                <td className="py-3 font-mono text-slate-400">
                  {movie.bunnyVideoId || '809137-id'}
                </td>
                <td className="py-3">
                  {movie.isPremium ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600/30 text-orange-400 border border-orange-500/40">
                      प्रीमियम
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                      मोफत
                    </span>
                  )}
                </td>
                <td className="py-3">
                  {movie.published ? (
                    <span className="text-emerald-400 font-bold">प्रसिद्ध (Live)</span>
                  ) : (
                    <span className="text-slate-500">अप्रकाशित</span>
                  )}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(movie)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id, movie.titleMr)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400"
                      title="Delete"
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

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingMovie ? 'चित्रपट संपादित करा' : 'नवीन चित्रपट जोडा'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    चित्रपट नाव (मराठी) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleMr}
                    onChange={e => setTitleMr(e.target.value)}
                    placeholder="उदा. मातीचे पाश"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Matinche Pash"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  चित्रपट सारांश (मराठी) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={descriptionMr}
                  onChange={e => setDescriptionMr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    पोस्टर इमेज URL
                  </label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={e => setPosterUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    बॅकड्रॉप इमेज URL
                  </label>
                  <input
                    type="url"
                    value={backdropUrl}
                    onChange={e => setBackdropUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Video Integration */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400">
                    Bunny.net Stream Integration (Library ID: 809137)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Bunny.net Video ID / GUID
                    </label>
                    <input
                      type="text"
                      value={bunnyVideoId}
                      onChange={e => setBunnyVideoId(e.target.value)}
                      placeholder="809137-movie-001"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Direct HLS Stream (.m3u8) / MP4 URL
                    </label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={e => setVideoUrl(e.target.value)}
                      placeholder="https://.../playlist.m3u8"
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    कालावधी (मिनिटे)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    वर्ष
                  </label>
                  <input
                    type="number"
                    value={releaseYear}
                    onChange={e => setReleaseYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    प्रकार (Genres)
                  </label>
                  <input
                    type="text"
                    value={genres}
                    onChange={e => setGenres(e.target.value)}
                    placeholder="नाटक, सामाजिक"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={e => setIsPremium(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>प्रीमियम चित्रपट (वर्गणी आवश्यक)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>वेबसाइटवर तात्काळ प्रसिद्ध करा (Published)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30"
                >
                  चित्रपट जतन करा (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
