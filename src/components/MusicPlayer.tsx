import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';
import { Track } from '../types';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      if (duration) {
        audioRef.current.currentTime = (newProgress / 100) * duration;
        setProgress(newProgress);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 pixel-border bg-black/80 crt-screen w-full max-w-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full border-2 border-neon-magenta flex items-center justify-center bg-dark-bg overflow-hidden"
          >
            <Disc className="w-16 h-16 text-neon-magenta opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-neon-cyan neon-shadow" />
            </div>
          </motion.div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-yellow animate-pulse" />
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="text-[10px] text-neon-magenta/70 font-display uppercase tracking-widest">NOW_PLAYING</span>
          <h3 className="text-xl font-bold text-neon-cyan truncate glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-xs text-neon-cyan/60 font-display">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-between h-12 gap-1 px-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            animate={isPlaying ? {
              height: [
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`,
                `${Math.random() * 100}%`
              ]
            } : { height: '10%' }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: i * 0.05
            }}
            className={`w-full ${i % 2 === 0 ? 'bg-neon-cyan' : 'bg-neon-magenta'} opacity-60`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1 bg-neon-cyan/20 appearance-none cursor-pointer accent-neon-magenta"
        />
        <div className="flex justify-between text-[10px] text-neon-cyan/50 font-display">
          <span>00:00</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={prevTrack} className="p-2 text-neon-cyan hover:text-neon-magenta transition-colors">
            <SkipBack size={24} />
          </button>
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-neon-cyan text-black hover:bg-neon-magenta hover:scale-105 transition-all neon-shadow"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={nextTrack} className="p-2 text-neon-cyan hover:text-neon-magenta transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-neon-cyan/50" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-neon-cyan/20 appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>
      </div>

      <div className="border-t border-neon-cyan/20 pt-4">
        <div className="flex items-center gap-2 text-[10px] text-neon-cyan/40 mb-2">
          <Music size={12} />
          <span>PLAYLIST_QUEUE</span>
        </div>
        <div className="flex flex-col gap-1">
          {TRACKS.map((track, i) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(i);
                setIsPlaying(true);
              }}
              className={`flex justify-between items-center p-2 text-[10px] transition-colors ${
                i === currentTrackIndex ? 'bg-neon-cyan/10 text-neon-cyan' : 'hover:bg-white/5 text-neon-cyan/60'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="opacity-30">{i + 1}.</span>
                {track.title}
              </span>
              <span>{track.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
