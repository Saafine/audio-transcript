import TRANSCRIPT_JSON from './transcript.json';
import { TranscriptJSON, TranscriptModel, WordTiming } from './interfaces';
import { WordTimingsForCaller } from '../AudioPlayer/useTranscript';

export function getTranscript(transcriptJSON = TRANSCRIPT_JSON): TranscriptModel {
  return mapTranscriptJsonToModel(transcriptJSON);
}

function mapTranscriptJsonToModel(transcriptJSON: TranscriptJSON): TranscriptModel {
  return {
    // TODO [P. Labus] callersTimings
    wordTimings: transcriptJSON.word_timings.map((wordTimings, index) => {
      return {
        timings: wordTimings.map(({ word, endTime, startTime }) => ({
          word: word,
          startTimeMs: getTimeInMs(startTime),
          endTimeMs: getTimeInMs(endTime),
        })),
        callerId: index % 2,
      };
    }),
    transcriptText: transcriptJSON.transcript_text,
  };
}

export function isCallerA(callerId: number): boolean {
  return Boolean(callerId % 2);
}

export function isCallerB(callerId: number): boolean {
  return !(callerId % 2);
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
  return {
    callerA: transcript.wordTimings
      .filter(({ callerId }) => isCallerA(callerId))
      .map(({ timings }) => timings)
      .flat(),
    callerB: transcript.wordTimings
      .filter(({ callerId }) => isCallerB(callerId))
      .map(({ timings }) => timings)
      .flat(),
  };
}

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
