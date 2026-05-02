import React from "react";
import { Audio, Sequence } from "remotion";

type SoundCueProps = {
  from: number;
  src: string;
  volume?: number;
  durationInFrames?: number;
  playbackRate?: number;
};

export const SoundCue: React.FC<SoundCueProps> = ({
  from,
  src,
  volume = 0.2,
  durationInFrames = 24,
  playbackRate = 1,
}) => {
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <Audio src={src} volume={volume} playbackRate={playbackRate} />
    </Sequence>
  );
};
