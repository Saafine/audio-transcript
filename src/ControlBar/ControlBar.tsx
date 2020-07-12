import React from 'react';
import './ControlBar.scss';
import { ReactComponent as Rewind } from './rewind.svg';
import { ReactComponent as FastForward } from './fastforward.svg';
import { ReactComponent as Pause } from './pause.svg';
import { ReactComponent as Play } from './play.svg';

interface ControlBarProps {
  play: () => Promise<void> | void;
  pause: () => void;
  forward: () => void;
  rewind: () => void;
  paused: boolean;
}

function ControlBar({ play, pause, paused, rewind, forward }: ControlBarProps) {
  return (
    <nav className={'flex items-center justify-between py-3 px-5'}>
      <div className={'flex items-center'}>
        <Rewind onClick={rewind} className={'mr-4 cursor-pointer select-none'}/>
        {paused ? <Play onClick={play} className={'mr-4 cursor-pointer select-none'} /> : null}
        {!paused ? <Pause onClick={pause} className={'mr-4 cursor-pointer select-none'} /> : null}
        <FastForward onClick={forward} className={'mr-4 cursor-pointer select-none'}/>
        <button className={'btn btn-secondary cursor-pointer select-none'}>1.0x</button>
      </div>
      <button className={'btn btn-share cursor-pointer select-none'}>Share</button>
    </nav>
  );
}

export default ControlBar;
