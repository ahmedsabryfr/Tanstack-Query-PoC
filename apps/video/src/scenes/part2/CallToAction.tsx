import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
} from "remotion";
import { ding, whoosh } from "@remotion/sfx";
import { COLORS } from "../../utils/constants";
import { SoundCue } from "../../components/SoundCue";
import { useCanvasScale } from "../../utils/useCanvasScale";

const FRAMEWORKS = [
    { name: "React", pkg: "@tanstack/react-query" },
    { name: "Vue", pkg: "@tanstack/vue-query" },
    { name: "Angular", pkg: "@tanstack/angular-query-experimental" },
    { name: "Solid", pkg: "@tanstack/solid-query" },
    { name: "Svelte", pkg: "@tanstack/svelte-query" },
] as const;

export const CallToAction: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = useCanvasScale();
    const frameworkIndex = Math.min(
        Math.floor(frame / 30),
        FRAMEWORKS.length - 1,
    );
    const framework = FRAMEWORKS[frameworkIndex];
    const cycleFrame = frame % 30;
    const frameworkOpacity = interpolate(cycleFrame, [0, 6, 24, 29], [0, 1, 1, 0.72], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const frameworkY = interpolate(cycleFrame, [0, 8], [14 * scale, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Logo/title entrance
    const titleEntrance = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 150 },
        delay: 3,
    });
    const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
    const titleScale = interpolate(titleEntrance, [0, 1], [0.85, 1]);

    // URL entrance
    const urlEntrance = spring({
        frame,
        fps,
        config: { damping: 200 },
        delay: 12,
    });
    const urlOpacity = interpolate(urlEntrance, [0, 1], [0, 1]);
    const urlY = interpolate(urlEntrance, [0, 1], [15, 0]);

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${COLORS.part2.bgGradientFrom}, ${COLORS.part2.bgGradientTo})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 20 * scale,
            }}
        >
            <SoundCue from={2} src={whoosh} volume={0.08} durationInFrames={24} />
            <SoundCue from={10} src={ding} volume={0.12} durationInFrames={24} />

            {/* CTA title */}
            <div
                style={{
                    opacity: titleOpacity,
                    transform: `scale(${titleScale})`,
                    fontSize: 52 * scale,
                    fontWeight: 800,
                    color: COLORS.part2.text,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    letterSpacing: "-0.03em",
                    textAlign: "center",
                }}
            >
                <span style={{ color: COLORS.part2.accent, marginRight: 12 * scale }}>⚡</span>
                TanStack Query for
            </div>

            <div
                style={{
                    opacity: titleOpacity * frameworkOpacity,
                    transform: `translateY(${frameworkY}px)`,
                    fontSize: 66 * scale,
                    fontWeight: 900,
                    color: COLORS.part2.accent,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    letterSpacing: "-0.04em",
                    textAlign: "center",
                    minHeight: 78 * scale,
                }}
            >
                {framework.name}
            </div>

            <div
                style={{
                    opacity: urlOpacity,
                    transform: `translateY(${urlY}px)`,
                    fontSize: 18 * scale,
                    fontWeight: 500,
                    color: COLORS.part2.textMuted,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    textAlign: "center",
                    maxWidth: 760 * scale,
                }}
            >
                One async state model across frameworks with caching, stale data, and background refetching.
            </div>

            {/* Install command */}
            <div
                style={{
                    opacity: urlOpacity * frameworkOpacity,
                    transform: `translateY(${urlY + 2}px)`,
                    fontSize: 20 * scale,
                    fontWeight: 600,
                    color: COLORS.part2.text,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: 12 * scale,
                    padding: `${10 * scale}px ${24 * scale}px`,
                }}
            >
                npm i {framework.pkg}
            </div>

            <div
                style={{
                    opacity: urlOpacity,
                    fontSize: 18 * scale,
                    fontWeight: 600,
                    color: COLORS.part2.textMuted,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    letterSpacing: "0.01em",
                }}
            >
                tanstack.com/query
            </div>
        </AbsoluteFill>
    );
};
