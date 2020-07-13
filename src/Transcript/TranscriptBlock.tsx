import React, { useCallback } from 'react';
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
  const shouldHighlight = useCallback(
    (startTimeMs: number, endTimeMs: number): boolean => {
      return startTimeMs <= currentTimeMs && currentTimeMs < endTimeMs;
    },
    [currentTimeMs],
  );

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
              {word}
            </span>
            <span> </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default TranscriptBlock;
