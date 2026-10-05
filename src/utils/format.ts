/**
 * Formats seconds into natural Vietnamese string.
 * Example: 120s -> "2 PHÚT"
 * Example: 90s -> "1 PHÚT 30 GIÂY"
 * Example: 45s -> "45 GIÂY"
 */
export function formatVietnameseDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return '0 GIÂY';

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0 && seconds > 0) {
    return `${minutes} PHÚT ${seconds} GIÂY`;
  }
  if (minutes > 0) {
    return `${minutes} PHÚT`;
  }
  return `${seconds} GIÂY`;
}

/**
 * Formats seconds into MM:SS digital string
 * Example: 125 -> "02:05"
 * Example: 45 -> "00:45"
 * Example: 3665 -> "61:05"
 */
export function formatClockMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `${mm}:${ss}`;
}
