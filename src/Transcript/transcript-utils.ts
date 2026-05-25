import TRANSCRIPT_JSON from './transcript.json';
import { IdentifiedWordTiming, TranscriptJSON, TranscriptModel, WordTiming } from './interfaces';
import { WordTimingsForCaller } from '../AudioPlayer/useTranscript';

export function getTranscript(transcriptJSON = TRANSCRIPT_JSON): TranscriptModel {
  return mapTranscriptJsonToModel(transcriptJSON);
}

function mapTranscriptJsonToModel(transcriptJSON: TranscriptJSON): TranscriptModel {
  return {
    transcriptText: transcriptJSON.transcript_text,
    callerTimings: transcriptJSON.word_timings.map((wordTimings, index) => {
      return {
        timings: wordTimings.map(({ word, endTime, startTime }) => ({
          word: word,
          startTimeMs: getTimeInMs(startTime),
          endTimeMs: getTimeInMs(endTime),
        })),
        callerId: index % 2,
      };
    }),
  };
}

export function isCallerA(callerId: number): boolean {
  return !(callerId % 2);
}

export function isCallerB(callerId: number): boolean {
  return Boolean(callerId % 2);
}

function getMillisecondsFromText(fraction: string): number {
  // Interpret the digits after the decimal point positionally (tenths,
  // hundredths, thousandths) rather than by numeric value, so leading zeros
  // are preserved: ".5" -> 500ms, ".05" -> 50ms, ".005" -> 5ms.
  return Number((fraction + '000').slice(0, 3));
}

function getTimeInMs(time: string): number {
  const seconds = Number(time.replace(/(\.\d+)?s/, ''));
  const msMatch = time.match(/(?<=\.)\d+/);
  const milliseconds = msMatch ? getMillisecondsFromText(msMatch[0]) : 0;
  return seconds * 1000 + milliseconds;
}

export function getWordTimingsForEachCaller(transcript: TranscriptModel): WordTimingsForCaller {
  return {
    callerA: transcript.callerTimings
      .filter(({ callerId }) => isCallerA(callerId))
      .map(({ timings }) => timings)
      .flat(),
    callerB: transcript.callerTimings
      .filter(({ callerId }) => isCallerB(callerId))
      .map(({ timings }) => timings)
      .flat(),
  };
}

export function getWordKey({ startTimeMs, endTimeMs }: WordTiming): string {
  return startTimeMs + ' ' + endTimeMs;
}

export interface ActiveWord {
  block: IdentifiedWordTiming | null;
  wordKey: string | null;
}

// Find the single word being spoken at currentTimeMs. Computing this once (rather
// than re-checking inside every block on every tick) lets blocks be memoized so
// only the block containing the active word re-renders, and only on word changes.
export function findActiveWord(
  callerTimings: IdentifiedWordTiming[],
  currentTimeMs: number,
): ActiveWord {
  for (const block of callerTimings) {
    for (const timing of block.timings) {
      if (timing.startTimeMs <= currentTimeMs && currentTimeMs < timing.endTimeMs) {
        return { block, wordKey: getWordKey(timing) };
      }
    }
  }
  return { block: null, wordKey: null };
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
