import React from 'react';
import './Transcript.scss';
import TranscriptBlock from './TranscriptBlock';
import { AUDIO_TRANSCRIBE_COLOR_PRIMARY, AUDIO_TRANSCRIBE_COLOR_SECONDARY } from '../App.theme';
import { TranscriptModel } from './interfaces';

function Transcript({
  transcript,
  currentTimeMs,
  seekAudioTime,
}: {
  transcript: TranscriptModel;
  currentTimeMs: number;
  seekAudioTime: (timeMs: number) => void;
}): any {
  return transcript.wordTimings.map((wordTimings, index) => (
    <div className="transcript" key={index}>
      <TranscriptBlock
        color={index % 2 === 0 ? AUDIO_TRANSCRIBE_COLOR_SECONDARY : AUDIO_TRANSCRIBE_COLOR_PRIMARY}
        seekAudioTime={seekAudioTime}
        wordTimings={wordTimings}
        currentTimeMs={currentTimeMs}
      />
    </div>
  ));
}

export default Transcript;
