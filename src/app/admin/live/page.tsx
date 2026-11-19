'use client';

import React, { useEffect, useState } from 'react';
import { Tv, Edit2, Save, Radio, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { dbService } from '@/lib/db';
import { LiveChannel, ProgramSchedule } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLivePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('gramin-bharat-live');
  const [activeChannel, setActiveChannel] = useState<LiveChannel | null>(null);

  // Edit states
  const [streamUrl, setStreamUrl] = useState('');
  const [bunnyStreamId, setBunnyStreamId] = useState('');
  const [currentProgTitle, setCurrentProgTitle] = useState('');
  const [currentProgDesc, setCurrentProgDesc] = useState('');
  const [currentProgStart, setCurrentProgStart] = useState('');
  const [currentProgEnd, setCurrentProgEnd] = useState('');

  const loadChannels = async () => {
    const list = await dbService.getLiveChannels();
    setChannels(list);
    const curr = list.find(c => c.id === selectedChannelId) || list[0];
    if (curr) {
      setActiveChannel(curr);
      setStreamUrl(curr.streamUrl);
      setBunnyStreamId(curr.bunnyStreamId || '');
      setCurrentProgTitle(curr.currentProgram.titleMr);
      setCurrentProgDesc(curr.currentProgram.descriptionMr);
      setCurrentProgStart(curr.currentProgram.startTime);
      setCurrentProgEnd(curr.currentProgram.endTime);
    }
  };

  useEffect(() => {
    loadChannels();
  }, [selectedChannelId]);

  const handleSaveChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChannel) return;

    const updatedChannel: LiveChannel = {
      ...activeChannel,
      streamUrl,
      bunnyStreamId,
      currentProgram: {
        title: currentProgTitle,
        titleMr: currentProgTitle,
        descriptionMr: currentProgDesc,
        startTime: currentProgStart,
        endTime: currentProgEnd,
      },
    };

    await dbService.updateLiveChannel(updatedChannel, user?.name || 'Admin');
    toast(`थेट चॅनेल अपडेट केले: ${updatedChannel.nameMr}`, 'success');
    loadChannels();
  };

  if (!activeChannel) return null;

  return (
    <div className="space-y-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Tv className="w-6 h-6 text-red-500" />
            Live TV व EPG वेळापत्रक व्यवस्थापन
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            प्रत्यक्ष Bunny.net किंवा HLS (.m3u8) लाइव्ह स्ट्रीम URL व दैनिक कार्यक्रम सूची अपडेट करा
          </p>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannelId(ch.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedChannelId === ch.id
                  ? 'bg-orange-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {ch.nameMr}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSaveChannel} className="space-y-6">
        {/* Stream URL configuration */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              {activeChannel.nameMr} - थेट प्रक्षेपण स्त्रोत (Live HLS Source)
            </h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
              ON AIR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Bunny.net Stream ID / Live Token
              </label>
              <input
                type="text"
                value={bunnyStreamId}
                onChange={e => setBunnyStreamId(e.target.value)}
                placeholder="809137-live-gb"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Bunny Library ID: 809137
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                HLS Stream URL (.m3u8) / RTMP Output URL *
              </label>
              <input
                type="url"
                required
                value={streamUrl}
                onChange={e => setStreamUrl(e.target.value)}
                placeholder="https://.../live.m3u8"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                कस्टम HLS किंवा CDN स्ट्रीम लिंक
              </span>
            </div>
          </div>
        </div>

        {/* Current Airing Program (EPG Live) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            सध्या सुरू असलेला कार्यक्रम (Current Airing Show)
          </h3>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1.5">
                  कार्यक्रमाचे शीर्षक (मराठी) *
                </label>
                <input
                  type="text"
                  required
                  value={currentProgTitle}
                  onChange={e => setCurrentProgTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    सुरू वेळ
                  </label>
                  <input
                    type="text"
                    value={currentProgStart}
                    onChange={e => setCurrentProgStart(e.target.value)}
                    placeholder="१०:०० AM"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    समाप्ती वेळ
                  </label>
                  <input
                    type="text"
                    value={currentProgEnd}
                    onChange={e => setCurrentProgEnd(e.target.value)}
                    placeholder="११:०० AM"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                कार्यक्रमाचे संक्षिप्त वर्णन *
              </label>
              <textarea
                required
                rows={2}
                value={currentProgDesc}
                onChange={e => setCurrentProgDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            बदल सेव्ह करा व थेट प्रसारित करा
          </button>
        </div>
      </form>
    </div>
  );
}
