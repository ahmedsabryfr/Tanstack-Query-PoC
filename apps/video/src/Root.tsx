import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { TOTAL_DURATION } from "./utils/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
