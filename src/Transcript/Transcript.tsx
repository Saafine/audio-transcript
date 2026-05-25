import React, { useMemo, useState } from 'react';
import './Transcript.scss';
import TranscriptBlock from './TranscriptBlock';
import { AUDIO_TRANSCRIBE_COLOR_PRIMARY, AUDIO_TRANSCRIBE_COLOR_SECONDARY } from '../App.theme';
import { TranscriptModel } from './interfaces';
import { findActiveWord, isCallerA } from './transcript-utils';

function Transcript({
  transcript,
  currentTimeMs,
  seekAudioTime,
}: {
  transcript: TranscriptModel;
  currentTimeMs: number;
  seekAudioTime: (timeMs: number) => void;
}): JSX.Element {
  const [search, setSearch] = useState('');

  const { block: activeBlock, wordKey: activeWordKey } = useMemo(
    () => findActiveWord(transcript.callerTimings, currentTimeMs),
    [transcript, currentTimeMs],
  );

  return (
    <>
      <input
        type="input"
        className="transcript__search mb-4"
        aria-label="search call transcript"
        placeholder="Search call transcript"
        onChange={(event) => setSearch(event.target.value)}
      />
      {transcript.callerTimings
        // Keep the original index so search-filtering doesn't shift React keys
        // (which would reconcile the wrong block onto the wrong DOM node).
        .map((block, originalIndex) => ({ block, originalIndex }))
        .filter(({ originalIndex }) => (transcript.transcriptText[originalIndex] ?? '').includes(search))
        .map(({ block, originalIndex }) => (
          <div className="transcript" key={originalIndex}>
            <TranscriptBlock
              color={
                isCallerA(block.callerId)
                  ? AUDIO_TRANSCRIBE_COLOR_SECONDARY
                  : AUDIO_TRANSCRIBE_COLOR_PRIMARY
              }
              seekAudioTime={seekAudioTime}
              wordTimings={block.timings}
              activeWordKey={block === activeBlock ? activeWordKey : null}
            />
          </div>
        ))}
    </>
  );
}

export default Transcript;
