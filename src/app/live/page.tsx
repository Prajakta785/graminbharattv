'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Tv,
  Radio,
  Clock,
  Calendar,
  Users,
  Share2,
  Sparkles,
  CheckCircle2,
  Volume2,
  Maximize
} from 'lucide-react';
import { dbService } from '@/lib/db';
import { LiveChannel } from '@/types';
import { HlsPlayer } from '@/components/video/HlsPlayer';
import { useToast } from '@/context/ToastContext';

function LiveTvContent() {
  const searchParams = useSearchParams();
  const requestedChannel = searchParams.get('channel');
  const { toast } = useToast();

  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>(
    requestedChannel || 'gramin-bharat-live'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      const data = await dbService.getLiveChannels();
      setChannels(data);
      if (requestedChannel && data.some(c => c.id === requestedChannel)) {
        setActiveChannelId(requestedChannel);
      } else if (data.length > 0) {
        setActiveChannelId(data[0].id);
      }
      setLoading(false);
    };

    fetchChannels();
    const handleUpdate = () => fetchChannels();
    window.addEventListener('gbtv_data_updated', handleUpdate);
    return () => window.removeEventListener('gbtv_data_updated', handleUpdate);
  }, [requestedChannel]);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('Live TV लिंक कॉपी केली (Link copied)');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!activeChannel) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Channel Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            २४ तास थेट प्रक्षेपण (Live Broadcasting)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            ग्रामीण भारत डिजिटल लाइव्ह टीव्ही
          </h1>
        </div>

        {/* Channel Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {channels.map(ch => {
            const active = ch.id === activeChannel.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>{ch.nameMr}</span>
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Video Player & Live Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Player + Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <HlsPlayer
              src={activeChannel.streamUrl}
              title={`${activeChannel.nameMr} - २४ तास थेट प्रक्षेपण`}
              isPremium={false}
              hasAccess={true}
              autoPlay={true}
            />
          </div>

          {/* Channel Info Bar */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                  थेट प्रक्षेपण चालू
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-orange-400" />
                  {activeChannel.viewersCount.toLocaleString()} ऑनलाइन दर्शक
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{activeChannel.nameMr}</h2>
              <p className="text-xs text-orange-400 mt-0.5">{activeChannel.taglineMr}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                शेअर करा
              </button>
            </div>
          </div>

          {/* Current Program Details */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/30 border border-slate-800">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> सध्या सुरू असलेला कार्यक्रम:
              </span>
              <span className="text-xs font-mono text-slate-400">
                {activeChannel.currentProgram.startTime} - {activeChannel.currentProgram.endTime}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {activeChannel.currentProgram.titleMr}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {activeChannel.currentProgram.descriptionMr}
            </p>
          </div>
        </div>

        {/* Right: Electronic Program Guide (EPG) */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                कार्यक्रम वेळापत्रक (EPG Guide)
              </h3>
              <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                आजचे प्रक्षेपण
              </span>
            </div>

            <div className="space-y-3">
              {activeChannel.schedule.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.isLive
                      ? 'bg-orange-600/15 border-orange-500/60 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-orange-400 font-bold">
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.isLive && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {item.titleMr}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {item.descriptionMr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Broadcast Tech Card */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-200">थेट प्रक्षेपण तंत्रज्ञान:</p>
            <p>• Bunny.net Stream HLS Adaptive Bitrate</p>
            <p>• Library ID: <strong className="text-white">809137</strong></p>
            <p>• 4K Ultra HD & 1080p Low-Latency Streaming</p>
            <p className="text-emerald-400 font-semibold mt-2">
              ✓ महाराष्ट्र शासन माहिती व जनसंपर्क मान्यताप्राप्त
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveTvPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-6 select-none">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <LiveTvContent />
      </Suspense>
    </div>
  );
}
