import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type ScreenShakeProps = {
    children: React.ReactNode;
    intensity?: number;
    speed?: number;
    startFrame?: number;
    durationFrames?: number;
};

export const ScreenShake: React.FC<ScreenShakeProps> = ({
    children,
    intensity = 4,
    speed = 1.5,
    startFrame = 0,
    durationFrames = 120,
}) => {
    const frame = useCurrentFrame();

    const localFrame = frame - startFrame;
    const isActive = localFrame >= 0 && localFrame <= durationFrames;

    const rampUp = interpolate(localFrame, [0, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const rampDown = interpolate(
        localFrame,
        [durationFrames - 15, durationFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const shakeX = isActive
        ? Math.sin(localFrame * speed) * intensity * rampUp * rampDown
        : 0;
    const shakeY = isActive
        ? Math.cos(localFrame * speed * 1.3) * intensity * 0.5 * rampUp * rampDown
        : 0;

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                transform: `translate(${shakeX}px, ${shakeY}px)`,
            }}
        >
            {children}
        </div>
    );
};
