import { useVideoConfig } from "remotion";

export const useCanvasScale = () => {
  const { width, height } = useVideoConfig();
  return Math.min(width / 1280, height / 720);
};
