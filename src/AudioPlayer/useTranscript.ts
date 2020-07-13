import { useEffect, useState } from 'react';
import { getTranscript, getWordTimingsForEachCaller } from '../Transcript/transcript-utils';
import { TranscriptModel, WordTiming } from '../Transcript/interfaces';

export interface WordTimingsForCaller {
  callerA: WordTiming[];
  callerB: WordTiming[];
}

export function useTranscript(): [TranscriptModel, WordTimingsForCaller] {
  const [transcript, setTranscript] = useState<TranscriptModel>({
    callerTimings: [],
    transcriptText: [],
  });

  const [wordTimings, setWordTimings] = useState<WordTimingsForCaller>({
    callerA: [],
    callerB: [],
  });

  useEffect(() => {
    const transcriptModel = getTranscript();
    const { callerA, callerB } = getWordTimingsForEachCaller(transcriptModel);
    setTranscript(transcriptModel);
    setWordTimings({ callerA, callerB });
    // eslint-disable-next-line
  }, []);

  return [transcript, wordTimings];
}
