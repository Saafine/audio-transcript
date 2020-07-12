import React from 'react';

function WeaveProgress({ progressPosition }: { progressPosition: number }) {
  return (
    <div
      style={{
        height: '100%',
        position: 'absolute',
        background: 'blue',
        opacity: 0.05,
        width: progressPosition + 'px',
      }}
    ></div>
  );
}

export default WeaveProgress;
