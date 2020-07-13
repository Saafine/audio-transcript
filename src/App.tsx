import React, { useCallback, useReducer } from 'react';
import WeaveForms from './WeaveForms/WeaveForms';
import ControlBar from './ControlBar/ControlBar';
import Transcript from './Transcript/Transcript';
import { useAudio } from './useAudio';
import { useTranscript } from './useTranscript';

export const AUDIO_PLAYER_ACTIONS_UPDATE_DURATIONS_MS = 'updateDurationMs';
export const AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS = 'updateCurrentTimeMs';
export const AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED = 'updatePaused';

// TODO [P. Labus] classnames refactor

// TODO [P. Labus] move this
interface AudioPlayerState {
  durationMs: number;
  currentTimeMs: number;
  paused: boolean;
}

export type AudioAction =
  | {
      type: typeof AUDIO_PLAYER_ACTIONS_UPDATE_DURATIONS_MS;
      payload: number;
    }
  | {
      type: typeof AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS;
      payload: number;
    }
  | {
      type: typeof AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED;
      payload: boolean;
    };

function reducer(state: AudioPlayerState, action: AudioAction) {
  switch (action.type) {
    case AUDIO_PLAYER_ACTIONS_UPDATE_DURATIONS_MS:
      return { ...state, durationMs: action.payload };
    case AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS:
      return { ...state, currentTimeMs: action.payload };
    case AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED:
      return { ...state, paused: action.payload };
    default:
      throw new Error();
  }
}

// TODO [P. Labus]  Move logic and refactor into a AudioPlayer Component
function App() {
  const [state, dispatch] = useReducer(reducer, {
    paused: true,
    durationMs: 0,
    currentTimeMs: 0,
  });

  // TODO [P. Labus] smooth animation
  const [transcript, callerWordTimings] = useTranscript();
  const audioInstance = useAudio(new Audio('./59e106639d79684277df770d.wav'), dispatch);

  const pause = useCallback(() => {
    audioInstance.pause();
    dispatch({ type: AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED, payload: true });
  }, [audioInstance]);

  const play = useCallback(() => {
    audioInstance.play();
    dispatch({ type: AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED, payload: false });
  }, [audioInstance]);

  const seek = useCallback(
    (timeMs: number) => {
      const time = timeMs / 1000;
      audioInstance.currentTime = time;
      dispatch({
        type: AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS,
        payload: time,
      });
    },
    [audioInstance],
  );

  const forward = useCallback(() => {
    const forwardTimeInSeconds = 10 * 1000;
    const next = state.currentTimeMs + forwardTimeInSeconds;
    const timeMs = next > state.durationMs ? state.durationMs : next;
    seek(timeMs);
  }, [seek, state]);

  const rewind = useCallback(() => {
    const rewindTimeInMs = 10 * 1000;
    const previous = state.currentTimeMs - rewindTimeInMs;
    const timeMs = previous < 0 ? 0 : previous;
    seek(timeMs);
  }, [seek, state]);

  return (
    <>
      <ControlBar
        paused={state.paused}
        play={play}
        forward={forward}
        rewind={rewind}
        pause={pause}
      />
      <WeaveForms
        seek={seek}
        wordTimingsOfPersonA={callerWordTimings.callerA}
        wordTimingsOfPersonB={callerWordTimings.callerB}
        currentTimeMs={state.currentTimeMs}
        durationMs={state.durationMs}
      />
      <Transcript
        transcript={transcript}
        seekAudioTime={seek}
        currentTimeMs={state.currentTimeMs}
      />
    </>
  );
}

export default App;
