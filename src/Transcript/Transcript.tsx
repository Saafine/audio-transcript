import React, { useState } from 'react';
import './Transcript.scss';
import TranscriptBlock from './TranscriptBlock';
import { AUDIO_TRANSCRIBE_COLOR_PRIMARY, AUDIO_TRANSCRIBE_COLOR_SECONDARY } from '../App.theme';
import { TranscriptModel } from './interfaces';
import { isCallerA } from './transcript-utils';

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

  const filterFn = (_: any, index: number) => {
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
      {transcript.callerTimings.filter(filterFn).map((wordTimings, index) => (
        <div className="transcript" key={index}>
          <TranscriptBlock
            color={
              isCallerA(wordTimings.callerId)
                ? AUDIO_TRANSCRIBE_COLOR_PRIMARY
                : AUDIO_TRANSCRIBE_COLOR_SECONDARY
            }
            seekAudioTime={seekAudioTime}
            wordTimings={wordTimings.timings}
            currentTimeMs={currentTimeMs}
          />
        </div>
      ))}
    </>
  );
}

export default Transcript;
