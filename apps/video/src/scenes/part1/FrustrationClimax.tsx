import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
} from "remotion";
import { COLORS } from "../../utils/constants";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ScreenShake } from "../../components/ScreenShake";
import { Vignette } from "../../components/Vignette";

export const FrustrationClimax: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Scene is 90 frames.
    // 0-36: Big spinner + stacked words
    // 36-68: "Are you frustrated yet?"
    // 68-89: "...because same" + heavier shake + vignette

    // Stacked frustration words
    const words = ["Slow.", "Janky.", "Frustrating."];

    // Big spinner scale pulse
    const spinnerScale = interpolate(frame, [0, 30, 60], [0.8, 1.3, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Frustrated question
    const questionEntrance = spring({
        frame: frame - 36,
        fps,
        config: { damping: 15, stiffness: 200 },
    });

    // "because same"
    const sameEntrance = spring({
        frame: frame - 68,
        fps,
        config: { damping: 200 },
    });

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.part1.bg }}>
            <ScreenShake
                intensity={frame > 36 ? 6 : 3}
                speed={1.5}
                startFrame={0}
                durationFrames={90}
            >
                <AbsoluteFill
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
                    {/* Big spinner */}
                    <div
                        style={{
                            transform: `scale(${spinnerScale})`,
                            marginBottom: 32,
                        }}
                    >
                        <LoadingSpinner size={64} color={COLORS.part1.accent} thickness={5} />
                    </div>

                    {/* Stacked frustration words */}
                    {words.map((word, i) => {
                        const entrance = spring({
                            frame: frame - i * 12,
                            fps,
                            config: { damping: 15, stiffness: 200 },
                        });
                        const opacity = interpolate(entrance, [0, 1], [0, 1]);
                        const translateY = interpolate(entrance, [0, 1], [30, 0]);
                        const scale = interpolate(entrance, [0, 1], [0.8, 1]);
                        return (
                            <div
                                key={word}
                                style={{
                                    fontSize: 52,
                                    fontWeight: 800,
                                    color: COLORS.part1.accent,
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    opacity,
                                    transform: `translateY(${translateY}px) scale(${scale})`,
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {word}
                            </div>
                        );
                    })}

                    {/* "Are you frustrated yet?" */}
                    {frame >= 36 && (
                        <div
                            style={{
                                marginTop: 40,
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 28,
                                    fontWeight: 600,
                                    color: COLORS.part1.text,
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    opacity: interpolate(questionEntrance, [0, 1], [0, 1]),
                                    transform: `translateY(${interpolate(questionEntrance, [0, 1], [20, 0])}px)`,
                                }}
                            >
                                Are you frustrated yet?
                            </div>

                            {/* "...because same." */}
                            {frame >= 68 && (
                                <div
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 400,
                                        color: COLORS.part1.textMuted,
                                        fontFamily: "'Inter', system-ui, sans-serif",
                                        marginTop: 12,
                                        opacity: interpolate(sameEntrance, [0, 1], [0, 1]),
                                        transform: `translateY(${interpolate(sameEntrance, [0, 1], [15, 0])}px)`,
                                    }}
                                >
                                    ...because same.
                                </div>
                            )}
                        </div>
                    )}
                </AbsoluteFill>
            </ScreenShake>

            {/* Red vignette */}
            <Vignette
                color="rgba(239, 68, 68, 0.4)"
                intensity={1}
                fadeInFrames={30}
                delay={10}
            />
        </AbsoluteFill>
    );
};
