import React from 'react';
import TimelineBlock, { TIMELINE_COLOR_SECONDARY } from './TimelineBase';

function Timeline({
  progressPosition,
  containerWidthPx,
}: {
  progressPosition: number;
  containerWidthPx: number;
}) {
  return (
    <>
      <TimelineBlock
        cssProps={{
          height: '10px',
          width: '2px',
        }}
      />

      <TimelineBlock
        cssProps={{
          height: '10px',
          width: '2px',
        }}
      />

      <TimelineBlock
        cssProps={{
          height: '2px',
          background: TIMELINE_COLOR_SECONDARY,
          width: progressPosition + 'px',
        }}
      />

      <TimelineBlock
        cssProps={{
          width: containerWidthPx - progressPosition + 'px',
          left: progressPosition + 'px',
        }}
      />

      <TimelineBlock
        cssProps={{
          height: '10px',
          width: '2px',
          right: 0,
          left: 'unset',
        }}
      />
    </>
  );
}

export default Timeline;
