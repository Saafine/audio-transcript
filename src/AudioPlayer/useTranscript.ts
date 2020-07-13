import { useEffect, useState } from 'react';
import { getTranscript, getWordTimingsForEachCaller } from '../Transcript/transcript-utils';
import { TranscriptModel, WordTimingsForCaller } from '../Transcript/interfaces';

export function useTranscript(): [TranscriptModel, WordTimingsForCaller] {
  const [transcript, setTranscript] = useState<TranscriptModel>({
    wordTimings: [],
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