import React, { CSSProperties } from 'react';

export const baseTimelineStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
};

export const TIMELINE_COLOR_PRIMARY = '#DFE2E5';
export const TIMELINE_COLOR_SECONDARY = '#7E8FA5';

export function TimelineBase({ cssProps = {} }: { cssProps?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: TIMELINE_COLOR_PRIMARY,
        height: '1px',
        width: '100%',
        left: 0,
        ...cssProps,
      }}
    ></div>
  );
}

export default TimelineBase;
