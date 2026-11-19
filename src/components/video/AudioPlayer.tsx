'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Radio,
  Share2
} from 'lucide-react';
import { PodcastEpisode } from '@/types';
import { useToast } from '@/context/ToastContext';

interface AudioPlayerProps {
  episode: PodcastEpisode;
  onNext?: () => void;
  onPrev?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ episode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(episode.durationSeconds || 1200);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [episode.id]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = parseFloat(e.target.value);
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const handleSpeedToggle = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    setSpeed(newSpeed);
  };

  const skip = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + delta));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast('पॉडकास्ट लिंक कॉपी केली (Link copied)');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Thumbnail */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-slate-700/60">
          <img
            src={episode.thumbnailUrl}
            alt={episode.titleMr}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white flex items-center gap-1 shadow">
            <Radio className="w-3 h-3 animate-pulse" />
            पॉडकास्ट
          </div>
        </div>

        {/* Content Info & Controls */}
        <div className="flex-1 w-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
                {episode.categoryMr}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-1 leading-snug">
                {episode.titleMr}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                निवेदक / सूत्रसंचालक: <strong className="text-slate-200">{episode.host.nameMr}</strong>
              </p>
            </div>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Scrubber */}
          <div className="space-y-1 my-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <button
                onClick={() => skip(-15)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Rewind 15s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                onClick={() => skip(15)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Forward 15s"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSpeedToggle}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                {speed}x वेग
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => {
                    const audio = audioRef.current;
                    if (!audio) return;
                    audio.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    if (audioRef.current) audioRef.current.volume = val;
                    setVolume(val);
                    setIsMuted(val === 0);
                  }}
                  className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
