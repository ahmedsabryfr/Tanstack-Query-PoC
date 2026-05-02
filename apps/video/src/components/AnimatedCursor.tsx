import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { useCanvasScale } from "../utils/useCanvasScale";

type CursorMove = {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    moveStart: number;
    moveEnd: number;
    clickFrame: number;
};

type AnimatedCursorProps = {
    movements: CursorMove[];
};

export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({ movements }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = useCanvasScale();

    // Find active movement
    let x = (movements[0]?.fromX ?? 0) * scale;
    let y = (movements[0]?.fromY ?? 0) * scale;
    let clickScale = 1;

    for (const move of movements) {
        if (frame >= move.moveStart) {
            x = interpolate(
                frame,
                [move.moveStart, move.moveEnd],
                [move.fromX * scale, move.toX * scale],
                {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.inOut(Easing.quad),
                }
            );
            y = interpolate(
                frame,
                [move.moveStart, move.moveEnd],
                [move.fromY * scale, move.toY * scale],
                {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.inOut(Easing.quad),
                }
            );

            // Click effect
            if (frame >= move.clickFrame && frame <= move.clickFrame + 10) {
                const clickProgress = spring({
                    frame: frame - move.clickFrame,
                    fps,
                    config: { damping: 8, stiffness: 200 },
                    durationInFrames: 10,
                });
                clickScale = interpolate(clickProgress, [0, 1], [1, 0.85]);
                clickScale = 1 - (1 - clickScale) * 2; // bounce back
            }
        }
    }

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `scale(${clickScale})`,
                zIndex: 1000,
                pointerEvents: "none",
            }}
        >
            {/* Cursor SVG */}
            <svg width={24 * scale} height={24 * scale} viewBox="0 0 24 24" fill="none">
                <path
                    d="M5 3L19 12L12 13L9 20L5 3Z"
                    fill="white"
                    stroke="#333"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
            {/* Click ripple */}
            {movements.map((move, i) => {
                if (frame >= move.clickFrame && frame <= move.clickFrame + 15) {
                    const rippleProgress = interpolate(
                        frame,
                        [move.clickFrame, move.clickFrame + 15],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: 4 * scale,
                                top: 4 * scale,
                                width: interpolate(rippleProgress, [0, 1], [0, 30 * scale]),
                                height: interpolate(rippleProgress, [0, 1], [0, 30 * scale]),
                                borderRadius: "50%",
                                border: "2px solid rgba(255,255,255,0.5)",
                                opacity: interpolate(rippleProgress, [0, 0.5, 1], [0.8, 0.4, 0]),
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
};
