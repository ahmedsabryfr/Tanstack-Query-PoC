import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { whoosh } from "@remotion/sfx";
import { COLORS } from "../../utils/constants";
import { SoundCue } from "../../components/SoundCue";
import { useCanvasScale } from "../../utils/useCanvasScale";

export const Part2TitleCard: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = useCanvasScale();

    // Spring entrance for title
    const titleSpring = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 150 },
        delay: 8,
    });
    const titleScale = interpolate(titleSpring, [0, 1], [0.7, 1]);
    const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

    // Subtitle entrance
    const subtitleSpring = spring({
        frame,
        fps,
        config: { damping: 200 },
        delay: 18,
    });
    const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);
    const subtitleY = interpolate(subtitleSpring, [0, 1], [25, 0]);

    // Green accent line
    const lineWidth = interpolate(frame, [8, 26], [0, 120], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Background gradient pulse
    const gradientShift = interpolate(frame, [0, 45], [0, 10], {
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
                background: `linear-gradient(135deg, ${COLORS.part2.bgGradientFrom} ${gradientShift}%, ${COLORS.part2.bgGradientTo} 100%)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: fadeOut,
            }}
        >
            <SoundCue from={4} src={whoosh} volume={0.08} durationInFrames={20} />

            {/* Green accent line */}
            <div
                style={{
                    width: lineWidth,
                    height: 3 * scale,
                    backgroundColor: COLORS.part2.accent,
                    borderRadius: 2,
                    marginBottom: 24 * scale,
                }}
            />

            {/* Main title */}
            <div
                style={{
                    opacity: titleOpacity,
                    transform: `scale(${titleScale})`,
                    fontSize: 48 * scale,
                    fontWeight: 700,
                    color: COLORS.part2.text,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    textAlign: "center",
                    letterSpacing: "-0.02em",
                }}
            >
                Data Fetching
            </div>

            {/* Subtitle */}
            <div
                style={{
                    opacity: subtitleOpacity,
                    transform: `translateY(${subtitleY}px)`,
                    fontSize: 24 * scale,
                    fontWeight: 500,
                    color: COLORS.part2.accent,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    marginTop: 12 * scale,
                    letterSpacing: "0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 10 * scale,
                }}
            >
                with <span style={{ fontWeight: 700 }}>TanStack Query</span> ✨
            </div>
        </AbsoluteFill>
    );
};
