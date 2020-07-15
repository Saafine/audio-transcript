import { Dispatch, useEffect, useState } from 'react';
import {
  AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS,
  AUDIO_PLAYER_ACTIONS_UPDATE_DURATIONS_MS,
  AudioAction,
} from './audio-player.actions';

export function useAudio(src: HTMLAudioElement, dispatch: Dispatch<AudioAction>) {
  const [audioInstance] = useState(() => {
    return new Audio('./59e106639d79684277df770d.wav');
  });

  useEffect(() => {
    const canPlay = () => {
      dispatch({
        type: AUDIO_PLAYER_ACTIONS_UPDATE_DURATIONS_MS,
        payload: audioInstance.duration * 1000,
      });
    };

    const ended = () => {
      dispatch({
        type: 'updatePaused',
        payload: true,
      });
    };

    const timeupdate = () => {
      dispatch({
        type: AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS,
        payload: audioInstance.currentTime * 1000,
      });
    };

    audioInstance.addEventListener('canplay', canPlay);
    audioInstance.addEventListener('ended', ended);
    audioInstance.addEventListener('timeupdate', timeupdate);

    return () => {
      audioInstance.removeEventListener('canplay', canPlay);
      audioInstance.removeEventListener('ended', ended);
      audioInstance.removeEventListener('timeupdate', timeupdate);
    };
  }, [dispatch, audioInstance]);

  return audioInstance;
}
