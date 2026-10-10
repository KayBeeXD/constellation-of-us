import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, RotateCcw, Edit3, Settings, Volume1 } from 'lucide-react';
import { cosmicAudio } from '../utils/audioSynth';

interface AudioControlsProps {
  onResetConstellation: () => void;
  onOpenCustomizer: () => void;
  visitedCount: number;
  totalCount: number;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  onResetConstellation,
  onOpenCustomizer,
  visitedCount,
  totalCount,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    cosmicAudio.setMute(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
      cosmicAudio.setMute(false);
    }
    cosmicAudio.setVolume(val);
  };

  const handleNextTrack = () => {
    const idx = cosmicAudio.toggleTrack();
    setActiveTrack(idx);
  };

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2 select-none">
      {/* Progress pill indicator */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs text-amber-200 font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Constellation: {visitedCount} / {totalCount}</span>
      </div>

      {/* Customize Quotes Button */}
      <button
        onClick={onOpenCustomizer}
        className="p-2 sm:p-2.5 rounded-full glass-panel text-amber-200 hover:text-white hover:border-amber-300/50 transition-all shadow-md active:scale-95"
        title="Customize Quotes & Letter"
      >
        <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Reset Constellation Progress Button */}
      <button
        onClick={onResetConstellation}
        className="p-2 sm:p-2.5 rounded-full glass-panel text-amber-200 hover:text-white hover:border-amber-300/50 transition-all shadow-md active:scale-95"
        title="Reset Constellation"
      >
        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Settings Panel Toggle */}
      <div className="relative">
        <button
          onClick={() => setShowSettings(prev => !prev)}
          className="p-2 sm:p-2.5 rounded-full glass-panel text-amber-200 hover:text-white hover:border-amber-300/50 transition-all shadow-md active:scale-95"
          title="Audio & Atmosphere Settings"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Dropdown audio panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 sm:mt-3 w-52 sm:w-56 glass-card rounded-xl p-3.5 sm:p-4 border border-amber-300/30 text-white shadow-2xl space-y-3 z-50"
            >
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold border-b border-amber-300/20 pb-2">
                <span>Audio Settings</span>
                <Music className="w-3.5 h-3.5" />
              </div>

              {/* Volume Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Volume1 className="w-3.5 h-3.5 text-amber-200" />
                    Volume
                  </span>
                  <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Change Track */}
              <div className="space-y-1">
                <div className="text-[11px] text-slate-400">Current Music:</div>
                <div className="text-xs font-medium text-amber-200 truncate bg-slate-900/60 p-1.5 rounded border border-amber-300/20">
                  🎵 {cosmicAudio.getCurrentTrackName()}
                </div>
              </div>

              <button
                onClick={handleNextTrack}
                className="w-full py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-amber-200 flex items-center justify-between transition-colors mt-1 cursor-pointer"
              >
                <span>Switch Track</span>
                <span className="text-[10px] text-amber-400/70">Track #{activeTrack + 1}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Mute / Play Audio Button */}
      <button
        onClick={toggleMute}
        className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 shadow-lg active:scale-95 ${
          isMuted
            ? 'glass-panel text-slate-400 border-red-500/30'
            : 'bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(243,229,171,0.5)]'
        }`}
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />}
      </button>
    </div>
  );
};
