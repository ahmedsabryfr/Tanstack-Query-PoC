import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { useCanvasScale } from "../utils/useCanvasScale";

type NarrationCue = {
    text: string;
    secondary?: string;
    start: number;
    end: number;
    color: string;
    secondaryColor: string;
};

type ActNarrationOverlayProps = {
    cues: NarrationCue[];
    bottom?: number;
};

export const ActNarrationOverlay: React.FC<ActNarrationOverlayProps> = ({
    cues,
    bottom = 44,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = useCanvasScale();

    const activeCue = cues.find((cue) => frame >= cue.start && frame < cue.end);

    if (!activeCue) {
        return null;
    }

    const cueFrame = frame - activeCue.start;
    const entrance = spring({
        frame: cueFrame,
        fps,
        config: { damping: 200 },
    });

    return (
        <AbsoluteFill
            style={{
                pointerEvents: "none",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: bottom,
                zIndex: 20,
            }}
        >
            <div
                style={{
                    textAlign: "center",
                    opacity: interpolate(entrance, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(entrance, [0, 1], [16, 0])}px)`,
                    maxWidth: 840,
                }}
            >
                <div
                    style={{
                        fontSize: 24 * scale,
                        fontWeight: 700,
                        color: activeCue.color,
                        fontFamily: "'Inter', system-ui, sans-serif",
                    }}
                >
                    {activeCue.text}
                </div>
                {activeCue.secondary ? (
                    <div
                    style={{
                            marginTop: 8 * scale,
                            fontSize: 15 * scale,
                            fontWeight: 500,
                            color: activeCue.secondaryColor,
                            fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                    >
                        {activeCue.secondary}
                    </div>
                ) : null}
            </div>
        </AbsoluteFill>
    );
};
