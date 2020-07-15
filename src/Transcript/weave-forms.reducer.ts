import {
    WEAVE_FORM_ACTIONS_UPDATE_NOISE_MARKERS,
    WEAVE_FORM_ACTIONS_UPDATE_PROGRESS_POSITION_PX,
    WEAVE_FORM_ACTIONS_UPDATE_TIME_SPENT_TALKING,
    WEAVE_FORM_ACTIONS_UPDATE_WEAVE_BAR,
    WeaveFormAction
} from './weave-forms.actions';

export interface WeaveFormState {
    progressPositionPx: number;
    weaveBar: {
        count: number;
        durationMs: number;
    };
    noiseMarkers: {
        callerA: number[];
        callerB: number[];
    };
    timeSpentTalking: {
        callerA: number;
        callerB: number;
    };
}

export function weaveFormReducer(state: WeaveFormState, action: WeaveFormAction) {
    switch (action.type) {
        case WEAVE_FORM_ACTIONS_UPDATE_PROGRESS_POSITION_PX:
            return {
                ...state,
                progressPositionPx: action.payload,
            };
        case WEAVE_FORM_ACTIONS_UPDATE_WEAVE_BAR:
            return {
                ...state,
                weaveBar: action.payload,
            };
        case WEAVE_FORM_ACTIONS_UPDATE_NOISE_MARKERS:
            return {
                ...state,
                noiseMarkers: action.payload,
            };
        case WEAVE_FORM_ACTIONS_UPDATE_TIME_SPENT_TALKING:
            return {
                ...state,
                timeSpentTalking: action.payload,
            };
        default:
            throw new Error();
    }
}
