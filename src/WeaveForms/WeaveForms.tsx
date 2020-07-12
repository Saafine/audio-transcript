import React, { useEffect, useState } from 'react';
import { WordTiming } from '../core';
import WeaveProgress from './WeaveProgress';

type NoiseMarker = Record<string, true>;

// TODO [P. Labus] move this to app ?
export function getNoiseMarkerForTiming(
  { startTimeMs, endTimeMs }: WordTiming,
  weaveDuration: number,
): NoiseMarker {
  const noiseMarkers: NoiseMarker = {};

  let barIndex = Math.floor(startTimeMs / weaveDuration);
  const endBarIndex = Math.floor(endTimeMs / weaveDuration);

  while (barIndex <= endBarIndex) {
    noiseMarkers[barIndex] = true;
    barIndex++;
  }

  return noiseMarkers;
}

function getNoiseMarkers(
  wordTimings: WordTiming[],
  weaveDuration: number,
): number[] {
  if (!weaveDuration || !wordTimings) return [];

  const noiseMarkers = wordTimings.reduce((noiseMarkers, wordTiming) => {
    return {
      ...noiseMarkers,
      ...getNoiseMarkerForTiming(wordTiming, weaveDuration),
    };
  }, {});

  return Object.keys(noiseMarkers).map(Number);
}

function WeaveBar({
  weaveBarHeightPx,
  weaveBarWidthPx,
  weaveBarIndex,
  spaceBetweenBarsPx,
  progressPositionPx,
  barColor,
}: {
  weaveBarHeightPx: number;
  weaveBarWidthPx: number;
  spaceBetweenBarsPx: number;
  progressPositionPx: number;
  weaveBarIndex: number;
  barColor: string;
}) {
  const barPosition =
    Number(weaveBarIndex) * (weaveBarWidthPx + 2 * spaceBetweenBarsPx);

  return (
    <div
      style={{
        height: weaveBarHeightPx,
        width: weaveBarWidthPx,
        background: progressPositionPx >= barPosition ? '#B7C0CE' : barColor,
        position: 'absolute',
        left: barPosition + 'px',
      }}
    ></div>
  );
}

function WeaveBars({
  weaveBarHeightPx,
  noiseMarkers,
  weaveBarWidthPx,
  containerWidthPx,
  spaceBetweenBarsPx,
  progressPositionPx,
  barColor,
}: {
  weaveBarHeightPx: number;
  weaveBarWidthPx: number;
  containerWidthPx: number;
  spaceBetweenBarsPx: number;
  progressPositionPx: number;
  barColor: string;
  noiseMarkers: number[];
}) {
  return (
    <div
      className={'relative my-2'}
      style={{
        width: containerWidthPx,
        height: weaveBarHeightPx,
      }}
    >
      {noiseMarkers.map((weaveBarIndex, index) => (
        <WeaveBar
          key={index}
          progressPositionPx={progressPositionPx}
          spaceBetweenBarsPx={spaceBetweenBarsPx}
          weaveBarIndex={weaveBarIndex}
          weaveBarHeightPx={weaveBarHeightPx}
          weaveBarWidthPx={weaveBarWidthPx}
          barColor={barColor}
        />
      ))}
    </div>
  );
}

function Timeline({
  progressPosition,
  containerWidthPx,
}: {
  progressPosition: number;
  containerWidthPx: number;
}) {
  return (
    <>
      <div
        style={{
          height: '10px',
          width: '1px',
          left: 0,
          top: '50%',
          position: 'absolute',
          transform: 'translateY(-50%)',
          background: '#DFE2E5',
        }}
      ></div>
      <div
        style={{
          background: '#7E8FA5',
          width: progressPosition + 'px',
          height: '1px',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      ></div>
      <div
        style={{
          background: '#DFE2E5',
          width: containerWidthPx - progressPosition + 'px',
          height: '1px',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: progressPosition + 'px',
        }}
      ></div>
      <div
        style={{
          height: '10px',
          width: '1px',
          right: 0,
          top: '50%',
          position: 'absolute',
          transform: 'translateY(-50%)',
          background: '#DFE2E5',
        }}
      ></div>
    </>
  );
}

function WeaveForms({
  wordTimingsOfPersonA = [],
  wordTimingsOfPersonB = [],
  durationMs,
  currentTimeMs,
}: {
  wordTimingsOfPersonA: WordTiming[];
  wordTimingsOfPersonB: WordTiming[];
  currentTimeMs: number;
  durationMs: number;
}) {
  // UI Options
  const containerWidthPx = 900;
  const weaveBarHeightPx = 40;
  const weaveBarWidthPx = 2;
  const spaceBetweenBarsPx = 1;
  const personAColor = '#8868E9';
  const personBColor = '#4CA3F0';

  // Calculated values
  const weaveBarCount = Math.floor(
    containerWidthPx / (weaveBarWidthPx + 2 * spaceBetweenBarsPx),
  );
  const weaveDuration = Math.floor(durationMs / weaveBarCount);
  const progressPosition = (currentTimeMs / durationMs) * containerWidthPx || 0;

  const [noiseMarkersForPersonA, setNoiseMarkersForPersonA] = useState<
    number[]
  >([]);
  const [noiseMarkersForPersonB, setNoiseMarkersForPersonB] = useState<
    number[]
  >([]);

  useEffect(() => {
    setNoiseMarkersForPersonA(
      getNoiseMarkers(wordTimingsOfPersonA, weaveDuration),
    );
    setNoiseMarkersForPersonB(
      getNoiseMarkers(wordTimingsOfPersonB, weaveDuration),
    );
  }, [wordTimingsOfPersonA, wordTimingsOfPersonB, weaveDuration]);

  return (
    <div className={'flex p-2'} style={{ background: '#FAFBFC' }}>
      <div className={'relative'}>
        <div
          className={'flex items-center my-2'}
          style={{ color: personAColor, height: weaveBarHeightPx }}
        >
          54 % YOU
        </div>

        <div
          style={{
            background: '#DFE2E5',
            width: '100%',
            height: '1px',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
          }}
        ></div>

        <div
          className={'flex items-center my-2'}
          style={{ color: personBColor, height: weaveBarHeightPx }}
        >
          46 % MICHAEL B.
        </div>
      </div>

      <div className={'relative'}>
        <WeaveProgress progressPosition={progressPosition} />
        <WeaveBars
          weaveBarHeightPx={weaveBarHeightPx}
          weaveBarWidthPx={weaveBarWidthPx}
          containerWidthPx={containerWidthPx}
          spaceBetweenBarsPx={spaceBetweenBarsPx}
          progressPositionPx={progressPosition}
          barColor={personAColor}
          noiseMarkers={noiseMarkersForPersonA}
        />

        <Timeline
          progressPosition={progressPosition}
          containerWidthPx={containerWidthPx}
        />

        <WeaveBars
          weaveBarHeightPx={weaveBarHeightPx}
          weaveBarWidthPx={weaveBarWidthPx}
          containerWidthPx={containerWidthPx}
          spaceBetweenBarsPx={spaceBetweenBarsPx}
          progressPositionPx={progressPosition}
          barColor={personBColor}
          noiseMarkers={noiseMarkersForPersonB}
        />
      </div>
    </div>
  );
}

// TODO [P. Labus] clicking on number when paused doesnt highlight
// TODO [P. Labus] styles here should be classes
export default WeaveForms;
