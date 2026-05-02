import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { TableSmooth } from "./part2/TableSmooth";
import { DeveloperExperience } from "./part2/DeveloperExperience";
import { SplitComparison } from "./part2/SplitComparison";
import { CallToAction } from "./part2/CallToAction";
import { ActNarrationOverlay } from "../components/ActNarrationOverlay";
import { COLORS } from "../utils/constants";
import { Part2PersistentHeader } from "./part2/PersistentHeader";

export const Part2WithTanstack: React.FC = () => {
    return (
        <AbsoluteFill>
            <Series>
                <Series.Sequence durationInFrames={300} premountFor={24}>
                    <TableSmooth />
                </Series.Sequence>
                <Series.Sequence durationInFrames={195} premountFor={24}>
                    <DeveloperExperience />
                </Series.Sequence>
                <Series.Sequence durationInFrames={180} premountFor={24}>
                    <SplitComparison />
                </Series.Sequence>
                <Series.Sequence durationInFrames={150} premountFor={24}>
                    <CallToAction />
                </Series.Sequence>
            </Series>
            <Part2PersistentHeader />
            <ActNarrationOverlay
                cues={[
                    {
                        text: "Background refetching",
                        secondary: "Fresh data arrives while the current UI stays visible.",
                        start: 45,
                        end: 110,
                        color: COLORS.part2.text,
                        secondaryColor: COLORS.part2.textMuted,
                    },
                    {
                        text: "Showing stale data with background fetching is better than a loading spinner.",
                        secondary: "Users keep context, then the table quietly refreshes with fresh data.",
                        start: 110,
                        end: 230,
                        color: COLORS.part2.text,
                        secondaryColor: COLORS.part2.textMuted,
                    },
                    {
                        text: "No hard reset.",
                        secondary: "The table stays anchored and the state changes around it.",
                        start: 230,
                        end: 285,
                        color: COLORS.part2.text,
                        secondaryColor: COLORS.part2.textMuted,
                    },
                    {
                        text: "Cached. Zero wait.",
                        secondary: "Going back to warm data is instant.",
                        start: 285,
                        end: 330,
                        color: COLORS.part2.text,
                        secondaryColor: COLORS.part2.textMuted,
                    },
                    {
                        text: "The developer experience changes too.",
                        secondary: "You stop hand-wiring data, loading, error, isError, and refetch for every screen.",
                        start: 330,
                        end: 372,
                        color: COLORS.part2.text,
                        secondaryColor: COLORS.part2.textMuted,
                    },
                ]}
            />
        </AbsoluteFill>
    );
};
