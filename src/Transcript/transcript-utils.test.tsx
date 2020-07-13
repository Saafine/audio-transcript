import React from 'react';
import { getTranscript } from './transcript-utils';
import { WordTiming } from './interfaces';

test('maps time from transcript to milliseconds', () => {
  const inputWordTimings = [
    {
      startTime: '2.400s',
      endTime: '2.800s',
      word: 'a',
    },
    {
      startTime: '2.800s',
      endTime: '3s',
      word: 'b',
    },
    {
      startTime: '3s',
      endTime: '3.400s',
      word: 'c',
    },
    {
      startTime: '12.800s',
      endTime: '12.900s',
      word: 'd',
    },
    {
      startTime: '12.0s',
      endTime: '12.800s',
      word: 'e',
    },
    {
      startTime: '3.900s',
      endTime: '4.100s',
      word: 'f',
    },
    {
      startTime: '12.0s',
      endTime: '12.800s',
      word: 'g',
    },
    {
      startTime: '12.800s',
      endTime: '12.9s',
      word: 'h',
    },
  ];

  const outputWordTimings: Array<WordTiming[]> = [
    [
      { startTimeMs: 2400, endTimeMs: 2800, word: 'a' },
      { startTimeMs: 2800, endTimeMs: 3000, word: 'b' },
      { startTimeMs: 3000, endTimeMs: 3400, word: 'c' },
      { startTimeMs: 12800, endTimeMs: 12900, word: 'd' },
      { startTimeMs: 12000, endTimeMs: 12800, word: 'e' },
      { startTimeMs: 3900, endTimeMs: 4100, word: 'f' },
      { startTimeMs: 12_000, endTimeMs: 12_800, word: 'g' },
      { startTimeMs: 12_800, endTimeMs: 12_900, word: 'h' },
    ],
  ];

  const result = getTranscript({
    word_timings: [inputWordTimings],
    transcript_text: [],
  });

  expect(result.callerTimings).toEqual(outputWordTimings);
});
