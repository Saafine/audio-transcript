import React, { memo } from 'react';
import './TranscriptBlock.scss';
import { WordTiming } from './interfaces';
import { getMinutesFormatted } from '../TimeProgress/time.utils';
import { getWordKey } from './transcript-utils';

function TranscriptBlock({
  wordTimings,
  activeWordKey,
  seekAudioTime,
  color,
}: {
  wordTimings: WordTiming[];
  activeWordKey: string | null;
  seekAudioTime: (timeMs: number) => void;
  color: string;
}) {
  if (wordTimings.length === 0) return null;

  return (
    <div className="flex p-5 transcript-block">
      <div className="font-semibold pr-3" style={{ color, borderRight: `2px solid ${color}` }}>
        {getMinutesFormatted(wordTimings[0].startTimeMs)}
      </div>
      <div className="pl-3" style={{ maxWidth: '650px' }}>
        {wordTimings.map((timing) => {
          const key = getWordKey(timing);
          return (
            <React.Fragment key={key}>
              <span
                onClick={() => seekAudioTime(timing.startTimeMs)}
                className={key === activeWordKey ? 'highlight' : ''}
              >
                {timing.word}
              </span>
              <span> </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default memo(TranscriptBlock);
