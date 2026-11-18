import React from "react";
import {
  AbsoluteFill,
  Composition,
  Video,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";

const FPS = 30;
const DURATION = 8 * FPS;

const SoundWave = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        viewBox="0 0 1080 1920"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {[0, 1, 2, 3].map((index) => {
          const start = 54 + index * 11;
          const progress = interpolate(
            frame,
            [start, start + 58],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const fade = interpolate(
            frame,
            [start, start + 12, start + 48, start + 58],
            [0, 0.72, 0.5, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <g key={index} opacity={fade}>
              <ellipse
                cx="540"
                cy="960"
                rx={80 + progress * 760}
                ry={36 + progress * 470}
                fill="none"
                stroke="#d9f4ff"
                strokeWidth={5 - progress * 2}
                opacity="0.85"
              />
              <ellipse
                cx="540"
                cy="960"
                rx={105 + progress * 790}
                ry={48 + progress * 500}
                fill="none"
                stroke="#8edcff"
                strokeWidth="2"
                opacity="0.55"
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
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
      <SoundWave />
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
