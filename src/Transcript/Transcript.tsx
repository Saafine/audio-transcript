import React from 'react';
import './Transcript.scss';
import TranscriptBlock from './TranscriptBlock';
import { TranscriptModel } from '../core';
import {
  AUDIO_TRANSCRIBE_COLOR_PRIMARY,
  AUDIO_TRANSCRIBE_COLOR_SECONDARY,
} from '../App.theme';

function Transcript({
  transcript,
  currentTimeMs,
  seekAudioTime,
}: {
  transcript: TranscriptModel;
  currentTimeMs: number;
  seekAudioTime: (timeMs: number) => void;
}) {
  return (
    <>
      {transcript.wordTimings.map((wordTimings, index) => (
        <div className={'transcript-block'} key={index}>
          <TranscriptBlock
            color={
              index & 1
                ? AUDIO_TRANSCRIBE_COLOR_PRIMARY
                : AUDIO_TRANSCRIBE_COLOR_SECONDARY
            }
            seekAudioTime={seekAudioTime}
            wordTimings={wordTimings}
            currentTimeMs={currentTimeMs}
          />
        </div>
      ))}
    </>
  );
}

export default Transcript;
