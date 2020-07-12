import React from 'react';
import './Transcript.scss';
import { WordTiming } from '../core';

function TranscriptBlock({
  wordTimings,
  currentTimeMs,
  seekAudioTime,
  color,
}: {
  wordTimings: WordTiming[];
  currentTimeMs: number;
  seekAudioTime: (timeMs: number) => void;
  color: string;
}) {
  const shouldHighlight = (startTimeMs: number, endTimeMs: number): boolean => {
    return startTimeMs <= currentTimeMs && currentTimeMs < endTimeMs;
  };

  return (
    <div className={'flex'}>
      <div
        className={'font-semibold pr-3'}
        style={{ color, borderRight: `1px solid ${color}` }}
      >
        03:25
      </div>
      <div className={'pl-3'} style={{ maxWidth: '450px' }}>
        {wordTimings.map(({ word, startTimeMs, endTimeMs }, index) => (
          <span
            onClick={() => seekAudioTime(startTimeMs)}
            className={
              shouldHighlight(startTimeMs, endTimeMs) ? 'highlight' : undefined
            }
            key={index}
          >
            {word + ' '}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TranscriptBlock;
