'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Settings,
  Lock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface HlsPlayerProps {
  src: string;
  embedUrl?: string;
  poster?: string;
  title: string;
  isPremium?: boolean;
  hasAccess?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  initialTime?: number;
  autoPlay?: boolean;
}

export const HlsPlayer: React.FC<HlsPlayerProps> = ({
  src,
  embedUrl,
  poster,
  title,
  isPremium = false,
  hasAccess = true,
  onTimeUpdate,
  initialTime = 0,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualities, setQualities] = useState<{ id: number; height: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // If Bunny.net embed URL is provided or src is iframe URL
  if (embedUrl || (src && src.includes('iframe.mediadelivery.net'))) {
    const finalEmbed = embedUrl || src;
    return (
      <div className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-2xl select-none group border border-slate-800">
        {isPremium && !hasAccess ? (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white shadow-2xl shadow-orange-600/50 mb-4 animate-bounce">
              <Lock className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-600/30 text-orange-400 border border-orange-500/40 mb-2">
              ४K UHD प्रीमियम चित्रपट
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white max-w-md">
              {title}
            </h3>
            <p className="text-sm text-slate-300 max-w-md mt-2">
              हा चित्रपट आणि सर्व थेट प्रक्षेपण पाहण्यासाठी &apos;वार्षिक प्रीमियम प्लॅन&apos; सक्रिय करा.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Link
                href="/subscribe"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-600/40 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>वार्षिक प्लॅन घ्या (₹३९९/वर्ष)</span>
              </Link>
            </div>
          </div>
        ) : (
          <iframe
            src={finalEmbed}
            loading="lazy"
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          />
        )}
      </div>
    );
  }

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || (isPremium && !hasAccess)) return;

    let hls: Hls | null = null;

    if (Hls.isSupported() && (src.includes('.m3u8') || src.includes('stream') || src.includes('playlist'))) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const available = data.levels.map((level, index) => ({
          id: index,
          height: level.height || 720,
        }));
        setQualities(available);

        if (initialTime > 0) {
          video.currentTime = initialTime;
        }
        if (autoPlay) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentQuality(data.level);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || src.endsWith('.mp4') || src.endsWith('.ogg')) {
      video.src = src;
      if (initialTime > 0) {
        video.currentTime = initialTime;
      }
      if (autoPlay) {
        video.play().catch(() => {});
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, isPremium, hasAccess, initialTime, autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
    if (onTimeUpdate) {
      onTimeUpdate(video.currentTime, video.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const target = parseFloat(e.target.value);
    video.currentTime = target;
    setCurrentTime(target);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = parseFloat(e.target.value);
    video.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // If premium and locked
  if (isPremium && !hasAccess) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-6 text-center shadow-2xl border border-orange-500/30">
        {poster && (
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
          />
        )}
        <div className="relative z-10 max-w-md flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/50 flex items-center justify-center text-orange-400 mb-4 shadow-lg shadow-orange-600/20">
            <Lock className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-950/60 border border-orange-700/50 rounded-full mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            प्रीमियम सामग्री (Premium Content)
          </span>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            हा चित्रपट किंवा वेब सिरीज पाहण्यासाठी सक्रिय सबस्क्रिप्शन आवश्यक आहे. आजच ग्रामीण भारत टीव्ही प्रीमियम प्लॅन घ्या!
          </p>
          <Link
            href="/subscribe"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-sm shadow-xl shadow-orange-600/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            केवळ ₹१४९ मध्ये सुरू करा (Subscribe)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="group relative w-full aspect-video rounded-2xl overflow-hidden bg-black select-none shadow-2xl border border-slate-800"
    >
      <video
        ref={videoRef}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Overlay gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Title bar */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-700 text-white uppercase tracking-wider">
            HLS 1080p
          </span>
          <h2 className="text-sm font-semibold truncate max-w-md drop-shadow">{title}</h2>
        </div>
        <div className="text-xs text-slate-300">Bunny.net Stream • 809137</div>
      </div>

      {/* Center play/pause indicator */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-orange-600/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-orange-600/50 backdrop-blur-sm"
        >
          <Play className="w-8 h-8 fill-current translate-x-0.5" />
        </button>
      )}

      {/* Bottom control bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber / Seek Bar */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-orange-400 transition-colors p-1">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime -= 10;
              }}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> 10s
            </button>

            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-orange-400 transition-colors p-1">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            <span className="text-xs text-slate-300 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Speed & Quality settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="hover:text-orange-400 transition-colors p-1"
              title="Playback Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showSettings && (
              <div className="absolute bottom-10 right-0 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs flex flex-col gap-2 min-w-[140px] z-30">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  वेगाचे प्रमाण (Speed)
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {[0.75, 1, 1.25, 1.5, 2].map(s => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-2 py-1 rounded text-center font-medium ${
                        playbackSpeed === s ? 'bg-orange-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {qualities.length > 0 && (
                  <>
                    <hr className="border-slate-800 my-1" />
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                      गुणवत्ता (Quality)
                    </span>
                    <button
                      onClick={() => {
                        setCurrentQuality(-1);
                        setShowSettings(false);
                      }}
                      className={`px-2 py-1 rounded text-left font-medium ${
                        currentQuality === -1 ? 'bg-orange-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      Auto (स्वयंचलित)
                    </button>
                    {qualities.map(q => (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrentQuality(q.id);
                          setShowSettings(false);
                        }}
                        className={`px-2 py-1 rounded text-left font-medium ${
                          currentQuality === q.id ? 'bg-orange-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        {q.height}p HD
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}

            <button onClick={toggleFullscreen} className="hover:text-orange-400 transition-colors p-1">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
