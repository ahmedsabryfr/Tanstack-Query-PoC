import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { whoosh } from "@remotion/sfx";
import { COLORS } from "../../utils/constants";
import { SoundCue } from "../../components/SoundCue";
import { useCanvasScale } from "../../utils/useCanvasScale";

export const Part1TitleCard: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = useCanvasScale();

    // Main title entrance
    const titleEntrance = spring({
        frame,
        fps,
        config: { damping: 200 },
        delay: 10,
    });
    const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
    const titleY = interpolate(titleEntrance, [0, 1], [40, 0]);

    // Subtitle entrance
    const subtitleEntrance = spring({
        frame,
        fps,
        config: { damping: 200 },
        delay: 20,
    });
    const subtitleOpacity = interpolate(subtitleEntrance, [0, 1], [0, 1]);
    const subtitleY = interpolate(subtitleEntrance, [0, 1], [30, 0]);

    // Red accent line
    const lineWidth = interpolate(frame, [10, 28], [0, 120], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Fade out at end
    const fadeOut = interpolate(frame, [32, 44], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.part1.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: fadeOut,
            }}
        >
            <SoundCue from={4} src={whoosh} volume={0.08} durationInFrames={20} />

            {/* Red accent line */}
            <div
                style={{
                    width: lineWidth,
                    height: 3 * scale,
                    backgroundColor: COLORS.part1.accent,
                    borderRadius: 2,
                    marginBottom: 24 * scale,
                }}
            />

            {/* Main title */}
            <div
                style={{
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                    fontSize: 48 * scale,
                    fontWeight: 700,
                    color: COLORS.part1.text,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    textAlign: "center",
                    letterSpacing: "-0.02em",
                }}
            >
                Data Fetching...
            </div>

            {/* Subtitle */}
            <div
                style={{
                    opacity: subtitleOpacity,
                    transform: `translateY(${subtitleY}px)`,
                    fontSize: 24 * scale,
                    fontWeight: 400,
                    color: COLORS.part1.accent,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    marginTop: 12 * scale,
                    letterSpacing: "0.05em",
                }}
            >
                without TanStack Query
            </div>
        </AbsoluteFill>
    );
};
