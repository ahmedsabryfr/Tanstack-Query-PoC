import React from "react";
import { useCanvasScale } from "../utils/useCanvasScale";

type PaginationBarProps = {
    currentPage: number;
    totalPages: number;
    variant: "dark" | "light";
    activeButton?: "prev" | "next" | null;
};

export const PaginationBar: React.FC<PaginationBarProps> = ({
    currentPage,
    totalPages,
    variant,
    activeButton = null,
}) => {
    const isDark = variant === "dark";
    const scale = useCanvasScale();

    const buttonStyle = (isActive: boolean): React.CSSProperties => ({
        padding: `${8 * scale}px ${20 * scale}px`,
        borderRadius: 8 * scale,
        border: `1px solid ${isDark ? "#333" : "#e2e8f0"}`,
        backgroundColor: isActive
            ? isDark
                ? "#2a2a2a"
                : "#e2e8f0"
            : isDark
                ? "#1a1a1a"
                : "#ffffff",
        color: isDark ? "#a3a3a3" : "#334155",
        fontSize: 14 * scale,
        fontWeight: 500,
        fontFamily: "'Inter', system-ui, sans-serif",
        cursor: "pointer",
        transform: isActive ? "scale(0.95)" : "scale(1)",
    });

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16 * scale,
                marginTop: 16 * scale,
            }}
        >
            <div style={buttonStyle(activeButton === "prev")}>← Previous</div>
            <div
                style={{
                    fontSize: 14 * scale,
                    color: isDark ? "#737373" : "#64748b",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                Page {currentPage} of {totalPages}
            </div>
            <div style={buttonStyle(activeButton === "next")}>Next →</div>
        </div>
    );
};
