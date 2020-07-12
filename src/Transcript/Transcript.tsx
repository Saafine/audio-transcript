import React from 'react';
import './Transcript.scss';
import TranscriptBlock from './TranscriptBlock';
import { TranscriptModel } from '../core';

function Transcript({
  transcript,
  currentTimeMs,
  seekAudioTime,
}: {
  transcript: TranscriptModel;
  currentTimeMs: number;
  seekAudioTime: any; // TODO [P. Labus] type?
}) {
  return (
    <>
      {transcript.wordTimings.map((wordTimings, index) => (
        <TranscriptBlock
          seekAudioTime={seekAudioTime}
          key={index}
          wordTimings={wordTimings}
          currentTimeMs={currentTimeMs}
        />
      ))}
    </>
  );
}

export default Transcript;
