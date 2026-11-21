import React from "react";
import { AbsoluteFill, Audio, Composition, OffthreadVideo, staticFile } from "remotion";

const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo
      src={staticFile("videos/final-video-iPhone-compatible 3.MP4")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Audio src={staticFile("videos/cow_glass_bright_siren_very_low 2.mp3")} startFrom={0} />
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
