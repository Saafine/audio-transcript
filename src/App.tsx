import React, { useEffect, useState } from 'react';
import './App.scss';
import WeaveForms from './WeaveForms/WeaveForms';
import { getTranscript } from './Transcript/TranscriptService';
import { TranscriptModel } from './core';
import ControlBar from './ControlBar/ControlBar';
import Transcript from './Transcript/Transcript';

function App() {
  const [transcript, setTranscript] = useState<TranscriptModel>({
    wordTimings: [],
    transcriptText: [],
  });

  const [audio, setAudio] = useState({
    currentTimeMs: 1,
    durationMs: 1,
    paused: true,
  });

  const play = () => {
    audio2.current.play();
    requestRef.current = requestAnimationFrame(animate);
  };

  const pause = () => {
    audio2.current.pause();
    cancelAnimationFrame(requestRef.current as any);
    updateAudioState();
  };

  const seek = (timeMs: number) => {
    audio2.current.currentTime = timeMs / 1000;
    updateAudioState();
  };

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      updateAudioState();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate) as any;
  };

  const updateAudioState = () => {
    setAudio({
      ...audio,
      currentTimeMs: audio2.current.currentTime * 1000,
      durationMs: audio2.current.duration * 1000,
      paused: audio2.current.paused,
    });
  };

  useEffect(() => {
    setTranscript(getTranscript());
  }, []);

  useEffect(() => {
    audio2.current.addEventListener('ended', pause);
  }, [pause]);

  const audio2 = React.useRef(new Audio('./59e106639d79684277df770d.wav'));
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();

  return (
    <>
      <ControlBar play={play} pause={pause} paused={audio.paused} />
      <div className={'p-4'}>
        <WeaveForms
          wordTimings={transcript.wordTimings[0]}
          currentTimeMs={audio.currentTimeMs}
          durationMs={audio.durationMs}
        />
      </div>
      <Transcript
        transcript={transcript}
        seekAudioTime={seek}
        currentTimeMs={audio.currentTimeMs}
      />
    </>
  );
}

export default App;
