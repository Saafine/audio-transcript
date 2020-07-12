import React, { useEffect, useState } from 'react';
import './App.scss';
import WeaveForms from './WeaveForms/WeaveForms';
import { getTranscript } from './Transcript/TranscriptService';
import { TranscriptModel } from './core';
import ControlBar from './ControlBar/ControlBar';
import Transcript from './Transcript/Transcript';

function App() {
  const audioRef = React.useRef(new Audio('./59e106639d79684277df770d.wav'));
  const requestRef = React.useRef<number>();
  const previousTimeRef = React.useRef<number>();

  useEffect(() => {
    audioRef.current.addEventListener('canplay', updateAudioState)
  }, [])

  const [transcript, setTranscript] = useState<TranscriptModel>({
    wordTimings: [],
    transcriptText: [],
  });

  const [audio, setAudio] = useState({
    currentTimeMs: 0,
    durationMs: 0,
    paused: true,
  });

  const play = () => {
    audioRef.current.play();
    requestRef.current = requestAnimationFrame(animate);
  };

  const pause = () => {
    audioRef.current.pause();
    cancelAnimationFrame(requestRef.current as any);
    updateAudioState();
  };

  const seek = (timeMs: number) => {
    audioRef.current.currentTime = timeMs / 1000;
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
      currentTimeMs: audioRef.current.currentTime * 1000,
      durationMs: audioRef.current.duration * 1000,
      paused: audioRef.current.paused,
    });
  };

  useEffect(() => {
    setTranscript(getTranscript());
  }, []);

  return (
    <>
      <ControlBar play={play} pause={pause} paused={audio.paused} />
        <WeaveForms
          wordTimingsOfPersonA={transcript.wordTimings[0]}
          wordTimingsOfPersonB={transcript.wordTimings[1]}
          currentTimeMs={audio.currentTimeMs}
          durationMs={audio.durationMs}
        />
      <Transcript
        transcript={transcript}
        seekAudioTime={seek}
        currentTimeMs={audio.currentTimeMs}
      />
    </>
  );
}

export default App;
