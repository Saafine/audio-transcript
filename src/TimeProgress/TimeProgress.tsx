import React from 'react';
import { getMinutesFormatted } from './time.utils';
import './TimeProgress.scss';

export function TimeProgress({
  currentTimeMs,
  durationMs,
}: {
  currentTimeMs: number;
  durationMs: number;
}) {
  return (
    <div
      className="time-progress inline-flex px-2 bg-gray-200 text-xs rounded font-bold"
      style={{ height: '20px' }}
    >
      <div>{getMinutesFormatted(currentTimeMs)}</div>
      &nbsp;/&nbsp;
      <div className="text-gray-500">{getMinutesFormatted(durationMs)}</div>
    </div>
  );
}

export default TimeProgress;
