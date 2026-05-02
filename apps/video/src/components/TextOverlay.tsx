import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type TextOverlayProps = {
    text: string;
    color?: string;
    fontSize?: number;
    delay?: number;
    position?: "center" | "bottom" | "top";
    fontWeight?: number;
    secondaryText?: string;
    secondaryColor?: string;
};

export const TextOverlay: React.FC<TextOverlayProps> = ({
    text,
    color = "#ffffff",
    fontSize = 28,
    delay = 0,
    position = "bottom",
    fontWeight = 600,
    secondaryText,
    secondaryColor,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { damping: 200 },
    });

    const translateY = interpolate(entrance, [0, 1], [30, 0]);
    const opacity = interpolate(entrance, [0, 1], [0, 1]);

    const positionStyles: React.CSSProperties =
        position === "center"
            ? { top: "50%", left: "50%", transform: `translate(-50%, -50%) translateY(${translateY}px)` }
            : position === "bottom"
                ? { bottom: 80, left: "50%", transform: `translateX(-50%) translateY(${translateY}px)` }
                : { top: 80, left: "50%", transform: `translateX(-50%) translateY(${translateY}px)` };

    return (
        <div
            style={{
                position: "absolute",
                opacity,
                ...positionStyles,
                textAlign: "center",
                zIndex: 100,
            }}
        >
            <div
                style={{
                    fontSize,
                    fontWeight,
                    color,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </div>
            {secondaryText && (
                <div
                    style={{
                        fontSize: fontSize * 0.6,
                        fontWeight: 400,
                        color: secondaryColor ?? color,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        marginTop: 8,
                        opacity: 0.7,
                    }}
                >
                    {secondaryText}
                </div>
            )}
        </div>
    );
};
