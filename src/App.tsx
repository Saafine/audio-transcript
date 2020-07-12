import React, { useState } from 'react';
import './App.scss';
import ControlBar from './ControlBar/ControlBar';
import Transcript from './Transcript/Transcript';
import WeaveForms from './WeaveForms/WeaveForms';
import { getTranscript } from './Transcript/TranscriptService';
import { useAudio } from 'react-use';

function App() {
  const transcript = getTranscript();
  const [audio, audioState, audioControls] = useAudio({
    src: './59e106639d79684277df770d.wav',
    autoPlay: false,
  });

  // const audio2 = new Audio("./59e106639d79684277df770d.wav")
  //   // audio2.ontimeupdate = (event) => {
  //   //   updateCurrentTime(audio2.currentTime);
  //   // };
  //
  //
  //   setTimeout(() => {
  //     audio2.play();
  // }, 1000)

  return (
    <>
      <ControlBar
        play={audioControls.play}
        pause={audioControls.pause}
        audioState={audioState}
      />
      <div className={'p-4'}>
        {audioState.time * 1000}
        <WeaveForms
          wordTimings={transcript.wordTimings[0]}
          currentTimeMs={audioState.time * 1000}
          durationMs={audioState.duration * 1000}
        />
      </div>
      <Transcript
        transcript={transcript}
        seekAudioTime={audioControls.seek}
        currentTimeMs={audioState.time * 1000}
      />
      {audio}
    </>
  );
}

export default App;
