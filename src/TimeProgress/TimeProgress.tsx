import React from 'react';
import { getMinutesFormatted } from './time.utils';

export function TimeProgress({
  currentTimeMs,
  durationMs,
}: {
  currentTimeMs: number;
  durationMs: number;
}) {
  return (
    <div className="inline-flex p-1 bg-gray-200 text-xs rounded m-4 font-bold">
      <div>{getMinutesFormatted(currentTimeMs)}</div>
      &nbsp;/&nbsp;
      <div className="text-gray-500">{getMinutesFormatted(durationMs)}</div>
    </div>
  );
}

export default TimeProgress;
