import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Part1WithoutTanstack } from "./scenes/Part1WithoutTanstack";
import { Part2WithTanstack } from "./scenes/Part2WithTanstack";
import { Watermark } from "./components/Watermark";
import {
  PART1_DURATION,
  PART2_DURATION,
  TRANSITION_DURATION,
} from "./utils/constants";

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={PART1_DURATION}>
          <Part1WithoutTanstack />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />
        <TransitionSeries.Sequence durationInFrames={PART2_DURATION}>
          <Part2WithTanstack />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Watermark />
    </AbsoluteFill>
  );
};
