import React, { useCallback, useEffect, useReducer } from 'react';
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
import { weaveFormReducer } from '../Transcript/weave-forms.reducer';
import {
  WEAVE_FORM_ACTIONS_UPDATE_NOISE_MARKERS,
  WEAVE_FORM_ACTIONS_UPDATE_PROGRESS_POSITION_PX,
  WEAVE_FORM_ACTIONS_UPDATE_TIME_SPENT_TALKING,
  WEAVE_FORM_ACTIONS_UPDATE_WEAVE_BAR,
} from '../Transcript/weave-forms.actions';
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
  const [state, dispatch] = useReducer(weaveFormReducer, {
    progressPositionPx: 0,
    weaveBar: {
      count: 0,
      durationMs: 0,
    },
    timeSpentTalking: {
      callerA: 0,
      callerB: 0,
    },
    noiseMarkers: {
      callerA: [],
      callerB: [],
    },
  });

  useEffect(() => {
    const weaveBarCount = Math.floor(
      containerWidthPx / (WEAVE_BAR_WIDTH_PX + 2 * WEAVE_BAR_SPACE_BETWEEN_PX),
    );
    const weaveBarDurationMs = Math.floor(durationMs / weaveBarCount);

    dispatch({
      type: WEAVE_FORM_ACTIONS_UPDATE_WEAVE_BAR,
      payload: {
        count: weaveBarCount,
        durationMs: weaveBarDurationMs,
      },
    });
  }, [durationMs, containerWidthPx]);

  useEffect(() => {
    dispatch({
      type: WEAVE_FORM_ACTIONS_UPDATE_PROGRESS_POSITION_PX,
      payload: (currentTimeMs / durationMs) * containerWidthPx,
    });
  }, [containerWidthPx, currentTimeMs, durationMs]);

  useEffect(() => {
    dispatch({
      type: WEAVE_FORM_ACTIONS_UPDATE_TIME_SPENT_TALKING,
      payload: {
        callerA: getTimeSpentTalkingPercentage(wordTimingsOfPersonA, durationMs),
        callerB: getTimeSpentTalkingPercentage(wordTimingsOfPersonB, durationMs),
      },
    });
  }, [durationMs, wordTimingsOfPersonA, wordTimingsOfPersonB]);

  useEffect(() => {
    dispatch({
      type: WEAVE_FORM_ACTIONS_UPDATE_NOISE_MARKERS,
      payload: {
        callerA: getNoiseMarkers(wordTimingsOfPersonA, state.weaveBar.durationMs),
        callerB: getNoiseMarkers(wordTimingsOfPersonB, state.weaveBar.durationMs),
      },
    });
  }, [wordTimingsOfPersonA, wordTimingsOfPersonB, state.weaveBar.durationMs]);

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
          <div style={{ width: '35px' }}>{state.timeSpentTalking.callerA}%</div> Brian Isaacson
        </VoiceOwner>
        <TimelineBase />
        <VoiceOwner color={AUDIO_TRANSCRIBE_COLOR_PRIMARY}>
          <div style={{ width: '35px' }}>{state.timeSpentTalking.callerB}%</div> YOU
        </VoiceOwner>
      </div>

      <div className="relative" style={{ width: '100%' }} onClick={seekOnWeaveForm} ref={ref}>
        <WeaveProgress progressPosition={state.progressPositionPx} />
        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={containerWidthPx}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          progressPositionPx={state.progressPositionPx}
          barColor={AUDIO_TRANSCRIBE_COLOR_SECONDARY}
          noiseMarkers={state.noiseMarkers.callerA}
        />

        <Timeline progressPosition={state.progressPositionPx} containerWidthPx={containerWidthPx} />

        <WeaveBars
          weaveBarHeightPx={WEAVE_BAR_HEIGHT_PX}
          weaveBarWidthPx={WEAVE_BAR_WIDTH_PX}
          containerWidthPx={containerWidthPx}
          spaceBetweenBarsPx={WEAVE_BAR_SPACE_BETWEEN_PX}
          barColor={AUDIO_TRANSCRIBE_COLOR_PRIMARY}
          progressPositionPx={state.progressPositionPx}
          noiseMarkers={state.noiseMarkers.callerB}
        />
      </div>
    </div>
  );
}

export default WeaveForms;
