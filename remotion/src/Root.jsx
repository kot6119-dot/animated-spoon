import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";

const FPS = 30;
const DURATION_IN_FRAMES = 154;

// Grok timing notes applied:
// - Advance the picture by 3 frames so the opening mouth movement leads the audio.
// - Keep the first phrase at its original pace.
// - Leave a 5-frame pause (about 0.17 s) before the second phrase.
// - Speed up the second phrase slightly and soften its ending.
const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo
      src={staticFile("videos/content 9.mp4")}
      startFrom={3}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />

    <Audio
      src={staticFile("videos/content 6.mp3")}
      startFrom={0}
      endAt={60}
    />

    <Sequence from={65}>
      <Audio
        src={staticFile("videos/content 6.mp3")}
        startFrom={60}
        playbackRate={1.06}
        volume={(frame) => (frame >= 45 ? 0.88 : 1)}
      />
    </Sequence>
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
