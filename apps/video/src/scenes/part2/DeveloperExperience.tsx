import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { whoosh } from "@remotion/sfx";
import { SoundCue } from "../../components/SoundCue";
import { COLORS } from "../../utils/constants";
import { useCanvasScale } from "../../utils/useCanvasScale";

const manualStateItems = ["data", "loading", "error", "isError", "refetch"];
const queryStateItems = ["data", "isFetching", "isPending", "error", "refetch"];
const manualCodeBase = `const data = ref([])\nconst loading = ref(false)\nconst error = ref(null)\nconst isError = computed(() => !!error.value)`;
const manualCodeExtra = `\n\nconst loadUsers = async () => {\n  loading.value = true\n  error.value = null\n\n  try {\n    data.value = await fetchUsers(page.value)\n  } catch (err) {\n    error.value = err\n  } finally {\n    loading.value = false\n  }\n}\n\nconst refetch = async () => {\n  await loadUsers()\n}\n\nwatch(page, loadUsers)\nonMounted(loadUsers)`;
const vueQueryCode = `const query = useQuery({\n  queryKey: ['users', page],\n  queryFn: fetchUsers,\n})`;

export const DeveloperExperience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = useCanvasScale();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120 },
    durationInFrames: 34,
  });

  const cardOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const cardTranslateY = interpolate(entrance, [0, 1], [26 * scale, 0]);
  const dividerScale = interpolate(entrance, [0, 1], [0.8, 1]);
  const manualCodeWriteStart = 72;
  const manualCodeWriteEnd = 154;
  const typedExtraLength = Math.floor(
    interpolate(
      frame,
      [manualCodeWriteStart, manualCodeWriteEnd],
      [0, manualCodeExtra.length],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    ),
  );
  const manualCode = manualCodeBase + manualCodeExtra.slice(0, typedExtraLength);

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
      <SoundCue from={2} src={whoosh} volume={0.08} durationInFrames={24} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24 * scale,
          width: 1080 * scale,
          transform: `translateY(${cardTranslateY}px)`,
          opacity: cardOpacity,
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.82)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: 28 * scale,
            padding: 28 * scale,
            boxShadow: "0 24px 50px rgba(15, 23, 42, 0.22)",
          }}
        >
          <div
            style={{
              fontSize: 13 * scale,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fca5a5",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Manual state management
          </div>

          <div
            style={{
              marginTop: 14 * scale,
              fontSize: 26 * scale,
              fontWeight: 750,
              lineHeight: 1.1,
              color: "#f8fafc",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Manual plumbing around every fetch.
          </div>

          <div
            style={{
              marginTop: 24 * scale,
              display: "flex",
              flexWrap: "wrap",
              gap: 12 * scale,
            }}
          >
            {manualStateItems.map((item, index) => {
              const chipEntrance = spring({
                frame: frame - 10 - index * 3,
                fps,
                config: { damping: 18, stiffness: 160 },
              });

              return (
                <div
                  key={item}
                  style={{
                    opacity: interpolate(chipEntrance, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(chipEntrance, [0, 1], [14 * scale, 0])}px)`,
                    padding: `${7 * scale}px ${11 * scale}px`,
                    borderRadius: 9999,
                    border: "1px solid rgba(248, 113, 113, 0.28)",
                    backgroundColor: "rgba(248, 113, 113, 0.08)",
                    color: "#fecaca",
                    fontSize: 15 * scale,
                    fontWeight: 650,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 28 * scale,
              borderRadius: 22 * scale,
              backgroundColor: "rgba(2, 6, 23, 0.6)",
              border: "1px solid rgba(148, 163, 184, 0.15)",
              padding: 22 * scale,
              fontFamily: "'IBM Plex Mono', 'SFMono-Regular', monospace",
              color: "#cbd5e1",
              fontSize: 19 * scale,
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {manualCode}
          </div>
        </div>

        <div
          style={{
            width: 2 * scale,
            alignSelf: "center",
            height: 360 * scale,
            borderRadius: 9999,
            transform: `scaleY(${dividerScale})`,
            background:
              "linear-gradient(180deg, rgba(16,185,129,0), rgba(16,185,129,0.55), rgba(16,185,129,0))",
          }}
        />

        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            border: "1px solid rgba(16, 185, 129, 0.16)",
            borderRadius: 28 * scale,
            padding: 28 * scale,
            minHeight: 420 * scale,
            boxShadow: "0 24px 50px rgba(16, 185, 129, 0.10)",
          }}
        >
          <div
            style={{
              fontSize: 13 * scale,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.part2.accent,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Vue Query flow
          </div>

          <div
            style={{
              marginTop: 14 * scale,
              fontSize: 26 * scale,
              fontWeight: 800,
              lineHeight: 1.1,
              color: COLORS.part2.text,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Smaller code, one query source of truth.
          </div>

          <div
            style={{
              marginTop: 24 * scale,
              display: "flex",
              flexWrap: "wrap",
              gap: 12 * scale,
            }}
          >
            {queryStateItems.map((item, index) => {
              const chipEntrance = spring({
                frame: frame - 14 - index * 3,
                fps,
                config: { damping: 18, stiffness: 160 },
              });

              return (
                <div
                  key={item}
                  style={{
                    opacity: interpolate(chipEntrance, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(chipEntrance, [0, 1], [14 * scale, 0])}px)`,
                    padding: `${7 * scale}px ${11 * scale}px`,
                    borderRadius: 9999,
                    border: "1px solid rgba(16, 185, 129, 0.22)",
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    color: "#047857",
                    fontSize: 15 * scale,
                    fontWeight: 650,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 28 * scale,
              borderRadius: 22 * scale,
              backgroundColor: "#f8fafc",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              padding: 22 * scale,
              fontFamily: "'IBM Plex Mono', 'SFMono-Regular', monospace",
              color: "#0f172a",
              fontSize: 21 * scale,
              lineHeight: 1.8,
              whiteSpace: "pre-line",
            }}
          >
            {vueQueryCode}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
