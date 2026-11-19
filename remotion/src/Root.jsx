import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  staticFile,
} from "remotion";

const FPS = 30;
const DURATION_IN_FRAMES = 154;

const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo
      src={staticFile("videos/content 9.mp4")}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
    <Audio src={staticFile("videos/content 6.mp3")} />
  </AbsoluteFill>
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
