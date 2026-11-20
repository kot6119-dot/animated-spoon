import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";

const videoSrc = staticFile("videos/content 11.mp4");
const SHAKE_START = 153; // 5.1 seconds at 30 fps
const SHAKE_DURATION = 14; // about 0.47 seconds

const Main = () => {
  const frame = useCurrentFrame();
  const shakeFrame = frame - SHAKE_START;
  const active = shakeFrame >= 0 && shakeFrame < SHAKE_DURATION;
  const motionFrame = Math.max(0, shakeFrame);
  const progress = active
    ? interpolate(
        motionFrame,
        [0, 2, 8, SHAKE_DURATION],
        [1, 0.82, 0.38, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  // About 1.8x the previous camera movement, for a clearly readable jolt.
  const intensity = 40 * progress;
  const translateX =
    (Math.sin(motionFrame * 3.1) + Math.cos(motionFrame * 1.7) * 0.6) * intensity;
  const translateY =
    (Math.cos(motionFrame * 2.8) * 0.9 + Math.sin(motionFrame * 1.9) * 0.5) * intensity;
  const rotate = Math.sin(motionFrame * 2.4) * intensity * 0.06;
  const scale = active
    ? interpolate(
        motionFrame,
        [0, 2, 8, SHAKE_DURATION],
        [1.20, 1.18, 1.12, 1.08],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={videoSrc}
        volume={1}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
    calculateMetadata={async () => {
      const metadata = await getVideoMetadata(videoSrc);
      return {
        durationInFrames: Math.max(1, Math.ceil(metadata.durationInSeconds * 30)),
      };
    }}
  />
);
