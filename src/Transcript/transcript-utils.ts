import TRANSCRIPT_JSON from './transcript.json';
import { TranscriptJSON, TranscriptModel, WordTiming, WordTimingsForCaller } from './interfaces';

export function getTranscript(transcriptJSON = TRANSCRIPT_JSON): TranscriptModel {
  return mapTranscriptJsonToModel(transcriptJSON);
}

function mapTranscriptJsonToModel(transcriptJSON: TranscriptJSON): TranscriptModel {
  return {
    wordTimings: transcriptJSON.word_timings.map((wordTimings) => {
      return wordTimings.map(({ word, endTime, startTime }) => ({
        word: word,
        startTimeMs: getTimeInMs(startTime),
        endTimeMs: getTimeInMs(endTime),
      }));
    }),
    transcriptText: transcriptJSON.transcript_text,
  };
}

function getTimeInMs(time: string): number {
  const seconds = Number(time.replace(/(\.\d+)?s/, ''));
  const msMatch = time.match(/(?<=\.)\d+/);
  const milliseconds = msMatch ? Number(msMatch[0]) : 0;
  return seconds * 1000 + milliseconds;
}

export function getWordTimingsForEachCaller(transcript: TranscriptModel): WordTimingsForCaller {
  const callerA = getWordTimings(transcript.wordTimings, (index) => !Boolean(index % 2));
  const callerB = getWordTimings(transcript.wordTimings, (index) => Boolean(index % 2));

  return { callerA, callerB };
}

const getWordTimings: (
  wordTimings: Array<WordTiming[]>,
  filterFn: (index: number) => boolean,
) => WordTiming[] = (wordTimings, filterFn) => {
  return wordTimings.filter((_, idx) => filterFn(idx)).flat();
};
