import React, { useState } from 'react';
import {
  Play,
  Clock,
  Volume2,
  VolumeX,
  Maximize2,
  Eye,
  AlertTriangle,
  Sparkles,
  Settings2,
  RotateCcw
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { formatVietnameseDuration, formatClockMMSS } from '../utils/format';
import { TimerSettings, TimeDisplayFormat, BackgroundTheme } from '../types';

interface SetupViewProps {
  settings: TimerSettings;
  onUpdateSettings: (newSettings: Partial<TimerSettings>) => void;
  onStart: () => void;
}

const PRESET_DURATIONS = [
  { label: '30 Giây', seconds: 30 },
  { label: '1 Phút', seconds: 60 },
  { label: '2 Phút', seconds: 120 },
  { label: '3 Phút', seconds: 180 },
  { label: '5 Phút', seconds: 300 },
  { label: '10 Phút', seconds: 600 },
  { label: '15 Phút', seconds: 900 },
];

export const SetupView: React.FC<SetupViewProps> = ({
  settings,
  onUpdateSettings,
  onStart,
}) => {
  const [minutes, setMinutes] = useState(Math.floor(settings.initialSeconds / 60));
  const [seconds, setSeconds] = useState(settings.initialSeconds % 60);

  const applyTime = (newMin: number, newSec: number) => {
    const validMin = Math.max(0, Math.min(999, newMin));
    const validSec = Math.max(0, Math.min(59, newSec));
    setMinutes(validMin);
    setSeconds(validSec);
    const total = validMin * 60 + validSec;
    onUpdateSettings({ initialSeconds: Math.max(1, total) });
  };

  const handleSelectPreset = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    setMinutes(m);
    setSeconds(s);
    onUpdateSettings({ initialSeconds: sec });
  };

  const totalSeconds = minutes * 60 + seconds;
  const vietnameseTimeStr = formatVietnameseDuration(totalSeconds > 0 ? totalSeconds : 60);
  const announcementText = `CÁC BẠN CÓ ${vietnameseTimeStr} ĐỂ ỔN ĐỊNH CHỔ NGỒI`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Đồng Hồ Đếm Ngược
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Ổn định chỗ ngồi
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Dành cho lớp học, hội thảo, cuộc họp & sự kiện
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">
        {/* Banner Announcement Preview Card (Requirement 2 & 5) */}
        <section className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-rose-500/10 p-5 md:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Thông báo sẽ hiển thị khi bắt đầu</span>
          </div>

          <div className="my-2 p-4 md:p-5 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center">
            <p className="text-lg md:text-2xl lg:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 select-all uppercase">
              "{announcementText}"
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Thời gian đếm ngược: <strong>{formatClockMMSS(totalSeconds)}</strong> ({vietnameseTimeStr})</span>
            </div>
            <div className="text-slate-400 text-xs">
              Tự động cập nhật theo số phút/giây bạn nhập bên dưới
            </div>
          </div>
        </section>

        {/* 1. Nhập Thời Gian */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-base md:text-lg font-bold text-white">Nhập Thời Gian Đếm Ngược</h2>
            </div>
            <button
              onClick={() => applyTime(2, 0)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định (2 phút)</span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Chọn nhanh thời gian:
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_DURATIONS.map((preset) => {
                const isActive = totalSeconds === preset.seconds;
                return (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => handleSelectPreset(preset.seconds)}
                    className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105 ring-2 ring-amber-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Input Controls (Minutes & Seconds) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            {/* Minutes */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
              <span className="text-xs uppercase font-semibold text-slate-400 mb-2">Số Phút</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => applyTime(minutes - 1, seconds)}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition cursor-pointer"
                  title="Giảm 1 phút"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={minutes}
                  onChange={(e) => applyTime(parseInt(e.target.value) || 0, seconds)}
                  className="w-20 text-center text-3xl font-extrabold bg-transparent text-white border-b-2 border-amber-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => applyTime(minutes + 1, seconds)}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition cursor-pointer"
                  title="Tăng 1 phút"
                >
                  +
                </button>
              </div>
            </div>

            {/* Seconds */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col items-center">
              <span className="text-xs uppercase font-semibold text-slate-400 mb-2">Số Giây</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => applyTime(minutes, Math.max(0, seconds - 5))}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition cursor-pointer"
                  title="Giảm 5 giây"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => applyTime(minutes, parseInt(e.target.value) || 0)}
                  className="w-20 text-center text-3xl font-extrabold bg-transparent text-white border-b-2 border-amber-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => applyTime(minutes, Math.min(59, seconds + 5))}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg flex items-center justify-center transition cursor-pointer"
                  title="Tăng 5 giây"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cảnh báo khi hết giờ Preview (Requirement 5) */}
        <section className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
              !
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-rose-300">
                Thông báo khi hết thời gian (Requirement 5)
              </h2>
              <p className="text-xs text-rose-400/80">
                Khi đồng hồ về 00:00, toàn bộ màn hình sẽ phát cảnh báo cực lớn:
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/40 text-center flex items-center justify-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse flex-shrink-0" />
            <p className="text-base md:text-xl font-black text-rose-400 tracking-wide uppercase">
              "CÁC BẠN ĐANG CHƯA ỔN ĐỊNH VỊ TRÍ SẼ BỊ PHẠT"
            </p>
          </div>
        </section>

        {/* 4. Tùy Chọn Hiển Thị Số To Không Nền & Âm Thanh */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-base md:text-lg font-bold text-white">
              Tùy Chọn Chế Độ Đếm Ngược (Số to giữa màn hình, không nền)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Format choice */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <label className="text-sm font-semibold text-white block mb-1">
                  Kiểu hiển thị chữ số
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Chọn giữa đồng hồ Phút:Giây (02:00) hoặc thuần số giây
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ displayFormat: 'mmss' })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    settings.displayFormat === 'mmss'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Đồng hồ (02:00)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ displayFormat: 'seconds_only' })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    settings.displayFormat === 'seconds_only'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Chỉ số giây ({totalSeconds})
                </button>
              </div>
            </div>

            {/* Background theme: black / dark / transparent */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <label className="text-sm font-semibold text-white block mb-1">
                  Màu nền khi chiếu (Không khung / Không viền)
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Đảm bảo màn hình không có bất kỳ nền hay viền cản trở
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ theme: 'black' })}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    settings.theme === 'black'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-black text-slate-300 border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  Đen tuyền (OLED)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ theme: 'dark' })}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    settings.theme === 'dark'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  Xanh đêm đậm
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ theme: 'transparent' })}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    settings.theme === 'transparent'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900/60 text-slate-300 border border-slate-700 hover:border-slate-500'
                  }`}
                >
                  Tối giản
                </button>
              </div>
            </div>

            {/* Sound Toggles */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  Còi báo động khi hết giờ
                </span>
                <span className="text-xs text-slate-400">
                  Phát âm thanh báo động dồn dập khi hết thời gian
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.soundEnabled ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Fullscreen Auto-trigger */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-sky-400" />
                  Tự động mở Toàn Màn Hình
                </span>
                <span className="text-xs text-slate-400">
                  Phóng to che toàn bộ màn hình máy tính khi bắt đầu
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ autoFullscreen: !settings.autoFullscreen })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.autoFullscreen ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.autoFullscreen ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Show title header while counting toggle */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between md:col-span-2">
              <div>
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  Hiển thị dòng chữ thông báo nhỏ phía trên số đếm
                </span>
                <span className="text-xs text-slate-400">
                  Nếu tắt, màn hình sẽ CHỈ hiển thị duy nhất số to khổng lồ ở giữa màn hình không có bất kỳ thứ gì khác
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ showSubtitleWhileCounting: !settings.showSubtitleWhileCounting })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ml-4 ${
                  settings.showSubtitleWhileCounting ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.showSubtitleWhileCounting ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Start Button */}
        <div className="pt-2 pb-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="w-full max-w-md py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xl tracking-wide uppercase shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-7 h-7 fill-slate-950" />
            <span>BẮT ĐẦU ĐẾM NGƯỢC</span>
          </button>
          <span className="text-xs text-slate-500">
            Phím tắt: Nhấn phím <strong>[Enter]</strong> để bắt đầu nhanh
          </span>
        </div>
      </main>
    </div>
  );
};
