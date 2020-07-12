import React, { useEffect, useState } from 'react';
import './App.scss';
import WeaveForms from './WeaveForms/WeaveForms';
import { getTranscript } from './Transcript/TranscriptService';
import { TranscriptModel } from './core';
import ControlBar from './ControlBar/ControlBar';
import Transcript from './Transcript/Transcript';

function App() {
  const audioRef = React.useRef(new Audio('./59e106639d79684277df770d.wav'));
  const requestRef = React.useRef<number | undefined>();
  const previousTimeRef = React.useRef<number | undefined>();

  useEffect(() => {
    // Line 18:6:  React Hook useEffect has missing dependencies: 'pause' and 'updateAudioState'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
    audioRef.current.addEventListener('canplay', updateAudioState);
    audioRef.current.addEventListener('ended', pause);
    setTranscript(getTranscript());
  }, []);

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
    cancelAnimationFrame(requestRef.current as number);
    updateAudioState();
  };

  const seek = (timeMs: number) => {
    audioRef.current.currentTime = timeMs / 1000;
  };

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      updateAudioState();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  const updateAudioState = () => {
    setAudio({
      ...audio,
      currentTimeMs: audioRef.current.currentTime * 1000,
      durationMs: audioRef.current.duration * 1000,
      paused: audioRef.current.paused,
    });
  };

  return (
    <>
      <ControlBar play={play} pause={pause} paused={audio.paused} />
      <WeaveForms
        seek={seek}
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
