import React, { useEffect, useState } from 'react';
import { TranscriptModel, WordTiming } from './core';
import { getTranscript } from './Transcript/TranscriptService';
import WeaveForms from './WeaveForms/WeaveForms';
import ControlBar from './ControlBar/ControlBar';
import Transcript from './Transcript/Transcript';

function App() {
  const audioRef = React.useRef(new Audio('./59e106639d79684277df770d.wav'));
  const requestRef = React.useRef<number | undefined>();
  const previousTimeRef = React.useRef<number | undefined>();

  const [transcript, setTranscript] = useState<TranscriptModel>({
    wordTimings: [],
    transcriptText: [],
  });

  const [wordTimings, setWordTimings] = useState<Array<WordTiming[]>>([[], []]);

  useEffect(() => {
    // Line 18:6:  React Hook useEffect has missing dependencies: 'pause' and 'updateAudioState'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
    audioRef.current.addEventListener('canplay', updateAudioState);
    audioRef.current.addEventListener('ended', pause);

    const transcriptModel = getTranscript();
    setTranscript(transcriptModel);

    const wordTimingsForPersonA = getWordTimings(
      transcriptModel.wordTimings,
      (index) => !Boolean(index % 2),
    );
    const wordTimingsForPersonB = getWordTimings(
      transcriptModel.wordTimings,
      (index) => Boolean(index % 2),
    );
    setWordTimings([wordTimingsForPersonA, wordTimingsForPersonB]);
  }, []);

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

  const forward = () => {
    const forwardTimeInSeconds = 10;
    const next = audioRef.current.currentTime + forwardTimeInSeconds;
    seek(
      next > audioRef.current.duration
        ? audioRef.current.duration * 1000
        : next * 1000,
    );
  };

  const rewind = () => {
    const rewindTimeInSeconds = 10;
    const previous = audioRef.current.currentTime - rewindTimeInSeconds;
    seek(previous < 0 ? 0 : previous * 1000);
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

  const getWordTimings: (
    wordTimings: Array<WordTiming[]>,
    filterFn: (index: number) => boolean,
  ) => WordTiming[] = (wordTimings, filterFn) => {
    return wordTimings.filter((_, idx) => filterFn(idx)).flat();
  };

  return (
    <>
      <ControlBar
        paused={audio.paused}
        play={play}
        pause={pause}
        forward={forward}
        rewind={rewind}
      />
      <WeaveForms
        seek={seek}
        wordTimingsOfPersonA={wordTimings[0]}
        wordTimingsOfPersonB={wordTimings[1]}
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
