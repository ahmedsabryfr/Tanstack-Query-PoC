import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { mouseClick } from "@remotion/sfx";
import { AnimatedCursor } from "../../components/AnimatedCursor";
import { DataTable } from "../../components/DataTable";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { PaginationBar } from "../../components/PaginationBar";
import { SoundCue } from "../../components/SoundCue";
import { COLORS } from "../../utils/constants";

export const TableWithLoading: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const TABLE_APPEAR_START = 28;

    const CLICK2_CURSOR_START = 58;
    const CLICK2_CLICK = 72;
    const CLICK2_VANISH = 74;
    const CLICK2_TABLE_APPEAR = 107;

    const CLICK3_CURSOR_START = 122;
    const CLICK3_CLICK = 136;
    const CLICK3_VANISH = 138;
    const CLICK3_TABLE_APPEAR = 171;

    const CLICKBACK_CURSOR_START = 186;
    const CLICKBACK_CLICK = 200;
    const CLICKBACK_VANISH = 202;
    const CLICKBACK_TABLE_APPEAR = 235;
    const PAGINATION_BUTTON_Y = 525;

    let currentPage = 1;
    let showSpinner = false;
    let tableOpacity = 0;
    let activeButton: "prev" | "next" | null = null;

    if (frame < TABLE_APPEAR_START) {
        showSpinner = true;
    } else if (frame < CLICK2_VANISH) {
        currentPage = 1;
        const appear = spring({
            frame: frame - TABLE_APPEAR_START,
            fps,
            config: { damping: 200 },
        });
        tableOpacity = appear;
        if (frame >= CLICK2_CURSOR_START && frame < CLICK2_CLICK) {
            activeButton = "next";
        }
    } else if (frame < CLICK2_TABLE_APPEAR) {
        currentPage = 1;
        tableOpacity = interpolate(frame, [CLICK2_VANISH, CLICK2_VANISH + 2], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        if (frame > CLICK2_VANISH + 2) {
            tableOpacity = 0;
            showSpinner = true;
        }
    } else if (frame < CLICK3_VANISH) {
        currentPage = 2;
        const appear = spring({
            frame: frame - CLICK2_TABLE_APPEAR,
            fps,
            config: { damping: 200 },
        });
        tableOpacity = appear;
        if (frame >= CLICK3_CURSOR_START && frame < CLICK3_CLICK) {
            activeButton = "next";
        }
    } else if (frame < CLICK3_TABLE_APPEAR) {
        currentPage = 2;
        tableOpacity = interpolate(frame, [CLICK3_VANISH, CLICK3_VANISH + 2], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        if (frame > CLICK3_VANISH + 2) {
            tableOpacity = 0;
            showSpinner = true;
        }
    } else if (frame < CLICKBACK_VANISH) {
        currentPage = 3;
        const appear = spring({
            frame: frame - CLICK3_TABLE_APPEAR,
            fps,
            config: { damping: 200 },
        });
        tableOpacity = appear;
        if (frame >= CLICKBACK_CURSOR_START && frame < CLICKBACK_CLICK) {
            activeButton = "prev";
        }
    } else if (frame < CLICKBACK_TABLE_APPEAR) {
        currentPage = 3;
        tableOpacity = interpolate(
            frame,
            [CLICKBACK_VANISH, CLICKBACK_VANISH + 2],
            [1, 0],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            }
        );
        if (frame > CLICKBACK_VANISH + 2) {
            tableOpacity = 0;
            showSpinner = true;
        }
    } else {
        currentPage = 2;
        const appear = spring({
            frame: frame - CLICKBACK_TABLE_APPEAR,
            fps,
            config: { damping: 200 },
        });
        tableOpacity = appear;
    }

    const cursorMovements = [
        {
            fromX: 800,
            fromY: 500,
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
            toX: 500,
            toY: PAGINATION_BUTTON_Y,
            moveStart: CLICKBACK_CURSOR_START,
            moveEnd: CLICKBACK_CLICK - 2,
            clickFrame: CLICKBACK_CLICK,
        },
    ];

    const showCursor =
        (frame >= CLICK2_CURSOR_START && frame <= CLICK2_CLICK + 10) ||
        (frame >= CLICK3_CURSOR_START && frame <= CLICK3_CLICK + 10) ||
        (frame >= CLICKBACK_CURSOR_START && frame <= CLICKBACK_CLICK + 10);

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.part1.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <SoundCue from={CLICK2_CLICK - 1} src={mouseClick} volume={0.14} durationInFrames={16} />
            <SoundCue from={CLICK3_CLICK - 1} src={mouseClick} volume={0.14} durationInFrames={16} />
            <SoundCue from={CLICKBACK_CLICK - 1} src={mouseClick} volume={0.14} durationInFrames={16} />

            {showSpinner ? (
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <LoadingSpinner color={COLORS.part1.accent} size={48} />
                    <div
                        style={{
                            fontSize: 14,
                            color: COLORS.part1.textMuted,
                            fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                    >
                        Loading...
                    </div>
                </div>
            ) : null}

            <div style={{ opacity: tableOpacity }}>
                <DataTable page={currentPage - 1} variant="dark" />
                <PaginationBar
                    currentPage={currentPage}
                    totalPages={5}
                    variant="dark"
                    activeButton={activeButton}
                />
            </div>
            {showCursor ? <AnimatedCursor movements={cursorMovements} /> : null}
        </AbsoluteFill>
    );
};
