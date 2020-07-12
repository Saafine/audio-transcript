import React, { useState } from 'react';
import { WordTiming } from '../core';
import WeaveProgress from './WeaveProgress';

type NoiseMarker = Record<string, number>;

// TODO [P. Labus] move this to app ?
export function getNoiseMarkerForTiming(
  { startTimeMs, endTimeMs }: WordTiming,
  weaveDuration: number,
  durationMs: number,
): NoiseMarker {
  const noiseMarkers: NoiseMarker = {};

  let barIndex = Math.floor(startTimeMs / weaveDuration);
  const endBarIndex = Math.floor(endTimeMs / weaveDuration);

  while (barIndex <= endBarIndex) {
    noiseMarkers[barIndex] = (startTimeMs / durationMs) * 100;
    barIndex++;
  }

  return noiseMarkers;
}

function getNoiseMarkers(
  wordTimings: WordTiming[],
  weaveDuration: number,
  durationMs: number,
): Array<[string, number]> {
  if (!weaveDuration || !wordTimings) return [];

  const noiseBars = wordTimings.reduce((noiseMarkers, wordTiming) => {
    return {
      ...noiseMarkers,
      ...getNoiseMarkerForTiming(wordTiming, weaveDuration, durationMs),
    };
  }, {});

  return Object.entries(noiseBars);
}

function WeaveForms({
  wordTimings,
  durationMs,
  currentTimeMs,
}: {
  wordTimings: WordTiming[] | any;
  currentTimeMs: number | any;
  durationMs: number | any; // TODO [P. Labus] find all anys 
}) {
  const containerWidthPx = 900;
  const weaveBarHeightPx = 60;
  const weaveBarWidthPx = 3;
  const spaceBetweenBarsPx = 5;
  const weaveBarCount = Math.floor(
    containerWidthPx / (weaveBarWidthPx + 2 * spaceBetweenBarsPx),
  );

  const weaveDuration = Math.floor(durationMs / weaveBarCount);
  const noiseMarkers = getNoiseMarkers(wordTimings, weaveDuration, durationMs);

  const wasListenedTo = (weaveBarIndex: string) => {
    const progressWidth = (currentTimeMs / durationMs) * containerWidthPx; // TODO [P. Labus] same as in weave progres
    const startOfWeaveBar =
      Number(weaveBarIndex) * (weaveBarWidthPx + 2 * spaceBetweenBarsPx); // TODO [P. Labus] same as left position
    return startOfWeaveBar <= progressWidth;
  };

  return (
    <div
      className={'flex relative'}
      style={{
        width: containerWidthPx,
        height: weaveBarHeightPx,
        border: '1px solid yellow',
      }}
    >
      <WeaveProgress currentTimeMs={currentTimeMs} durationMs={durationMs} />
      {noiseMarkers.map(([weaveBarIndex, startTimeMs], index) => (
        <div
          key={index}
          style={{
            height: weaveBarHeightPx,
            width: weaveBarWidthPx,
            background: wasListenedTo(weaveBarIndex) ? 'red' : 'gray',
            position: 'absolute',
            left:
              Number(weaveBarIndex) *
                (weaveBarWidthPx + 2 * spaceBetweenBarsPx) +
              'px',
          }}
        ></div>
      ))}
    </div>
  );
}
// TODO [P. Labus] clicking on number when paused doesnt highlight
// TODO [P. Labus] styles here should be classes
export default WeaveForms;
