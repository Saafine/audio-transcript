import React, { useCallback, useReducer } from 'react';
import { useTranscript } from './useTranscript';
import { useAudio } from './useAudio';
import ControlBar from '../ControlBar/ControlBar';
import WeaveForms from '../WeaveForms/WeaveForms';
import Transcript from '../Transcript/Transcript';
import { audioPlayerReducer } from './audio-player.reducer';
import {
  AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS,
  AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED,
  AUDIO_PLAYER_ACTIONS_UPDATE_SPEED,
} from './audio-player.actions';
import TimeProgress from '../TimeProgress/TimeProgress';

function AudioPlayer() {
  const [state, dispatch] = useReducer(audioPlayerReducer, {
    paused: true,
    durationMs: 0,
    currentTimeMs: 0,
    speed: '1.0x',
  });

  const [transcript, wordTimings] = useTranscript();
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

  const setSpeed = useCallback(
    (playBackRate: string) => {
      audioInstance.playbackRate = Number(playBackRate.replace('x', ''));
      dispatch({
        type: AUDIO_PLAYER_ACTIONS_UPDATE_SPEED,
        payload: playBackRate,
      });
    },
    [audioInstance],
  );

  return (
    <>
      <ControlBar
        paused={state.paused}
        play={play}
        forward={forward}
        rewind={rewind}
        setSpeed={setSpeed}
        speed={state.speed}
        pause={pause}
      />
      <div style={{ background: 'rgb(250, 251, 252)', paddingTop: '24px', paddingLeft: '24px' }}>
        <TimeProgress currentTimeMs={state.currentTimeMs} durationMs={state.durationMs} />
      </div>
      <WeaveForms
        seek={seek}
        wordTimingsOfPersonA={wordTimings.callerA}
        wordTimingsOfPersonB={wordTimings.callerB}
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

export default AudioPlayer;
