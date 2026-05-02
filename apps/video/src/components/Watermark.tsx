import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useCanvasScale } from "../utils/useCanvasScale";

export const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = useCanvasScale();
  const cycle = 90;
  const pingPongFrame = frame % (cycle * 2);
  const localFrame =
    pingPongFrame <= cycle
      ? pingPongFrame
      : cycle - (pingPongFrame - cycle);

  const dotOpacity = interpolate(localFrame, [0, 10, 16], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const leftStroke = interpolate(localFrame, [12, 28], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const middleStroke = interpolate(localFrame, [28, 44], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightStroke = interpolate(localFrame, [44, 66], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 28 * scale,
          bottom: 22 * scale,
          display: "flex",
          alignItems: "center",
          gap: 12 * scale,
          padding: `${8 * scale}px ${10 * scale}px ${8 * scale}px ${8 * scale}px`,
          borderRadius: 9999,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          border: "1px solid rgba(10, 102, 194, 0.14)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
          color: "#0f172a",
          fontSize: 13.5 * scale,
          fontWeight: 700,
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          letterSpacing: "0",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            width: 26 * scale,
            height: 26 * scale,
            borderRadius: 8 * scale,
            backgroundColor: "#0a66c2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            flexShrink: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16 * scale}
            height={16 * scale}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="4" cy="4" r="2" fill="currentColor" fillOpacity={dotOpacity} />
            <g
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
            >
              <path
                strokeDasharray="12"
                strokeDashoffset={leftStroke}
                d="M4 10v10"
              />
              <path
                strokeDasharray="12"
                strokeDashoffset={middleStroke}
                d="M10 10v10"
              />
              <path
                strokeDasharray="24"
                strokeDashoffset={rightStroke}
                d="M10 15c0 -2.76 2.24 -5 5 -5c2.76 0 5 2.24 5 5v5"
              />
            </g>
          </svg>
        </div>
        <span
          style={{
            color: "#0a66c2",
            fontWeight: 700,
            fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          /in/AhmedSabryFR
        </span>
      </div>
    </AbsoluteFill>
  );
};
