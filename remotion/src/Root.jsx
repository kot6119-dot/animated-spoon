import React from "react";
import { AbsoluteFill, Composition } from "remotion";

const FPS = 30;
const DURATION_IN_FRAMES = 10 * FPS;

const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }} />
);

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
