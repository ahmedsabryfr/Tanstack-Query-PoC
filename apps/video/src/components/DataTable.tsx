import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TABLE_DATA, TABLE_COLUMNS, type UserRow } from "../data/tableData";
import { useCanvasScale } from "../utils/useCanvasScale";

type HeaderIndicator = {
    label: string;
    tone?: "pending" | "success";
    spinning?: boolean;
};

type DataTableProps = {
    page: number;
    opacity?: number;
    translateY?: number;
    variant: "dark" | "light";
    headerIndicator?: HeaderIndicator | null;
    highlightHeaderIndicator?: boolean;
};

const statusBadge = (status: UserRow["status"], variant: "dark" | "light") => {
    const isActive = status === "Active";
    if (variant === "dark") {
        return {
            backgroundColor: isActive
                ? "rgba(245, 158, 11, 0.15)"
                : "rgba(107, 114, 128, 0.15)",
            color: isActive ? "#f59e0b" : "#6b7280",
            borderColor: isActive
                ? "rgba(245, 158, 11, 0.3)"
                : "rgba(107, 114, 128, 0.3)",
        };
    }
    return {
        backgroundColor: isActive
            ? "rgba(16, 185, 129, 0.1)"
            : "rgba(148, 163, 184, 0.1)",
        color: isActive ? "#10b981" : "#94a3b8",
        borderColor: isActive
            ? "rgba(16, 185, 129, 0.25)"
            : "rgba(148, 163, 184, 0.25)",
    };
};

export const DataTable: React.FC<DataTableProps> = ({
    page,
    opacity = 1,
    translateY = 0,
    variant,
    headerIndicator = null,
    highlightHeaderIndicator = false,
}) => {
    const frame = useCurrentFrame();
    const scale = useCanvasScale();
    const rows = TABLE_DATA[page] ?? TABLE_DATA[0];
    const isDark = variant === "dark";
    const badgeTone = headerIndicator?.tone ?? "pending";
    const badgeColors =
        badgeTone === "success"
            ? {
                backgroundColor: isDark ? "rgba(16, 185, 129, 0.16)" : "rgba(16, 185, 129, 0.1)",
                borderColor: isDark ? "rgba(16, 185, 129, 0.32)" : "rgba(16, 185, 129, 0.22)",
                textColor: isDark ? "#6ee7b7" : "#047857",
                indicatorColor: "#10b981",
            }
            : {
                backgroundColor: isDark ? "rgba(96, 165, 250, 0.16)" : "rgba(59, 130, 246, 0.1)",
                borderColor: isDark ? "rgba(96, 165, 250, 0.32)" : "rgba(59, 130, 246, 0.22)",
                textColor: isDark ? "#93c5fd" : "#1d4ed8",
                indicatorColor: "#3b82f6",
            };
    const headerSpinnerRotation = interpolate(frame, [0, 24], [0, 360], {
        extrapolateRight: "extend",
    });

    return (
        <div
            style={{
                opacity,
                transform: `translateY(${translateY}px)`,
                width: 900 * scale,
                position: "relative",
                borderRadius: 16 * scale,
                overflow: "hidden",
                border: `1px solid ${isDark ? "#2a2a2a" : "#e2e8f0"}`,
                boxShadow: isDark
                    ? "0 25px 50px -12px rgba(0,0,0,0.6)"
                    : "0 25px 50px -12px rgba(0,0,0,0.1)",
                fontFamily: "'Inter', system-ui, sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: isDark ? "#111111" : "#f8fafc",
                    borderBottom: `1px solid ${isDark ? "#2a2a2a" : "#e2e8f0"}`,
                    padding: `${14 * scale}px ${24 * scale}px`,
                }}
            >
                <div style={{ display: "flex", flex: 1 }}>
                    {TABLE_COLUMNS.map((col) => (
                        <div
                            key={col}
                            style={{
                                flex: col === "Email" ? 1.5 : 1,
                                fontSize: 13 * scale,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: isDark ? "#737373" : "#64748b",
                            }}
                        >
                            {col}
                        </div>
                    ))}
                </div>
            </div>

            {headerIndicator ? (
                <div
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 16,
                        zIndex: 2,
                        pointerEvents: "none",
                    }}
                >
                    {highlightHeaderIndicator ? (
                        <div
                            style={{
                                position: "absolute",
                                inset: `${-4 * scale}px ${-5 * scale}px`,
                                borderRadius: 9999,
                                border: "2px solid rgba(59, 130, 246, 0.28)",
                                boxShadow: "0 0 0 7px rgba(59, 130, 246, 0.08)",
                                opacity: 1,
                                transform: `scale(${interpolate(
                                    Math.sin(frame * 0.25) * 0.5 + 0.5,
                                    [0, 1],
                                    [0.99, 1.04]
                                )})`,
                                transformOrigin: "center",
                            }}
                        />
                    ) : null}
                    <div
                        style={{
                            position: "relative",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: `${6 * scale}px ${10 * scale}px`,
                        borderRadius: 9999,
                        border: `1px solid ${badgeColors.borderColor}`,
                        backgroundColor: badgeColors.backgroundColor,
                        color: badgeColors.textColor,
                        fontSize: 11 * scale,
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        whiteSpace: "nowrap",
                        boxShadow: isDark
                            ? "0 10px 30px rgba(0,0,0,0.35)"
                            : "0 10px 24px rgba(15, 23, 42, 0.08)",
                    }}
                    >
                        <div
                            style={
                                headerIndicator.spinning
                                    ? {
                                        width: 10 * scale,
                                        height: 10 * scale,
                                        borderRadius: "50%",
                                        border: `2px solid ${badgeColors.indicatorColor}33`,
                                        borderTopColor: badgeColors.indicatorColor,
                                        transform: `rotate(${headerSpinnerRotation}deg)`,
                                    }
                                    : {
                                        width: 8 * scale,
                                        height: 8 * scale,
                                        borderRadius: "50%",
                                        backgroundColor: badgeColors.indicatorColor,
                                        boxShadow: `0 0 12px ${badgeColors.indicatorColor}55`,
                                    }
                            }
                        />
                        {headerIndicator.label}
                    </div>
                </div>
            ) : null}

            {/* Rows */}
            {rows.map((row, i) => (
                <div
                    key={row.id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: `${16 * scale}px ${24 * scale}px`,
                        backgroundColor: isDark
                            ? i % 2 === 0
                                ? "#1a1a1a"
                                : "#141414"
                            : i % 2 === 0
                                ? "#ffffff"
                                : "#f8fafc",
                        borderBottom:
                            i < rows.length - 1
                                ? `1px solid ${isDark ? "#222222" : "#f1f5f9"}`
                                : "none",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            fontSize: 14 * scale,
                            color: isDark ? "#525252" : "#94a3b8",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {row.id}
                    </div>
                    <div
                        style={{
                            flex: 1,
                            fontSize: 14 * scale,
                            fontWeight: 500,
                            color: isDark ? "#e5e5e5" : "#0f172a",
                        }}
                    >
                        {row.name}
                    </div>
                    <div
                        style={{
                            flex: 1.5,
                            fontSize: 14 * scale,
                            color: isDark ? "#737373" : "#64748b",
                        }}
                    >
                        {row.email}
                    </div>
                    <div
                        style={{
                            flex: 1,
                            fontSize: 14 * scale,
                            color: isDark ? "#a3a3a3" : "#334155",
                        }}
                    >
                        {row.role}
                    </div>
                    <div style={{ flex: 1 }}>
                        <span
                            style={{
                                fontSize: 12 * scale,
                                fontWeight: 500,
                                padding: `${4 * scale}px ${12 * scale}px`,
                                borderRadius: 9999,
                                border: "1px solid",
                                ...statusBadge(row.status, variant),
                            }}
                        >
                            {row.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
