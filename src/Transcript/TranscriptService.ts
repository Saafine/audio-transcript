import { TranscriptJSON, TranscriptModel } from '../core';
import TRANSCRIPT_JSON from './transcript.json';

export function getTranscript(
  transcriptJSON = TRANSCRIPT_JSON,
): TranscriptModel {
  return mapTranscriptJsonToModel(transcriptJSON);
}

function mapTranscriptJsonToModel(
  transcriptJSON: TranscriptJSON,
): TranscriptModel {
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
