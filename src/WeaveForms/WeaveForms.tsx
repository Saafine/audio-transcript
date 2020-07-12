import React, { useEffect, useState } from 'react';
import { WordTiming } from '../core';
import WeaveProgress from './WeaveProgress';
import {
  AUDIO_TRANSCRIBE_COLOR_PRIMARY,
  AUDIO_TRANSCRIBE_COLOR_SECONDARY,
  WEAVE_BAR_CONTAINER_WIDTH_PX,
  WEAVE_BAR_HEIGHT_PX,
  WEAVE_BAR_SPACE_BETWEEN_PX,
  WEAVE_BAR_WIDTH_PX,
} from '../App.theme';

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
          width: '2px',
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
          width: '2px',
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
  seek,
}: {
  wordTimingsOfPersonA: WordTiming[];
  wordTimingsOfPersonB: WordTiming[];
  currentTimeMs: number;
  durationMs: number;
  seek: (timeMs: number) => void;
}) {
  const weaveBarCount = Math.floor(
    WEAVE_BAR_CONTAINER_WIDTH_PX /
      (WEAVE_BAR_WIDTH_PX + 2 * WEAVE_BAR_SPACE_BETWEEN_PX),
  );
  const weaveDuration = Math.floor(durationMs / weaveBarCount);
  const progressPositionPx =
    (currentTimeMs / durationMs) * WEAVE_BAR_CONTAINER_WIDTH_PX || 0;

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

  const seekOnWeaveForm = (event: any) => {
    const start = event.currentTarget.getBoundingClientRect().x;
    const clicked = event.clientX;
    const diff =
      ((clicked - start) / WEAVE_BAR_CONTAINER_WIDTH_PX) * durationMs;
    seek(diff);
  };

  return (
    <div className={'flex p-2'} style={{ background: '#FAFBFC' }}>
      <div className={'relative'}>
        <div
          className={'flex items-center my-2'}
          style={{
            color: AUDIO_TRANSCRIBE_COLOR_PRIMARY,
            height: WEAVE_BAR_HEIGHT_PX,
          }}
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
          style={{
            color: AUDIO_TRANSCRIBE_COLOR_SECONDARY,
            height: WEAVE_BAR_HEIGHT_PX,
          }}
        >
          46 % MICHAEL B.
        </div>
      </div>

      <div className={'relative'} onClick={seekOnWeaveForm}>
        <WeaveProgress progressPosition={progressPositionPx} />
        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={WEAVE_BAR_CONTAINER_WIDTH_PX}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          progressPositionPx={progressPositionPx}
          barColor={AUDIO_TRANSCRIBE_COLOR_PRIMARY}
          noiseMarkers={noiseMarkersForPersonA}
        />

        <Timeline
          progressPosition={progressPositionPx}
          containerWidthPx={WEAVE_BAR_CONTAINER_WIDTH_PX}
        />

        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={WEAVE_BAR_CONTAINER_WIDTH_PX}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          progressPositionPx={progressPositionPx}
          barColor={AUDIO_TRANSCRIBE_COLOR_SECONDARY}
          noiseMarkers={noiseMarkersForPersonB}
        />
      </div>
    </div>
  );
}

// TODO [P. Labus] clicking on number when paused doesnt highlight
// TODO [P. Labus] styles here should be classes
export default WeaveForms;
