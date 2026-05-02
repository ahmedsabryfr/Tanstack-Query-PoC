import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { TableWithLoading } from "./part1/TableWithLoading";
import { FrustrationClimax } from "./part1/FrustrationClimax";
import { ActNarrationOverlay } from "../components/ActNarrationOverlay";
import { COLORS } from "../utils/constants";
import { Part1PersistentHeader } from "./part1/PersistentHeader";

export const Part1WithoutTanstack: React.FC = () => {
    return (
        <AbsoluteFill>
            <Series>
                <Series.Sequence durationInFrames={300} premountFor={24}>
                    <TableWithLoading />
                </Series.Sequence>
                <Series.Sequence durationInFrames={90} premountFor={24}>
                    <FrustrationClimax />
                </Series.Sequence>
            </Series>
            <Part1PersistentHeader />
            <ActNarrationOverlay
                cues={[
                    {
                        text: "Loading... again.",
                        secondary: "A small page change blanks the whole table.",
                        start: 58,
                        end: 124,
                        color: COLORS.part1.accent,
                        secondaryColor: COLORS.part1.textMuted,
                    },
                    {
                        text: "Every. Single. Time.",
                        secondary: "You lose context and watch the same reset over and over.",
                        start: 124,
                        end: 300,
                        color: COLORS.part1.accent,
                        secondaryColor: COLORS.part1.textMuted,
                    },
                    {
                        text: "This is the pain TanStack Query removes.",
                        secondary: "Keep the UI visible while data work happens in the background.",
                        start: 300,
                        end: 390,
                        color: COLORS.part1.text,
                        secondaryColor: COLORS.part1.textMuted,
                    },
                ]}
            />
        </AbsoluteFill>
    );
};
