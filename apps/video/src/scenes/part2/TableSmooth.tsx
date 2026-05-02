import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { uiSwitch, whoosh } from "@remotion/sfx";
import { DataTable } from "../../components/DataTable";
import { PaginationBar } from "../../components/PaginationBar";
import { AnimatedCursor } from "../../components/AnimatedCursor";
import { SoundCue } from "../../components/SoundCue";
import { COLORS } from "../../utils/constants";
import { useCanvasScale } from "../../utils/useCanvasScale";

export const TableSmooth: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = useCanvasScale();

    const BG_FETCH_START = 30;
    const BG_FETCH_END = 82;

    const CLICK2_CURSOR_START = 96;
    const CLICK2_CLICK = 110;
    const CLICK2_CROSSFADE_START = 112;

    const CLICK3_CURSOR_START = 148;
    const CLICK3_CLICK = 162;
    const CLICK3_CROSSFADE_START = 164;

    const CLICKBACK_CURSOR_START = 200;
    const CLICKBACK_CLICK = 214;
    const CLICKBACK_CROSSFADE_START = 216;

    const CROSSFADE_DURATION = 12;
    const PAGINATION_BUTTON_Y = 525;

    let currentPage = 1;
    let activeButton: "prev" | "next" | null = null;

    const tableEntrance = spring({
        frame,
        fps,
        config: { damping: 200 },
        delay: 4,
    });
    const tableOpacity = interpolate(tableEntrance, [0, 1], [0, 1]);
    const tableTranslateY = interpolate(tableEntrance, [0, 1], [18, 0]);

    if (frame >= CLICK2_CURSOR_START && frame < CLICK2_CLICK) {
        activeButton = "next";
    }
    if (frame >= CLICK2_CROSSFADE_START) {
        currentPage = 2;
    }

    if (frame >= CLICK3_CURSOR_START && frame < CLICK3_CLICK) {
        activeButton = "next";
    }
    if (frame >= CLICK3_CROSSFADE_START) {
        currentPage = 3;
    }

    if (frame >= CLICKBACK_CURSOR_START && frame < CLICKBACK_CLICK) {
        activeButton = "prev";
    }
    if (frame >= CLICKBACK_CROSSFADE_START) {
        currentPage = 2;
    }

    const showCursor =
        (frame >= CLICK2_CURSOR_START && frame <= CLICK2_CLICK + 10) ||
        (frame >= CLICK3_CURSOR_START && frame <= CLICK3_CLICK + 10) ||
        (frame >= CLICKBACK_CURSOR_START && frame <= CLICKBACK_CLICK + 10);

    const cursorMovements = [
        {
            fromX: 804,
            fromY: 502,
            toX: 720,
            toY: PAGINATION_BUTTON_Y,
            moveStart: CLICK2_CURSOR_START,
            moveEnd: CLICK2_CLICK - 2,
            clickFrame: CLICK2_CLICK,
        },
        {
            fromX: 720,
            fromY: PAGINATION_BUTTON_Y,
            toX: 720,
            toY: PAGINATION_BUTTON_Y,
            moveStart: CLICK3_CURSOR_START,
            moveEnd: CLICK3_CLICK - 2,
            clickFrame: CLICK3_CLICK,
        },
        {
            fromX: 720,
            fromY: PAGINATION_BUTTON_Y,
            toX: 494,
            toY: PAGINATION_BUTTON_Y,
            moveStart: CLICKBACK_CURSOR_START,
            moveEnd: CLICKBACK_CLICK - 2,
            clickFrame: CLICKBACK_CLICK,
        },
    ];

    const showCachedBadge = frame >= 14;
    const cachedBadgeOpacity = spring({
        frame: frame - 14,
        fps,
        config: { damping: 200 },
    });
    const backgroundFetchActive =
        (frame >= BG_FETCH_START && frame < BG_FETCH_END) ||
        (frame >= CLICK2_CROSSFADE_START && frame < CLICK2_CROSSFADE_START + 16) ||
        (frame >= CLICK3_CROSSFADE_START && frame < CLICK3_CROSSFADE_START + 16);

    const headerIndicator =
        frame < BG_FETCH_START
            ? { label: "Fresh", tone: "success" as const }
            : frame < BG_FETCH_END
                ? { label: "Refreshing", tone: "pending" as const, spinning: true }
                : frame < CLICK2_CROSSFADE_START
                    ? { label: "Fresh", tone: "success" as const }
                    : frame < CLICK2_CROSSFADE_START + 16
                        ? { label: "Refreshing", tone: "pending" as const, spinning: true }
                        : frame < CLICK3_CROSSFADE_START
                            ? { label: "Fresh", tone: "success" as const }
                            : frame < CLICK3_CROSSFADE_START + 16
                                ? { label: "Refreshing", tone: "pending" as const, spinning: true }
                                : frame < CLICKBACK_CROSSFADE_START
                                    ? { label: "Fresh", tone: "success" as const }
                                    : frame < CLICKBACK_CROSSFADE_START + 12
                                        ? { label: "Cache hit", tone: "success" as const }
                                        : { label: "Fresh", tone: "success" as const };

    const zoomFocus = interpolate(frame, [34, 48, 68, 82], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const zoomScale = interpolate(zoomFocus, [0, 1], [1, 1.12]);
    const zoomTranslateX = interpolate(zoomFocus, [0, 1], [0, -96]);
    const zoomTranslateY = interpolate(zoomFocus, [0, 1], [0, 42]);
    const highlightOpacity = interpolate(
        frame,
        [BG_FETCH_START, BG_FETCH_START + 6, BG_FETCH_END - 8, BG_FETCH_END],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const pageTransitionActive =
        (frame >= CLICK2_CROSSFADE_START && frame < CLICK2_CROSSFADE_START + CROSSFADE_DURATION) ||
        (frame >= CLICK3_CROSSFADE_START && frame < CLICK3_CROSSFADE_START + CROSSFADE_DURATION) ||
        (frame >= CLICKBACK_CROSSFADE_START &&
            frame < CLICKBACK_CROSSFADE_START + CROSSFADE_DURATION);
    const pageTransitionStart = frame >= CLICKBACK_CROSSFADE_START
        ? CLICKBACK_CROSSFADE_START
        : frame >= CLICK3_CROSSFADE_START
            ? CLICK3_CROSSFADE_START
            : CLICK2_CROSSFADE_START;
    const pageTransitionProgress = pageTransitionActive
        ? interpolate(
              frame,
              [pageTransitionStart, pageTransitionStart + CROSSFADE_DURATION],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        : 1;
    const pageTransitionGlow = pageTransitionActive
        ? interpolate(pageTransitionProgress, [0, 0.3, 1], [0.18, 0.12, 0])
        : 0;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(135deg, ${COLORS.part2.bgGradientFrom}, ${COLORS.part2.bgGradientTo})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <SoundCue from={12} src={whoosh} volume={0.08} durationInFrames={22} />
            <SoundCue from={CLICK2_CLICK - 1} src={uiSwitch} volume={0.16} durationInFrames={16} />
            <SoundCue from={CLICK3_CLICK - 1} src={uiSwitch} volume={0.16} durationInFrames={16} />
            <SoundCue from={CLICKBACK_CLICK - 1} src={uiSwitch} volume={0.16} durationInFrames={16} />

            {showCachedBadge && (
                <div
                    style={{
                        position: "absolute",
                        top: 40 * scale,
                        right: 60 * scale,
                        opacity: interpolate(cachedBadgeOpacity, [0, 1], [0, 1]),
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: 9999,
                        padding: `${6 * scale}px ${16 * scale}px`,
                        display: "flex",
                        alignItems: "center",
                        gap: 6 * scale,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontSize: 13 * scale,
                        fontWeight: 600,
                        color: COLORS.part2.accent,
                    }}
                >
                    <div
                        style={{
                            width: 6 * scale,
                            height: 6 * scale,
                            borderRadius: "50%",
                            backgroundColor: COLORS.part2.accent,
                        }}
                    />
                    Cache warm
                </div>
            )}

            <div
                style={{
                    opacity: tableOpacity,
                    transform: `translate(${zoomTranslateX}px, ${tableTranslateY + zoomTranslateY}px) scale(${zoomScale})`,
                    position: "relative",
                }}
            >
                <div
                    style={{
                    }}
                >
                    <DataTable
                        page={currentPage - 1}
                        variant="light"
                        headerIndicator={headerIndicator}
                        highlightHeaderIndicator={backgroundFetchActive && highlightOpacity > 0.01}
                    />
                    <PaginationBar
                        currentPage={currentPage}
                        totalPages={5}
                        variant="light"
                        activeButton={activeButton}
                    />
                </div>

                {pageTransitionActive ? (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 16,
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
                            opacity: pageTransitionGlow,
                            pointerEvents: "none",
                            zIndex: 3,
                        }}
                    />
                ) : null}
            </div>

            {showCursor ? <AnimatedCursor movements={cursorMovements} /> : null}
        </AbsoluteFill>
    );
};
