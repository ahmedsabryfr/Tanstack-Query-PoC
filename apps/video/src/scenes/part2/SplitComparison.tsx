import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
} from "remotion";
import { whoosh } from "@remotion/sfx";
import { COLORS } from "../../utils/constants";
import { SoundCue } from "../../components/SoundCue";
import { useCanvasScale } from "../../utils/useCanvasScale";

export const SplitComparison: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = useCanvasScale();

    // Split screen entrance
    const splitEntrance = spring({
        frame,
        fps,
        config: { damping: 200 },
        delay: 5,
    });
    const splitScale = interpolate(splitEntrance, [0, 1], [0.9, 1]);
    const splitOpacity = interpolate(splitEntrance, [0, 1], [0, 1]);

    // Divider line
    const dividerHeight = interpolate(frame, [10, 30], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Features list
    const features = [
        "✦ Automatic Caching",
        "✦ Background Refetching",
        "✦ Show Stale Data",
        "✦ Keep Previous Data",
        "✦ Prefetching",
        "✦ Better Dev Experience",
        "✦ Devtools Ready",
    ];

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${COLORS.part2.bgGradientFrom}, ${COLORS.part2.bgGradientTo})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity: splitOpacity,
                transform: `scale(${splitScale})`,
            }}
        >
            <SoundCue from={3} src={whoosh} volume={0.08} durationInFrames={24} />

            {/* Split comparison */}
            <div
                style={{
                    display: "flex",
                    gap: 0,
                    width: 850 * scale,
                    height: 280 * scale,
                    borderRadius: 20 * scale,
                    overflow: "hidden",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                }}
            >
                {/* Left: Without (bad) */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.part1.bg,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16 * scale,
                        padding: 32 * scale,
                        position: "relative",
                    }}
                >
                    {/* Red X */}
                    <div
                        style={{
                            fontSize: 48 * scale,
                            opacity: interpolate(
                                spring({ frame: frame - 15, fps, config: { damping: 12 } }),
                                [0, 1],
                                [0, 1]
                            ),
                            transform: `scale(${interpolate(
                                spring({ frame: frame - 15, fps, config: { damping: 12 } }),
                                [0, 1],
                                [0.5, 1]
                            )})`,
                        }}
                    >
                        ❌
                    </div>
                    <div
                        style={{
                            fontSize: 18 * scale,
                            fontWeight: 700,
                            color: COLORS.part1.accent,
                            fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                    >
                        Without
                    </div>
                    <div
                        style={{
                            fontSize: 13 * scale,
                            color: COLORS.part1.textMuted,
                            fontFamily: "'Inter', system-ui, sans-serif",
                            textAlign: "center",
                            lineHeight: 1.5,
                        }}
                    >
                        loading, loading, loading, ...
                        <br />
                        Blank state flashes
                        <br />
                        Refetch every time
                    </div>
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: 2 * scale,
                        height: `${dividerHeight}%`,
                        backgroundColor: "#e2e8f0",
                        alignSelf: "center",
                    }}
                />

                {/* Right: With (good) */}
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16 * scale,
                        padding: 32 * scale,
                    }}
                >
                    {/* Green check */}
                    <div
                        style={{
                            fontSize: 48 * scale,
                            opacity: interpolate(
                                spring({ frame: frame - 20, fps, config: { damping: 12 } }),
                                [0, 1],
                                [0, 1]
                            ),
                            transform: `scale(${interpolate(
                                spring({ frame: frame - 20, fps, config: { damping: 12 } }),
                                [0, 1],
                                [0.5, 1]
                            )})`,
                        }}
                    >
                        ✅
                    </div>
                    <div
                        style={{
                            fontSize: 18 * scale,
                            fontWeight: 700,
                            color: COLORS.part2.accent,
                            fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                    >
                        With TanStack Query
                    </div>
                    <div
                        style={{
                            fontSize: 13 * scale,
                            color: COLORS.part2.textMuted,
                            fontFamily: "'Inter', system-ui, sans-serif",
                            textAlign: "center",
                            lineHeight: 1.5,
                        }}
                    >
                        Instant page swaps
                        <br />
                        Stale data stays visible
                        <br />
                        Fresh data streams in
                    </div>
                </div>
            </div>

            {/* Features list */}
            <div
                style={{
                    display: "flex",
                    gap: 20 * scale,
                    marginTop: 40 * scale,
                    flexWrap: "wrap",
                    justifyContent: "center",
                    maxWidth: 800 * scale,
                }}
            >
                {features.map((feature, i) => {
                    const featureEntrance = spring({
                        frame: frame - 35 - i * 8,
                        fps,
                        config: { damping: 15, stiffness: 150 },
                    });
                    return (
                        <div
                            key={feature}
                            style={{
                                opacity: interpolate(featureEntrance, [0, 1], [0, 1]),
                                transform: `translateY(${interpolate(featureEntrance, [0, 1], [20, 0])}px) scale(${interpolate(featureEntrance, [0, 1], [0.9, 1])})`,
                                backgroundColor: "rgba(16, 185, 129, 0.08)",
                                border: "1px solid rgba(16, 185, 129, 0.2)",
                                borderRadius: 12 * scale,
                                padding: `${10 * scale}px ${20 * scale}px`,
                                fontSize: 14 * scale,
                                fontWeight: 600,
                                color: COLORS.part2.text,
                                fontFamily: "'Inter', system-ui, sans-serif",
                            }}
                        >
                            {feature}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
