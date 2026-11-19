import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
} from "remotion";

const FPS = 30;
const DURATION_IN_FRAMES = 154;

// Keep the existing picture offset, pause, and slight second-line speed-up.
// Smooth the small volume reduction so it does not happen as a sudden step.
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

    <Sequence from={60}>
      <Audio
        src={staticFile("videos/content 6.mp3")}
        startFrom={60}
        playbackRate={1.06}
        volume={(frame) =>
          interpolate(frame, [42, 48], [1, 0.88], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
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
