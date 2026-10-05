/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SetupView } from './components/SetupView';
import { CountdownView } from './components/CountdownView';
import { TimesUpView } from './components/TimesUpView';
import { TimerMode, TimerSettings } from './types';
import { formatVietnameseDuration } from './utils/format';
import { playStartSound, speakVietnamese, stopAlarm } from './utils/audio';

const STORAGE_KEY = 'countdown_seat_settings_v1';

const DEFAULT_SETTINGS: TimerSettings = {
  initialSeconds: 120, // 2 minutes default
  customMessage: '',
  displayFormat: 'mmss',
  theme: 'black',
  soundEnabled: true,
  voiceEnabled: false,
  tickSoundEnabled: true,
  autoFullscreen: false,
  showSubtitleWhileCounting: false, // Strict adherence to: "chỉ hiện số to giữa màn hình, không có nền"
};

export default function App() {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_SETTINGS;
  });

  const [mode, setMode] = useState<TimerMode>('setup');
  const [remainingSeconds, setRemainingSeconds] = useState(settings.initialSeconds);
  const isPaused = mode === 'paused';

  // Save settings when changed
  const updateSettings = useCallback((newPartial: Partial<TimerSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  // Compute Vietnamese formatted announcement text
  const durationText = formatVietnameseDuration(settings.initialSeconds);
  const announcementText = `CÁC BẠN CÓ ${durationText} ĐỂ ỔN ĐỊNH CHỔ NGỒI`;

  // Start countdown handler
  const handleStart = useCallback(() => {
    setRemainingSeconds(settings.initialSeconds);
    setMode('counting');

    // Optional audio notification
    playStartSound();
    if (settings.voiceEnabled) {
      speakVietnamese(announcementText);
    }

    // Auto fullscreen if enabled
    if (settings.autoFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, [settings, announcementText]);

  // Handle global Enter key on setup screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'setup' && e.key === 'Enter') {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleStart]);

  // Main timer interval ticker
  const targetEndTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode !== 'counting') {
      targetEndTimestampRef.current = null;
      return;
    }

    targetEndTimestampRef.current = Date.now() + remainingSeconds * 1000;

    const interval = window.setInterval(() => {
      if (!targetEndTimestampRef.current) return;
      const msLeft = targetEndTimestampRef.current - Date.now();
      const secsLeft = Math.max(0, Math.ceil(msLeft / 1000));

      setRemainingSeconds(secsLeft);

      if (secsLeft <= 0) {
        clearInterval(interval);
        setMode('ended');
      }
    }, 250);

    return () => clearInterval(interval);
  }, [mode]);

  // Pause / Resume toggle
  const togglePause = useCallback(() => {
    if (mode === 'counting') {
      setMode('paused');
    } else if (mode === 'paused') {
      targetEndTimestampRef.current = Date.now() + remainingSeconds * 1000;
      setMode('counting');
    }
  }, [mode, remainingSeconds]);

  // Reset to initial time
  const handleReset = useCallback(() => {
    stopAlarm();
    setRemainingSeconds(settings.initialSeconds);
    setMode('counting');
    targetEndTimestampRef.current = Date.now() + settings.initialSeconds * 1000;
  }, [settings.initialSeconds]);

  // Return to setup
  const handleExit = useCallback(() => {
    stopAlarm();
    setMode('setup');
  }, []);

  // Add extra seconds during countdown
  const handleAddSeconds = useCallback((sec: number) => {
    setRemainingSeconds((prev) => {
      const next = prev + sec;
      if (targetEndTimestampRef.current) {
        targetEndTimestampRef.current += sec * 1000;
      }
      return next;
    });
  }, []);

  // Restart countdown from ended view
  const handleRestartFromEnded = useCallback(() => {
    stopAlarm();
    setRemainingSeconds(settings.initialSeconds);
    setMode('counting');
    targetEndTimestampRef.current = Date.now() + settings.initialSeconds * 1000;
  }, [settings.initialSeconds]);

  // Add extra time from ended view (e.g. +1 min extension)
  const handleAddExtraFromEnded = useCallback((sec: number) => {
    stopAlarm();
    setRemainingSeconds(sec);
    setMode('counting');
    targetEndTimestampRef.current = Date.now() + sec * 1000;
  }, []);

  return (
    <div className="w-full min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {mode === 'setup' && (
        <SetupView
          settings={settings}
          onUpdateSettings={updateSettings}
          onStart={handleStart}
        />
      )}

      {(mode === 'counting' || mode === 'paused') && (
        <CountdownView
          settings={settings}
          remainingSeconds={remainingSeconds}
          isPaused={isPaused}
          onTogglePause={togglePause}
          onReset={handleReset}
          onExit={handleExit}
          onAddSeconds={handleAddSeconds}
          announcementText={announcementText}
        />
      )}

      {mode === 'ended' && (
        <TimesUpView
          settings={settings}
          onRestart={handleRestartFromEnded}
          onAddExtraTime={handleAddExtraFromEnded}
          onBackToSetup={handleExit}
        />
      )}
    </div>
  );
}
