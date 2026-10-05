import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Plus,
  ArrowLeft,
  Volume2,
  VolumeX,
  Flame
} from 'lucide-react';
import { formatClockMMSS } from '../utils/format';
import { startRepeatingAlarm, stopAlarm, speakVietnamese } from '../utils/audio';
import { TimerSettings } from '../types';

interface TimesUpViewProps {
  settings: TimerSettings;
  onRestart: () => void;
  onAddExtraTime: (seconds: number) => void;
  onBackToSetup: () => void;
}

export const TimesUpView: React.FC<TimesUpViewProps> = ({
  settings,
  onRestart,
  onAddExtraTime,
  onBackToSetup,
}) => {
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [soundActive, setSoundActive] = useState(settings.soundEnabled);

  // Start alarm and speech synthesis when mounted
  useEffect(() => {
    if (soundActive) {
      startRepeatingAlarm(true);
    }
    if (settings.voiceEnabled) {
      speakVietnamese('Các bạn đang chưa ổn định vị trí sẽ bị phạt!');
    }

    const interval = window.setInterval(() => {
      setOvertimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      stopAlarm();
    };
  }, []);

  const toggleSound = () => {
    if (soundActive) {
      stopAlarm();
      setSoundActive(false);
    } else {
      startRepeatingAlarm(true);
      setSoundActive(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-6 md:p-10 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Background pulsating warning ambient light */}
      <div className="absolute inset-0 bg-radial from-rose-900/30 via-red-950/20 to-black pointer-events-none" />
      <div className="absolute inset-0 border-8 md:border-[16px] border-rose-600/40 animate-pulse pointer-events-none" />

      {/* Top Bar with sound and overtime status */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs md:text-sm font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>HẾT GIỜ &bull; QUÁ HẠN: +{formatClockMMSS(overtimeSeconds)}</span>
        </div>

        <button
          onClick={toggleSound}
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 text-xs md:text-sm hover:text-white hover:border-slate-500 transition cursor-pointer"
        >
          {soundActive ? (
            <>
              <Volume2 className="w-4 h-4 text-rose-500 animate-bounce" />
              <span>Tắt còi báo</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Bật còi báo</span>
            </>
          )}
        </button>
      </div>

      {/* Center Giant Warning Notice (Requirement 5) */}
      <div className="relative z-10 max-w-5xl text-center flex flex-col items-center justify-center my-auto px-4">
        {/* Pulsing Alert Icon */}
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-rose-600/20 border-2 border-rose-500 flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(225,29,72,0.5)] animate-bounce">
          <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-rose-500" />
        </div>

        {/* Exact Required Announcement Text */}
        <h1
          className="font-black text-rose-500 tracking-tight uppercase select-all leading-tight text-center drop-shadow-[0_0_40px_rgba(244,63,94,0.6)]"
          style={{
            fontSize: 'min(7vw, 68px)',
          }}
        >
          CÁC BẠN ĐANG CHƯA ỔN ĐỊNH VỊ TRÍ SẼ BỊ PHẠT
        </h1>

        <p className="mt-4 text-base md:text-xl text-rose-300/80 font-medium max-w-2xl">
          Thời gian ổn định chỗ ngồi đã chính thức kết thúc! Vui lòng giữ trật tự và ngồi đúng vị trí ngay lập tức.
        </p>

        {/* Overtime Digital Counter */}
        <div className="mt-6 px-6 py-2 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3">
          <Flame className="w-5 h-5 text-amber-500" />
          <span className="text-sm md:text-base font-semibold text-rose-200">
            Thời gian đã trôi qua:
          </span>
          <span className="font-mono text-xl md:text-2xl font-black text-white">
            +{formatClockMMSS(overtimeSeconds)}
          </span>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="relative z-10 w-full max-w-xl flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 min-w-[160px] py-3.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Đếm lại từ đầu</span>
        </button>

        <button
          type="button"
          onClick={() => onAddExtraTime(60)}
          className="flex-1 min-w-[160px] py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm md:text-base flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
        >
          <Plus className="w-5 h-5 text-amber-400" />
          <span>Gia hạn 1 phút</span>
        </button>

        <button
          type="button"
          onClick={onBackToSetup}
          className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs md:text-sm flex items-center justify-center gap-2 border border-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cài đặt thời gian khác</span>
        </button>
      </div>
    </div>
  );
};
