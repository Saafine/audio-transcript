import React, { useCallback, useEffect, useRef, useState } from 'react';
import WeaveProgress from './WeaveProgress';
import {
  AUDIO_TRANSCRIBE_COLOR_PRIMARY,
  AUDIO_TRANSCRIBE_COLOR_SECONDARY,
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
import { getTimeSpentTalkingPercentage } from '../Transcript/transcript-utils';

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
  const buttonRef: any = useRef();
  const weaveBarWidth = buttonRef.current?.offsetWidth;
  const weaveBarCount = Math.floor(
    weaveBarWidth / (WEAVE_BAR_WIDTH_PX + 2 * WEAVE_BAR_SPACE_BETWEEN_PX),
  );
  const weaveDuration = Math.floor(durationMs / weaveBarCount);
  const progressPositionPx = (currentTimeMs / durationMs) * weaveBarWidth;

  const [noiseMarkersForCallerA, setNoiseMarkersForCallerA] = useState<number[]>([]);
  const [noiseMarkersForCallerB, setNoiseMarkersForCallerB] = useState<number[]>([]);
  const [spentTalking, setTimeSpentTalking] = useState<{
    callerA: number;
    callerB: number;
  }>({ callerA: 0, callerB: 0 });

  useEffect(() => {
    setNoiseMarkersForCallerA(getNoiseMarkers(wordTimingsOfPersonA, weaveDuration));
    setNoiseMarkersForCallerB(getNoiseMarkers(wordTimingsOfPersonB, weaveDuration));
  }, [wordTimingsOfPersonA, wordTimingsOfPersonB, weaveDuration]);

  useEffect(() => {
    setTimeSpentTalking({
      callerA: getTimeSpentTalkingPercentage(wordTimingsOfPersonA, durationMs),
      callerB: getTimeSpentTalkingPercentage(wordTimingsOfPersonB, durationMs),
    });
  }, [durationMs, wordTimingsOfPersonA, wordTimingsOfPersonB]);

  const seekOnWeaveForm = useCallback(
    (event: React.MouseEvent) => {
      const start = event.currentTarget.getBoundingClientRect().x;
      const clicked = event.clientX;
      const diff = ((clicked - start) / weaveBarWidth) * durationMs;
      seek(diff);
    },
    [durationMs, seek, weaveBarWidth],
  );

  return (
    <div
      className="flex"
      style={{ background: '#FAFBFC', padding: '20px 20px', borderBottom: '1px solid #DFE2E5' }}
    >
      <div className="relative">
        <VoiceOwner color={AUDIO_TRANSCRIBE_COLOR_SECONDARY}>
          <div style={{ width: '35px' }}>{spentTalking.callerA}%</div> Brian Isaacson
        </VoiceOwner>
        <TimelineBase />
        <VoiceOwner color={AUDIO_TRANSCRIBE_COLOR_PRIMARY}>
          <div style={{ width: '35px' }}>{spentTalking.callerB}%</div> YOU
        </VoiceOwner>
      </div>

      <div className="relative" style={{ width: '100%' }} onClick={seekOnWeaveForm} ref={buttonRef}>
        <WeaveProgress progressPosition={progressPositionPx} />
        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={weaveBarWidth}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          progressPositionPx={progressPositionPx}
          barColor={AUDIO_TRANSCRIBE_COLOR_SECONDARY}
          noiseMarkers={noiseMarkersForCallerA}
        />

        <Timeline progressPosition={progressPositionPx} containerWidthPx={weaveBarWidth} />

        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={weaveBarWidth}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          barColor={AUDIO_TRANSCRIBE_COLOR_PRIMARY}
          progressPositionPx={progressPositionPx}
          noiseMarkers={noiseMarkersForCallerB}
        />
      </div>
    </div>
  );
}

export default WeaveForms;
