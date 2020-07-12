import React from 'react';
import './ControlBar.scss';
import { ReactComponent as Rewind } from './rewind.svg';
import { ReactComponent as FastForward } from './fastforward.svg';
import { ReactComponent as Pause } from './pause.svg';
import { ReactComponent as Play } from './play.svg';

interface ControlBarProps {
  play: () => Promise<void> | void;
  pause: () => void;
  audioState: any; // TODO [P. Labus] type?
}

function ControlBar({ play, pause, audioState }: ControlBarProps) {
  return (
    <nav className={'flex items-center justify-between py-3 px-5'}>
      <div className={'flex items-center'}>
        <Rewind />
        {audioState.paused ? <Play onClick={play} /> : null}
        {!audioState.paused ? <Pause onClick={pause} /> : null}
        <FastForward />
        <button className={'btn btn-secondary'}>1.0x</button>
      </div>
      <button className={'btn btn-share'}>Share</button>
    </nav>
  );
}

export default ControlBar;
