import React from "react";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Video } from "@remotion/media";
import { shatter } from "@remotion/effects/shatter";

const FPS = 30;
const DURATION = 8 * FPS;

// The source video is 910x512, displayed centered inside the 1080x1920
// composition. The close-up puts the glasses around 19% down the source frame.
const VIDEO_TOP = (1920 - 1080 * (512 / 910)) / 2;
const VIDEO_HEIGHT = 1080 * (512 / 910);

const GlassesShatter = ({ src }) => {
  const frame = useCurrentFrame();
  const startFrame = 180; // Begin after the close-up has settled.
  const elapsed = Math.max(0, frame - startFrame);

  if (frame < startFrame || frame > startFrame + 36) {
    return null;
  }

  const time = interpolate(elapsed, [0, 36], [0, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: VIDEO_TOP,
        width: 1080,
        height: VIDEO_HEIGHT,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <Video
        src={src}
        muted
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        effects={[
          shatter({
            time,
            pattern: "glass",
            repetitions: 48,
            center: [0.5, 0.19],
            radius: 0.13,
            depth: 0.02,
            strength: 5.5,
            rotationSpeed: 0.28,
            randomness: 0.16,
            viscosity: 0.08,
            massVariance: 0.32,
            gravity: 2.2,
            seed: 67,
            extrusionDepth: 0.12,
          }),
        ]}
      />
    </div>
  );
};

const Main = () => {
  const video = staticFile("videos/content 3.mp4");

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <Video
        src={video}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(42px) brightness(0.38)",
          transform: "scale(1.16)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Video
          src={video}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </AbsoluteFill>
      <GlassesShatter src={video} />
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
