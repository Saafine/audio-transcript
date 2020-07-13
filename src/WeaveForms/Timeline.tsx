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
        styles={{
          height: '10px',
          width: '2px',
        }}
      />

      <TimelineBlock
        styles={{
          height: '10px',
          width: '2px',
        }}
      />

      <TimelineBlock
        styles={{
          height: '2px',
          background: TIMELINE_COLOR_SECONDARY,
          width: progressPosition + 'px',
        }}
      />

      <TimelineBlock
        styles={{
          width: containerWidthPx - progressPosition + 'px',
          left: progressPosition + 'px',
        }}
      />

      <TimelineBlock
        styles={{
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
