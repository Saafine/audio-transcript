import { useMemo } from 'react';
import { getTranscript, getWordTimingsForEachCaller } from '../Transcript/transcript-utils';
import { TranscriptModel, WordTiming } from '../Transcript/interfaces';

export interface WordTimingsForCaller {
  callerA: WordTiming[];
  callerB: WordTiming[];
}

export function useTranscript(): [TranscriptModel, WordTimingsForCaller] {
  // The transcript is a statically-imported JSON asset, so this is a synchronous,
  // pure derivation — compute it during render rather than in an effect.
  const transcript = useMemo(() => getTranscript(), []);
  const wordTimings = useMemo(() => getWordTimingsForEachCaller(transcript), [transcript]);

  return [transcript, wordTimings];
}
