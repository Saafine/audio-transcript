import { WordTiming } from '../Transcript/interfaces';

export function getNoiseMarkers(wordTimings: WordTiming[], weaveDuration: number): number[] {
  if (!weaveDuration || !wordTimings) return [];

  const noiseMarkers = wordTimings.reduce((noiseMarkers, wordTiming) => {
    return {
      ...noiseMarkers,
      ...getNoiseMarkerForTiming(wordTiming, weaveDuration),
    };
  }, {});

  return Object.keys(noiseMarkers).map(Number);
}

function getNoiseMarkerForTiming(
  { startTimeMs, endTimeMs }: WordTiming,
  weaveDuration: number,
): Record<string, true> {
  const noiseMarkers: Record<string, true> = {};

  let barIndex = Math.floor(startTimeMs / weaveDuration);
  const endBarIndex = Math.floor(endTimeMs / weaveDuration);

  while (barIndex <= endBarIndex) {
    noiseMarkers[barIndex] = true;
    barIndex++;
  }

  return noiseMarkers;
}
