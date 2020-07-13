import React from 'react';
import './TranscriptBlock.scss';
import { WordTiming } from './interfaces';
import { getMinutesFormatted } from '../TimeProgress/time.utils';

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
    <div className="flex p-5 transcript-block">
      <div className="font-semibold pr-3" style={{ color, borderRight: `2px solid ${color}` }}>
        {getMinutesFormatted(wordTimings[0].startTimeMs)}
      </div>
      <div className="pl-3" style={{ maxWidth: '650px' }}>
        {wordTimings.map(({ word, startTimeMs, endTimeMs }) => (
          <React.Fragment key={startTimeMs + ' ' + endTimeMs}>
            <span
              onClick={() => seekAudioTime(startTimeMs)}
              className={shouldHighlight(startTimeMs, endTimeMs) ? 'highlight' : ''}
            >
              {word + ' '}
            </span>
            &#32;
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default TranscriptBlock;
