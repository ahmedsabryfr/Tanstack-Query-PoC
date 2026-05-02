import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type VignetteProps = {
    color?: string;
    intensity?: number;
    fadeInFrames?: number;
    delay?: number;
};

export const Vignette: React.FC<VignetteProps> = ({
    color = "rgba(239, 68, 68, 0.3)",
    intensity = 1,
    fadeInFrames = 20,
    delay = 0,
}) => {
    const frame = useCurrentFrame();

    const opacity = interpolate(frame - delay, [0, fadeInFrames], [0, intensity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                opacity,
                background: `radial-gradient(ellipse at center, transparent 30%, ${color} 100%)`,
                pointerEvents: "none",
                zIndex: 50,
            }}
        />
    );
};
