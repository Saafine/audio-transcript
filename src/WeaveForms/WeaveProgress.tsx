import React from 'react';

function WeaveProgress({
  durationMs,
  currentTimeMs,
}: {
  currentTimeMs: number;
  durationMs: number;
}) {
  const containerWidthPx = 900; // TODO [P. Labus] hardcoed
  const width = (currentTimeMs / durationMs) * containerWidthPx;
  return (
    <div
      style={{
        height: '100%',
        position: 'absolute',
        background: 'gray',
        opacity: 0.5,
        width,
      }}
    ></div>
  );
}

export default WeaveProgress;
