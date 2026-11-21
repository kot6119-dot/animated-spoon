import React from "react";
import { AbsoluteFill, Audio, Composition, OffthreadVideo, staticFile } from "remotion";

const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo
      src={staticFile("videos/content 10.mp4")}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Audio src={staticFile("videos/soundtrack_7sec_voice_overlay.mp3")} />
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={212}
    fps={30}
    width={1080}
    height={1920}
  />
);
