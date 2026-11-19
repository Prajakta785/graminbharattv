'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import {
  Play,
  Sparkles,
  Clock,
  Calendar,
  Share2,
  Plus,
  Check,
  Star,
  User,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { Movie } from '@/types';
import { HlsPlayer } from '@/components/video/HlsPlayer';
import { ContentRow } from '@/components/ui/ContentRow';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function MovieDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const { user, isInWatchlist, toggleWatchlist, addToHistory } = useAuth();
  const { toast } = useToast();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const m = await dbService.getMovieById(movieId);
      const all = await dbService.getMovies();
      setMovie(m);
      setAllMovies(all.filter(item => item.id !== movieId));
      setLoading(false);

      if (m) {
        addToHistory({
          contentId: m.id,
          contentType: 'movie',
          title: m.titleMr || m.title,
          posterUrl: m.posterUrl,
          progressSeconds: 0,
          durationSeconds: m.duration * 60,
        });
      }
    };
    load();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">चित्रपट माहिती लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">चित्रपट सापडला नाही</h2>
        <Link href="/movies" className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-xs font-bold">
          चित्रपट दालनात परत जा
        </Link>
      </div>
    );
  }

  const isSaved = isInWatchlist(movie.id);
  const hasAccess = !movie.isPremium || user?.subscription?.status === 'active';

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('चित्रपट लिंक कॉपी केली (Link copied)');
    }
  };

  const related = allMovies.filter(m =>
    m.genres.some(g => movie.genres.includes(g))
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white select-none">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link
          href="/movies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> सर्व चित्रपटांकडे परत
        </Link>
      </div>

      {/* Hero Player / Backdrop Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {isPlaying ? (
          <div className="mb-8">
            <HlsPlayer
              src={movie.videoUrl}
              embedUrl={movie.embedUrl}
              poster={movie.backdropUrl || movie.posterUrl}
              title={movie.titleMr || movie.title}
              isPremium={movie.isPremium}
              hasAccess={hasAccess}
              autoPlay={true}
            />
          </div>
        ) : (
          <div className="cinematic-backdrop relative w-full aspect-[21/9] min-h-[300px] sm:min-h-[420px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl mb-8 group">
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt={movie.titleMr}
              className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/60 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-orange-600/50 hover:scale-110 transition-transform"
              >
                <Play className="w-9 h-9 fill-current translate-x-1" />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {movie.isPremium ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white flex items-center gap-1 shadow">
                      <Sparkles className="w-3.5 h-3.5" />
                      प्रीमियम
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow">
                      मोफत चित्रपट
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/60 text-slate-200 border border-white/10">
                    {movie.contentRating}
                  </span>
                </div>
                <h1 className="hero-title text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {movie.titleMr}
                </h1>
                <p className="hero-subtitle text-xs sm:text-sm text-slate-200 mt-1">{movie.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-400" />
                {movie.duration} मिनिटे
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-orange-400" />
                वर्ष {movie.releaseYear}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium">
                {movie.language}
              </span>
              <span>•</span>
              <span className="text-orange-400 font-semibold">
                {movie.genres?.join(', ')}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsPlaying(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>चित्रपट सुरू करा</span>
              </button>

              <button
                onClick={() => {
                  toggleWatchlist(movie.id);
                  toast(
                    isSaved
                      ? 'यादीतून काढले (Removed from watchlist)'
                      : 'माझ्या यादीत जोडले (Added to watchlist)'
                  );
                }}
                className={`px-5 py-3 rounded-2xl border font-semibold text-sm transition-all flex items-center gap-2 ${
                  isSaved
                    ? 'bg-orange-600/20 text-orange-400 border-orange-500/50'
                    : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isSaved ? 'यादीत जोडले आहे' : 'माझी यादी'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                title="Share Movie"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="text-base font-bold text-white mb-2">चित्रपटाचा सारांश (Synopsis)</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {movie.descriptionMr}
              </p>
              {movie.description && (
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                  {movie.description}
                </p>
              )}
            </div>

            {/* Cast & Crew Profiles */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-white mb-4">प्रमुख कलाकार व दिग्दर्शक (Cast & Crew)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
                    {movie.director?.photoUrl ? (
                      <img src={movie.director.photoUrl} alt={movie.director.nameMr} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{movie.director?.nameMr}</p>
                    <p className="text-[10px] text-orange-400 font-semibold">दिग्दर्शक (Director)</p>
                  </div>
                </div>

                {movie.producer && (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{movie.producer.nameMr}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold">निर्माता (Producer)</p>
                    </div>
                  </div>
                )}

                {movie.cast?.map((actor, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 overflow-hidden shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate">{actor.nameMr}</p>
                      <p className="text-[10px] text-slate-400 truncate">{actor.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Poster & Tech Metadata */}
          <div className="space-y-6">
            <div className="aspect-[2/3] w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <img
                src={movie.posterUrl}
                alt={movie.titleMr}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2">
                तांत्रिक माहिती (Streaming Specs)
              </h4>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">CDN नेटवर्क:</span>
                <span className="font-mono text-orange-400">Bunny.net Stream</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Library ID:</span>
                <span className="font-mono">809137</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">गुणवत्ता:</span>
                <span>4K / 1080p / 720p Adaptive HLS</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">ऑडिओ:</span>
                <span>Dolby 5.1 / Stereo Marathi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12">
          <ContentRow
            title="Related Movies"
            titleMr="संबंधित चित्रपट"
            items={related}
            type="movie"
          />
        </div>
      )}
    </div>
  );
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MovieDetailContent params={params} />
    </Suspense>
  );
}
