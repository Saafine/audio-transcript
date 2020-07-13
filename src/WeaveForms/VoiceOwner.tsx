import React from 'react';
import { WEAVE_BAR_HEIGHT_PX } from '../App.theme';

function VoiceOwner({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center my-2 mr-4 font-bold whitespace-no-wrap"
      style={{
        height: WEAVE_BAR_HEIGHT_PX,
        color,
      }}
    >
      {children}
    </div>
  );
}

export default VoiceOwner;
