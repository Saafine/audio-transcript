import React, { useState } from 'react';
import './Transcript.scss';
import TranscriptBlock from './TranscriptBlock';
import { AUDIO_TRANSCRIBE_COLOR_PRIMARY, AUDIO_TRANSCRIBE_COLOR_SECONDARY } from '../App.theme';
import { TranscriptModel, WordTiming } from './interfaces';

function Transcript({
  transcript,
  currentTimeMs,
  seekAudioTime,
}: {
  transcript: TranscriptModel;
  currentTimeMs: number;
  seekAudioTime: (timeMs: number) => void;
}): any {
  const [search, setSearch] = useState('');

  const filterFn = (_: WordTiming[], index: number) => {
    return transcript.transcriptText[index].includes(search);
  };

  return (
    <>
      <input
        type="input"
        className="transcript__search mb-4"
        aria-label="search call transcript"
        placeholder="Search call transcript"
        onChange={(event) => setSearch(event.target.value)}
      />
      {transcript.wordTimings.filter(filterFn).map((wordTimings, index) => (
        <div className="transcript" key={index}>
          <TranscriptBlock
            color={
              index % 2 === 0 ? AUDIO_TRANSCRIBE_COLOR_SECONDARY : AUDIO_TRANSCRIBE_COLOR_PRIMARY
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
