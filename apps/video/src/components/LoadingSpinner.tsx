import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type LoadingSpinnerProps = {
    size?: number;
    color?: string;
    thickness?: number;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 48,
    color = "#ef4444",
    thickness = 4,
}) => {
    const frame = useCurrentFrame();
    const rotation = interpolate(frame, [0, 30], [0, 360], {
        extrapolateRight: "extend",
    });

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                border: `${thickness}px solid rgba(255,255,255,0.1)`,
                borderTopColor: color,
                transform: `rotate(${rotation}deg)`,
            }}
        />
    );
};
