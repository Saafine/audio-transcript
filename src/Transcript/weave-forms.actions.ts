export const WEAVE_FORM_ACTIONS_UPDATE_WEAVE_BAR = 'updateWeaveBar';
export const WEAVE_FORM_ACTIONS_UPDATE_PROGRESS_POSITION_PX = 'updateProgressPositionPx';
export const WEAVE_FORM_ACTIONS_UPDATE_NOISE_MARKERS = 'updateNoiseMarkers';
export const WEAVE_FORM_ACTIONS_UPDATE_TIME_SPENT_TALKING = 'updateTimeSpentTalking';

export type WeaveFormAction =
  | {
      type: typeof WEAVE_FORM_ACTIONS_UPDATE_PROGRESS_POSITION_PX;
      payload: number;
    }
  | {
      type: typeof WEAVE_FORM_ACTIONS_UPDATE_WEAVE_BAR;
      payload: {
        count: number;
        durationMs: number;
      };
    }
  | {
      type: typeof WEAVE_FORM_ACTIONS_UPDATE_NOISE_MARKERS;
      payload: {
        callerA: number[];
        callerB: number[];
      };
    }
  | {
      type: typeof WEAVE_FORM_ACTIONS_UPDATE_TIME_SPENT_TALKING;
      payload: {
        callerA: number;
        callerB: number;
      };
    };
