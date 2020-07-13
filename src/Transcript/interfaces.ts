export interface WordTimingJson {
  startTime: string;
  endTime: string;
  word: string;
}

export interface TranscriptJSON {
  transcript_text: string[];
  word_timings: Array<WordTimingJson[]>;
}

export interface WordTiming {
  startTimeMs: number;
  endTimeMs: number;
  word: string;
}

export interface IdentifiedWordTiming {
  callerId: number;
  timings: WordTiming[];
}

export interface TranscriptModel {
  transcriptText: string[];
  callerTimings: IdentifiedWordTiming[];
}
