import React from "react";
import { AbsoluteFill, Audio, Composition, OffthreadVideo, staticFile } from "remotion";

const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo
      src={staticFile("videos/test-34.mp4")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Audio src={staticFile("videos/cow_video_audio_mix_v1.mp3")} startFrom={0} />
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <Composition id="Main" component={Main} durationInFrames={212} fps={30} width={1080} height={1920} />
);
