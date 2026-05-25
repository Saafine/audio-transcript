import { WordTiming } from '../Transcript/interfaces';

export function getNoiseMarkers(wordTimings: WordTiming[], weaveDuration: number): number[] {
  if (!weaveDuration || !wordTimings) return [];

  const bars = new Set<number>();

  for (const { startTimeMs, endTimeMs } of wordTimings) {
    const endBarIndex = Math.floor(endTimeMs / weaveDuration);
    for (let barIndex = Math.floor(startTimeMs / weaveDuration); barIndex <= endBarIndex; barIndex++) {
      bars.add(barIndex);
    }
  }

  return Array.from(bars);
}
