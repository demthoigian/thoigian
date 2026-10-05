import React, { useState } from 'react';
import { Download, Monitor, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed and running as standalone desktop app
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Đã cài đặt trên máy</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400 rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:shadow-sky-500/20"
        title="Cài đặt phần mềm trực tiếp lên máy tính của bạn"
      >
        <Monitor className="w-4 h-4 text-sky-400" />
        <span>Cài đặt lên máy tính</span>
        <Download className="w-3.5 h-3.5 ml-0.5 opacity-70" />
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cài đặt ứng dụng vào máy tính</h3>
                <p className="text-xs text-slate-400">Sử dụng độc lập như một phần mềm máy tính (Desktop App)</p>
              </div>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-slate-300">
              {isIOS ? (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  <p className="font-semibold text-amber-400 mb-1">Dành cho iPhone/iPad (Safari):</p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                    <li>Nhấn nút <strong>Chia sẻ (Share)</strong> trên thanh công cụ Safari.</li>
                    <li>Chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.</li>
                  </ol>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
                  <p className="font-medium text-sky-300">Cách cài đặt nhanh trên Google Chrome / Cốc Cốc / Edge:</p>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Nhìn lên thanh địa chỉ trình duyệt, bấm biểu tượng <strong>Cài đặt ứng dụng</strong> (hình máy tính hoặc dấu mũi tên tải xuống ở góc phải).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-xs font-bold">2</span>
                    <span>Hoặc bấm menu <strong>⋮ (3 chấm)</strong> &rarr; chọn <strong>Cài đặt ứng dụng</strong> (hoặc <em>Lưu và chia sẻ &rarr; Cài đặt ứng dụng này</em>).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-xs font-bold">3</span>
                    <span>Biểu tượng đếm ngược sẽ xuất hiện ngay trên Desktop máy tính, mở chạy không cần mở trình duyệt!</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm transition-colors cursor-pointer shadow-lg shadow-sky-600/30"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
