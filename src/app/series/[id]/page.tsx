'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import {
  Play,
  Sparkles,
  ArrowLeft,
  Clock,
  Share2,
  Plus,
  Check,
  ChevronRight,
  User,
  ListVideo
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { WebSeries, Episode, Season } from '@/types';
import { HlsPlayer } from '@/components/video/HlsPlayer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function SeriesDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const seriesId = resolvedParams.id;

  const { user, isInWatchlist, toggleWatchlist, addToHistory } = useAuth();
  const { toast } = useToast();

  const [series, setSeries] = useState<WebSeries | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const s = await dbService.getSeriesById(seriesId);
      setSeries(s);
      if (s && s.seasons?.length > 0) {
        const firstSeason = s.seasons[0];
        setSelectedSeason(firstSeason.seasonNumber);
        if (firstSeason.episodes?.length > 0) {
          setActiveEpisode(firstSeason.episodes[0]);
        }
      }
      setLoading(false);
    };
    load();
  }, [seriesId]);

  const handlePlayEpisode = (episode: Episode) => {
    setActiveEpisode(episode);
    setIsPlaying(true);
    addToHistory({
      contentId: episode.id,
      contentType: 'episode',
      title: `${series?.titleMr}: ${episode.titleMr}`,
      posterUrl: episode.thumbnailUrl,
      progressSeconds: 0,
      durationSeconds: episode.duration * 60,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold">वेब सिरीज सापडली नाही</h2>
        <Link href="/series" className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-xs font-bold">
          परत जा
        </Link>
      </div>
    );
  }

  const currentSeasonData = series.seasons?.find(sn => sn.seasonNumber === selectedSeason) || series.seasons?.[0];
  const isSaved = isInWatchlist(series.id);
  const hasAccess = activeEpisode ? (!activeEpisode.isPremium || user?.subscription?.status === 'active') : true;

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('वेब सिरीज लिंक कॉपी केली');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Link
        href="/series"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> सर्व वेब सिरीजकडे परत
      </Link>

      {/* Active Player */}
      {isPlaying && activeEpisode ? (
        <div className="mb-8">
          <HlsPlayer
            src={activeEpisode.videoUrl}
            poster={activeEpisode.thumbnailUrl}
            title={`${series.titleMr} - ${activeEpisode.titleMr}`}
            isPremium={activeEpisode.isPremium}
            hasAccess={hasAccess}
            autoPlay={true}
          />
        </div>
      ) : (
        <div className="cinematic-backdrop relative w-full aspect-[21/9] min-h-[300px] sm:min-h-[400px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl mb-8 group">
          <img
            src={series.backdropUrl || series.posterUrl}
            alt={series.titleMr}
            className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17] via-[#0B0F17]/60 to-transparent" />

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => {
                if (activeEpisode) handlePlayEpisode(activeEpisode);
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-orange-600/50 hover:scale-110 transition-transform"
            >
              <Play className="w-9 h-9 fill-current translate-x-1" />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white flex items-center gap-1 shadow">
                <Sparkles className="w-3.5 h-3.5" /> ओरिजिनल सिरीज
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/60 text-slate-200 border border-white/10">
                {series.contentRating}
              </span>
            </div>
            <h1 className="hero-title text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              {series.titleMr}
            </h1>
            <p className="hero-subtitle text-xs sm:text-sm text-slate-200 mt-1">{series.title}</p>
          </div>
        </div>
      )}

      {/* Series Overview */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="text-orange-400 font-semibold">{series.genres?.join(', ')}</span>
            <span>•</span>
            <span>{series.seasons?.length || 1} सीझन</span>
            <span>•</span>
            <span>{series.language}</span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">{series.descriptionMr}</p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                toggleWatchlist(series.id);
                toast(isSaved ? 'यादीतून काढले' : 'माझ्या यादीत जोडले');
              }}
              className={`px-5 py-2.5 rounded-2xl border font-semibold text-xs transition-all flex items-center gap-2 ${
                isSaved
                  ? 'bg-orange-600/20 text-orange-400 border-orange-500/50'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
              }`}
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isSaved ? 'यादीत आहे' : 'माझी यादी'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Seasons & Episodes Section */}
      <div className="border-t border-slate-800 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ListVideo className="w-5 h-5 text-orange-500" />
            भाग व सीझन (Episodes)
          </h2>

          {/* Season Selector */}
          {series.seasons && series.seasons.length > 1 && (
            <div className="flex items-center gap-2">
              {series.seasons.map(sn => (
                <button
                  key={sn.seasonNumber}
                  onClick={() => setSelectedSeason(sn.seasonNumber)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSeason === sn.seasonNumber
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  सीझन {sn.seasonNumber}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Episode List */}
        <div className="space-y-4">
          {currentSeasonData?.episodes?.map(ep => {
            const isCurrent = activeEpisode?.id === ep.id;
            return (
              <div
                key={ep.id}
                onClick={() => handlePlayEpisode(ep)}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-orange-950/20 border-orange-500/60 shadow-lg shadow-orange-950/30'
                    : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.titleMr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        isCurrent ? 'bg-orange-600' : 'bg-black/60 group-hover:bg-orange-600'
                      }`}>
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white">
                      {ep.duration} मि.
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-400">
                        भाग {ep.episodeNumber}
                      </span>
                      {ep.isPremium ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600/30 text-orange-400 border border-orange-500/40">
                          प्रीमियम
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600/30 text-emerald-400 border border-emerald-500/40">
                          मोफत
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-orange-400 transition-colors mt-1">
                      {ep.titleMr}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed max-w-2xl">
                      {ep.synopsisMr}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 hidden md:block">
                  <button className="px-4 py-2 rounded-xl bg-slate-800 group-hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    पहा
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white select-none pb-16">
      <Suspense fallback={
        <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <SeriesDetailContent params={params} />
      </Suspense>
    </div>
  );
}
