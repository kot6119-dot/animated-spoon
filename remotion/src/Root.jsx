import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";

const videoSrc = staticFile("videos/final-video-iPhone-compatible 3.MP4");
const effectSrc = staticFile("videos/cow_glass_bright_siren_very_low.mp3");

const SHAKE_DURATION = 36; // first 1.2 seconds at 30 fps

const Main = () => {
  const frame = useCurrentFrame();
  const active = frame >= 0 && frame < SHAKE_DURATION;
  const progress = active
    ? interpolate(frame, [0, 3, 18, SHAKE_DURATION], [0.45, 1, 0.55, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Subtle opening jolt, fading smoothly during the first 1.2 seconds.
  const intensity = 11 * progress;
  const translateX =
    (Math.sin(frame * 2.7) + Math.cos(frame * 1.6) * 0.45) * intensity;
  const translateY =
    (Math.cos(frame * 2.3) * 0.75 + Math.sin(frame * 1.8) * 0.35) * intensity;
  const rotate = Math.sin(frame * 2.1) * intensity * 0.035;
  const scale = active
    ? interpolate(frame, [0, 3, 18, SHAKE_DURATION], [1.045, 1.05, 1.035, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
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
      <Audio src={effectSrc} volume={1} />
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
