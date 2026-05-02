import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../utils/constants";
import { useCanvasScale } from "../../utils/useCanvasScale";

export const Part1PersistentHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const scale = useCanvasScale();

  const progress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90 },
    durationInFrames: 42,
  });

  const top = interpolate(
    progress,
    [0, 1],
    [height * 0.5 - 54 * scale, 40 * scale],
  );
  const titleScale = interpolate(progress, [0, 1], [1.06, 0.78]);
  const titleOpacity = interpolate(progress, [0, 1], [0, 1]);
  const accentWidth = interpolate(progress, [0, 1], [0, 150 * scale]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        zIndex: 15,
      }}
    >
      <div
        style={{
          position: "absolute",
          top,
          left: "50%",
          transform: `translateX(-50%) scale(${titleScale})`,
          opacity: titleOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: accentWidth,
            height: 3 * scale,
            backgroundColor: COLORS.part1.accent,
            borderRadius: 9999,
            marginBottom: 14 * scale,
          }}
        />

        <div
          style={{
            fontSize: 48 * scale,
            fontWeight: 800,
            color: COLORS.part1.text,
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: "-0.03em",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          Data Fetching...
        </div>

        <div
          style={{
            marginTop: 10 * scale,
            fontSize: 24 * scale,
            fontWeight: 500,
            color: COLORS.part1.accent,
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: "0.03em",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          without TanStack Query
        </div>
      </div>
    </AbsoluteFill>
  );
};
