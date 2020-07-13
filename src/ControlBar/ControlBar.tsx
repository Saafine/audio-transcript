import React from 'react';
import './ControlBar.scss';
import { ReactComponent as Rewind } from './rewind.svg';
import { ReactComponent as FastForward } from './fastforward.svg';
import { ReactComponent as Pause } from './pause.svg';
import { ReactComponent as Play } from './play.svg';
import { Dropdown } from '../Dropdown/Dropdown';

interface ControlBarProps {
  play: () => Promise<void> | void;
  pause: () => void;
  forward: () => void;
  rewind: () => void;
  setSpeed: (speed: string) => void;
  paused: boolean;
  speed: string;
}

export const speedOptions = ['0.5x', '1.0x', '1.5x', '2.0x', '2.5x', '3.0x'];

export function ControlBar({
  play,
  pause,
  paused,
  rewind,
  forward,
  setSpeed,
  speed,
}: ControlBarProps) {
  return (
    <nav className="control-bar flex items-center justify-between px-5">
      <div className="flex items-center">
        <Rewind onClick={rewind} className="mr-4 cursor-pointer select-none" />
        {paused ? <Play onClick={play} className="mr-4 cursor-pointer select-none" /> : null}
        {!paused ? <Pause onClick={pause} className="mr-4 cursor-pointer select-none" /> : null}
        <FastForward onClick={forward} className="mr-4 cursor-pointer select-none" />
        <Dropdown value={speed} options={speedOptions} onOptionSelected={setSpeed} />
      </div>
      <button className="btn btn-share cursor-pointer select-none">Share</button>
    </nav>
  );
}

export default ControlBar;
