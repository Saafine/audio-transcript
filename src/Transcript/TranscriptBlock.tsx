import React from 'react';
import './Transcript.scss';
import { WordTiming } from '../core';

function TranscriptBlock({
  wordTimings,
  currentTimeMs,
  seekAudioTime,
}: {
  wordTimings: WordTiming[];
  currentTimeMs: number;
  seekAudioTime: any; // TODO [P. Labus] type?
}) {
  const shouldHighlight = (startTimeMs: number, endTimeMs: number): boolean => {
    return startTimeMs <= currentTimeMs && currentTimeMs < endTimeMs;
  };

  return (
    <div>
      {wordTimings.map(({ word, startTimeMs, endTimeMs }, index) => (
        <span
          onClick={() => seekAudioTime(startTimeMs / 1000)}
          className={
            shouldHighlight(startTimeMs, endTimeMs) ? 'highlight' : undefined
          }
          key={index}
        >
          {word + ' '}
        </span>
      ))}
    </div>
  );
}

export default TranscriptBlock;
