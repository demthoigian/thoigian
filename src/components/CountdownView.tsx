import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Plus
} from 'lucide-react';
import { formatClockMMSS } from '../utils/format';
import { playTick } from '../utils/audio';
import { TimerSettings } from '../types';

interface CountdownViewProps {
  settings: TimerSettings;
  remainingSeconds: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onExit: () => void;
  onAddSeconds: (seconds: number) => void;
  announcementText: string;
}

export const CountdownView: React.FC<CountdownViewProps> = ({
  settings,
  remainingSeconds,
  isPaused,
  onTogglePause,
  onReset,
  onExit,
  onAddSeconds,
  announcementText,
}) => {
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);

  // Monitor mouse movements to show/hide controls cleanly
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2200);
  };

  useEffect(() => {
    // Initial display of controls for 2s, then auto-fade
    handleMouseMove();
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Play tick sounds on the final 5 seconds
  useEffect(() => {
    if (!isPaused && remainingSeconds <= 5 && remainingSeconds > 0) {
      if (settings.tickSoundEnabled) {
        playTick(remainingSeconds === 1 ? 1000 : 750);
      }
    }
  }, [remainingSeconds, isPaused, settings.tickSoundEnabled]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePause();
        handleMouseMove();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        onExit();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePause, onExit, onReset]);

  // Format time string
  const displayString =
    settings.displayFormat === 'seconds_only'
      ? `${remainingSeconds}`
      : formatClockMMSS(remainingSeconds);

  // Color dynamics: normal white/light-cyan, yellow/amber at <= 30s, red at <= 10s
  const isCritical = remainingSeconds <= 10;
  const isWarning = remainingSeconds <= 30 && remainingSeconds > 10;

  const numberColorClass = isCritical
    ? 'text-rose-500 drop-shadow-[0_0_50px_rgba(244,63,94,0.4)] animate-pulse'
    : isWarning
    ? 'text-amber-400 drop-shadow-[0_0_35px_rgba(251,191,36,0.3)]'
    : 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]';

  // Background style based on setting ("không có nền")
  const bgStyleClass =
    settings.theme === 'black'
      ? 'bg-black'
      : settings.theme === 'transparent'
      ? 'bg-transparent'
      : 'bg-[#060911]';

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={() => {
        // Clicking empty space toggles controls visibility
        handleMouseMove();
      }}
      className={`fixed inset-0 select-none overflow-hidden flex flex-col items-center justify-center transition-colors duration-500 ${bgStyleClass}`}
    >
      {/* Top Banner (Optional subtle notice or requested banner) */}
      {settings.showSubtitleWhileCounting && (
        <div
          className={`absolute top-6 md:top-10 left-4 right-4 text-center transition-opacity duration-500 z-10 pointer-events-none ${
            controlsVisible ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <span className="inline-block px-5 py-2 rounded-full text-xs md:text-sm lg:text-base font-bold uppercase tracking-widest text-amber-300/90 bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm shadow-sm">
            {announcementText}
          </span>
        </div>
      )}

      {/* PAUSED Status Badge if paused */}
      {isPaused && (
        <div className="absolute top-20 z-20 animate-bounce">
          <span className="px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs md:text-sm tracking-wider uppercase shadow-lg shadow-amber-500/30">
            ĐANG TẠM DỪNG
          </span>
        </div>
      )}

      {/* Requirement 4: "Khi đếm ngược chỉ hiện số to giữa màn hình, không có nền" */}
      <div className="w-full flex items-center justify-center pointer-events-none px-4">
        <span
          className={`font-mono font-black tabular-nums transition-transform duration-200 select-none text-center ${numberColorClass}`}
          style={{
            fontSize: 'min(24vw, 36vh)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          {displayString}
        </span>
      </div>

      {/* Floating Minimalist Control Bar (Auto-hiding on mouse idle) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-6 md:bottom-10 z-30 transition-all duration-300 ${
          controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={onTogglePause}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm transition cursor-pointer"
            title="Tạm dừng / Tiếp tục (Phím Cách Space)"
          >
            {isPaused ? <Play className="w-4 h-4 fill-slate-950" /> : <Pause className="w-4 h-4 fill-slate-950" />}
            <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
          </button>

          {/* Add 30s quick button */}
          <button
            type="button"
            onClick={() => onAddSeconds(30)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="Cộng thêm 30 giây"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>+30s</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            title="Đếm lại từ đầu (Phím R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
            title="Toàn màn hình (Phím F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit / Back to Setup */}
          <button
            type="button"
            onClick={onExit}
            className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-100 border border-rose-500/30 transition cursor-pointer ml-1"
            title="Quay lại cài đặt (Phím Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center mt-2">
          <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
            [Space] Tạm dừng &bull; [Esc] Thoát &bull; [F] Toàn màn hình
          </span>
        </div>
      </div>
    </div>
  );
};
