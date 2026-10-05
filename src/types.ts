export type TimerMode = 'setup' | 'counting' | 'paused' | 'ended';

export type TimeDisplayFormat = 'mmss' | 'seconds_only';

export type BackgroundTheme = 'black' | 'dark' | 'transparent';

export interface TimerSettings {
  initialSeconds: number;
  customMessage: string;
  displayFormat: TimeDisplayFormat;
  theme: BackgroundTheme;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  tickSoundEnabled: boolean;
  autoFullscreen: boolean;
  showSubtitleWhileCounting: boolean;
}
