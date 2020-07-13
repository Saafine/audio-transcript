import React from 'react';

function WeaveBars({
  weaveBarHeightPx,
  noiseMarkers,
  weaveBarWidthPx,
  containerWidthPx,
  spaceBetweenBarsPx,
  progressPositionPx,
  barColor,
}: {
  weaveBarHeightPx: number;
  weaveBarWidthPx: number;
  containerWidthPx: number;
  spaceBetweenBarsPx: number;
  progressPositionPx: number;
  barColor: string;
  noiseMarkers: number[];
}) {
  return (
    <div
      className="relative my-2"
      style={{
        width: containerWidthPx,
        height: weaveBarHeightPx,
      }}
    >
      {noiseMarkers.map((weaveBarIndex) => {
        const barPosition = weaveBarIndex * (weaveBarWidthPx + 2 * spaceBetweenBarsPx);
        return (
          <div
            key={weaveBarIndex}
            style={{
              height: weaveBarHeightPx,
              width: weaveBarWidthPx,
              background: progressPositionPx >= barPosition ? '#B7C0CE' : barColor,
              position: 'absolute',
              left: barPosition + 'px',
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default WeaveBars;
