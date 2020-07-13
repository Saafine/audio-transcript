import {
  AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS,
  AUDIO_PLAYER_ACTIONS_UPDATE_DURATIONS_MS,
  AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED,
  AudioAction,
} from './audio-player.actions';


interface AudioPlayerState {
    durationMs: number;
    currentTimeMs: number;
    paused: boolean;
}

export function audioPlayerReducer(state: AudioPlayerState, action: AudioAction) {
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
