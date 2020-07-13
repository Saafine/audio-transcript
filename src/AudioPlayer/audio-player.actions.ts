export const AUDIO_PLAYER_ACTIONS_UPDATE_DURATIONS_MS = 'updateDurationMs';
export const AUDIO_PLAYER_ACTIONS_UPDATE_CURRENT_TIME_MS = 'updateCurrentTimeMs';
export const AUDIO_PLAYER_ACTIONS_UPDATE_PAUSED = 'updatePaused';
export const AUDIO_PLAYER_ACTIONS_UPDATE_SPEED = 'updateSpeed';

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
    }
  | {
      type: typeof AUDIO_PLAYER_ACTIONS_UPDATE_SPEED;
      payload: string;
    };
