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
const SHAKE_DURATION = 17; // about 0.57 seconds

const Main = () => {
  const frame = useCurrentFrame();
  const shakeFrame = frame - SHAKE_START;
  const progress = interpolate(
    shakeFrame,
    [0, 3, 10, SHAKE_DURATION],
    [1, 0.72, 0.32, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const intensity = 22 * progress;
  const translateX =
    (Math.sin(shakeFrame * 3.1) + Math.cos(shakeFrame * 1.7) * 0.6) * intensity;
  const translateY =
    (Math.cos(shakeFrame * 2.8) * 0.9 + Math.sin(shakeFrame * 1.9) * 0.5) * intensity;
  const rotate = Math.sin(shakeFrame * 2.4) * intensity * 0.35;
  const scale = interpolate(
    shakeFrame,
    [0, 3, 10, SHAKE_DURATION],
    [1.07, 1.06, 1.03, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
