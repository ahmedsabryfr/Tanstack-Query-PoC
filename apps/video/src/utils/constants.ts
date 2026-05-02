// Color palette
export const COLORS = {
  // Part 1 - Frustrating
  part1: {
    bg: "#0a0a0a",
    bgSecondary: "#141414",
    accent: "#ef4444",
    accentDark: "#b91c1c",
    text: "#e5e5e5",
    textMuted: "#737373",
    tableBg: "#1a1a1a",
    tableBorder: "#2a2a2a",
    tableHeaderBg: "#111111",
    tableRowHover: "#1f1f1f",
    statusActive: "#f59e0b",
    statusInactive: "#6b7280",
  },
  // Part 2 - Smooth
  part2: {
    bg: "#f0f9ff",
    bgGradientFrom: "#eff6ff",
    bgGradientTo: "#f0fdf4",
    accent: "#10b981",
    accentLight: "#34d399",
    text: "#0f172a",
    textMuted: "#64748b",
    tableBg: "#ffffff",
    tableBorder: "#e2e8f0",
    tableHeaderBg: "#f8fafc",
    tableRowHover: "#f1f5f9",
    statusActive: "#10b981",
    statusInactive: "#94a3b8",
    cachedBadge: "#10b981",
  },
} as const;

// Frame timing constants
export const PART1_DURATION = 390;
export const PART2_DURATION = 825;
export const TRANSITION_DURATION = 18;
export const TOTAL_DURATION = PART1_DURATION + PART2_DURATION - TRANSITION_DURATION; // 1197

// Part 1 scene breakpoints (local frames within Part1)
export const P1 = {
  TITLE_START: 0,
  TITLE_END: 44,
  TABLE_LOAD_START: 45,
  TABLE_LOAD_END: 299,
  FRUSTRATION_START: 300,
  FRUSTRATION_END: 389,
} as const;

// Part 2 scene breakpoints (local frames within Part2)
export const P2 = {
  TITLE_START: 0,
  TITLE_END: 44,
  TABLE_APPEAR_START: 45,
  TABLE_APPEAR_END: 299,
  DX_START: 300,
  DX_END: 494,
  COMPARISON_START: 495,
  COMPARISON_END: 674,
  CTA_START: 675,
  CTA_END: 824,
} as const;
