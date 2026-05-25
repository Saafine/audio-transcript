import React, { useCallback, useMemo } from 'react';
import {
  AUDIO_TRANSCRIBE_COLOR_PRIMARY,
  AUDIO_TRANSCRIBE_COLOR_SECONDARY,
  WEAVE_BAR_HEIGHT_PX,
  WEAVE_BAR_SPACE_BETWEEN_PX,
  WEAVE_BAR_WIDTH_PX,
} from '../App.theme';
import { WordTiming } from '../Transcript/interfaces';
import { getNoiseMarkers } from './noise-marking-utils';
import VoiceOwner from './VoiceOwner';
import TimelineBase from './TimelineBase';
import WeaveProgress from './WeaveProgress';
import WeaveBars from './WeaveBars';
import Timeline from './Timeline';
import useResizeObserver from 'use-resize-observer';
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
  const { ref, width: containerWidthPx = 0 } = useResizeObserver<HTMLDivElement>();

  // Everything below is derived purely from props — compute during render so a
  // changing currentTimeMs doesn't trigger a second render via effect + dispatch.
  const weaveBar = useMemo(() => {
    const count = Math.floor(containerWidthPx / (WEAVE_BAR_WIDTH_PX + 2 * WEAVE_BAR_SPACE_BETWEEN_PX));
    return {
      count,
      durationMs: count > 0 ? Math.floor(durationMs / count) : 0,
    };
  }, [durationMs, containerWidthPx]);

  const progressPositionPx = durationMs > 0 ? (currentTimeMs / durationMs) * containerWidthPx : 0;

  const timeSpentTalking = useMemo(
    () => ({
      callerA: getTimeSpentTalkingPercentage(wordTimingsOfPersonA, durationMs),
      callerB: getTimeSpentTalkingPercentage(wordTimingsOfPersonB, durationMs),
    }),
    [durationMs, wordTimingsOfPersonA, wordTimingsOfPersonB],
  );

  const noiseMarkers = useMemo(
    () => ({
      callerA: getNoiseMarkers(wordTimingsOfPersonA, weaveBar.durationMs),
      callerB: getNoiseMarkers(wordTimingsOfPersonB, weaveBar.durationMs),
    }),
    [wordTimingsOfPersonA, wordTimingsOfPersonB, weaveBar.durationMs],
  );

  const seekOnWeaveForm = useCallback(
    (event: React.MouseEvent) => {
      const start = event.currentTarget.getBoundingClientRect().x;
      const clicked = event.clientX;
      const diff = ((clicked - start) / containerWidthPx) * durationMs;
      seek(diff);
    },
    [durationMs, seek, containerWidthPx],
  );

  return (
    <div
      className="flex"
      style={{ background: '#FAFBFC', padding: '20px 20px', borderBottom: '1px solid #DFE2E5' }}
    >
      <div className="relative">
        <VoiceOwner color={AUDIO_TRANSCRIBE_COLOR_SECONDARY}>
          <div style={{ width: '35px' }}>{timeSpentTalking.callerA}%</div> Brian Isaacson
        </VoiceOwner>
        <TimelineBase />
        <VoiceOwner color={AUDIO_TRANSCRIBE_COLOR_PRIMARY}>
          <div style={{ width: '35px' }}>{timeSpentTalking.callerB}%</div> YOU
        </VoiceOwner>
      </div>

      <div className="relative" style={{ width: '100%' }} onClick={seekOnWeaveForm} ref={ref}>
        <WeaveProgress progressPosition={progressPositionPx} />
        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={containerWidthPx}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          progressPositionPx={progressPositionPx}
          barColor={AUDIO_TRANSCRIBE_COLOR_SECONDARY}
          noiseMarkers={noiseMarkers.callerA}
        />

        <Timeline progressPosition={progressPositionPx} containerWidthPx={containerWidthPx} />

        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={containerWidthPx}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          barColor={AUDIO_TRANSCRIBE_COLOR_PRIMARY}
          progressPositionPx={progressPositionPx}
          noiseMarkers={noiseMarkers.callerB}
        />
      </div>
    </div>
  );
}

export default WeaveForms;
