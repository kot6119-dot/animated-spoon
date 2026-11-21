import React from "react";
import { AbsoluteFill, Composition } from "remotion";

// Clean starter composition.
// No old video, audio, or scene references are kept here.
// After a new source clip is uploaded, connect it to this composition deliberately.
const Main = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#111111",
      justifyContent: "center",
      alignItems: "center",
    }}
  />
);

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
  />
);
