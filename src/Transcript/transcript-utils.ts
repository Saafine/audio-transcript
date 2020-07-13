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

function getMillisecondsFromText(ms: string): number {
  let convertedMs = Number(ms);
  if (convertedMs < 10) return convertedMs * 100;
  if (convertedMs < 100) return convertedMs * 10;
  return convertedMs;
}

function getTimeInMs(time: string): number {
  const seconds = Number(time.replace(/(\.\d+)?s/, ''));
  const msMatch = time.match(/(?<=\.)\d+/);
  const milliseconds = msMatch ? getMillisecondsFromText(msMatch[0]) : 0;
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

export function getTimeSpentTalkingPercentage(
  wordTimings: WordTiming[],
  durationMs: number,
): number {
  if (!durationMs) return 0;
  const getCallerTotal = (caller: WordTiming[]) =>
    caller.reduce((total, { startTimeMs, endTimeMs }) => {
      return total + endTimeMs - startTimeMs;
    }, 0);

  return Math.floor((getCallerTotal(wordTimings) / durationMs) * 100);
}
