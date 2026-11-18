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

const GlassesShatter = () => {
  const frame = useCurrentFrame();
  const start = 180; // 6 seconds, after the close-up begins
  const t = Math.max(0, frame - start);
  const visible = frame >= start && frame <= start + 24;
  const opacity = interpolate(t, [0, 3, 18, 24], [0, 1, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shards = [
    { x: -42, y: -18, dx: -90, dy: -65, r: -55 },
    { x: -20, y: 8, dx: -48, dy: 82, r: -110 },
    { x: 5, y: -28, dx: 8, dy: -105, r: 70 },
    { x: 28, y: 4, dx: 75, dy: -70, r: 125 },
    { x: 48, y: 22, dx: 110, dy: 42, r: 80 },
    { x: 12, y: 30, dx: 38, dy: 112, r: -85 },
    { x: -55, y: 25, dx: -112, dy: 35, r: 45 },
    { x: 0, y: 0, dx: 0, dy: -145, r: 160 },
  ];

  if (!visible) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%" }}>
        <g transform="translate(540 850)" opacity={opacity}>
          <path
            d="M-76 0 L-42 -9 L-22 -34 L-5 -8 L18 -42 L34 -8 L75 0 M-42 -9 L-54 28 L-20 12 L-5 -8 L-2 42 L18 -8 L48 24 L75 0 M-22 -34 L-30 -62 M18 -42 L38 -68 M-54 28 L-72 48 M48 24 L66 48"
            fill="none"
            stroke="rgba(225,245,255,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {shards.map((s, i) => {
            const progress = interpolate(t, [0, 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const x = s.x + s.dx * progress;
            const y = s.y + s.dy * progress + 35 * progress * progress;
            const rotate = s.r * progress;
            return (
              <polygon
                key={i}
                points="-10,-7 12,-5 4,11"
                transform={`translate(${x} ${y}) rotate(${rotate})`}
                fill="rgba(205,235,255,0.62)"
                stroke="rgba(245,252,255,0.95)"
                strokeWidth="1.5"
              />
            );
          })}
        </g>
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
      <GlassesShatter />
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
