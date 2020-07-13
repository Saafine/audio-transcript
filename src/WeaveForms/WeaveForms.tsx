import React, { useCallback, useEffect, useState } from 'react';
import WeaveProgress from './WeaveProgress';
import {
  AUDIO_TRANSCRIBE_COLOR_PRIMARY,
  AUDIO_TRANSCRIBE_COLOR_SECONDARY,
  WEAVE_BAR_CONTAINER_WIDTH_PX,
  WEAVE_BAR_HEIGHT_PX,
  WEAVE_BAR_SPACE_BETWEEN_PX,
  WEAVE_BAR_WIDTH_PX,
} from '../App.theme';
import TimelineBase from './TimelineBase';
import Timeline from './Timeline';
import WeaveBars from './WeaveBars';
import VoiceOwner from './VoiceOwner';
import { getNoiseMarkers } from './noise-marking-utils';
import { WordTiming } from '../Transcript/interfaces';

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
    WEAVE_BAR_CONTAINER_WIDTH_PX / (WEAVE_BAR_WIDTH_PX + 2 * WEAVE_BAR_SPACE_BETWEEN_PX),
  );
  const weaveDuration = Math.floor(durationMs / weaveBarCount);
  const progressPositionPx = (currentTimeMs / durationMs) * WEAVE_BAR_CONTAINER_WIDTH_PX;

  const [noiseMarkersForCallerA, setNoiseMarkersForPersonA] = useState<number[]>([]);
  const [noiseMarkersForPersonB, setNoiseMarkersForPersonB] = useState<number[]>([]);

  useEffect(() => {
    setNoiseMarkersForPersonA(getNoiseMarkers(wordTimingsOfPersonA, weaveDuration));
    setNoiseMarkersForPersonB(getNoiseMarkers(wordTimingsOfPersonB, weaveDuration));
  }, [wordTimingsOfPersonA, wordTimingsOfPersonB, weaveDuration]);

  const seekOnWeaveForm = useCallback(
    (event: React.MouseEvent) => {
      const start = event.currentTarget.getBoundingClientRect().x;
      const clicked = event.clientX;
      const diff = ((clicked - start) / WEAVE_BAR_CONTAINER_WIDTH_PX) * durationMs;
      seek(diff);
    },
    [durationMs, seek],
  );

  return (
    <div className="flex" style={{ background: '#FAFBFC' }}>
      <div className="relative">
        <VoiceOwner color={AUDIO_TRANSCRIBE_COLOR_SECONDARY}>Brian Isaacson</VoiceOwner>
        <TimelineBase />
        <VoiceOwner color={AUDIO_TRANSCRIBE_COLOR_PRIMARY}>YOU</VoiceOwner>
      </div>

      <div className="relative" onClick={seekOnWeaveForm}>
        <WeaveProgress progressPosition={progressPositionPx} />
        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={WEAVE_BAR_CONTAINER_WIDTH_PX}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          progressPositionPx={progressPositionPx}
          barColor={AUDIO_TRANSCRIBE_COLOR_SECONDARY}
          noiseMarkers={noiseMarkersForCallerA}
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
          barColor={AUDIO_TRANSCRIBE_COLOR_PRIMARY}
          progressPositionPx={progressPositionPx}
          noiseMarkers={noiseMarkersForPersonB}
        />
      </div>
    </div>
  );
}

export default WeaveForms;
