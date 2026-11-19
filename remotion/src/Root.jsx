import React from "react";
import { AbsoluteFill, Composition } from "remotion";

const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }} />
);

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
  />
);
