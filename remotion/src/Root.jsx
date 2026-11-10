import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";

const BottleScan = () => {
  const frame = useCurrentFrame();
  // A restrained scan, travelling down the bottle over the five-second shot.
  const y = interpolate(frame, [8, 138], [225, 815], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.78 + 0.12 * Math.sin(frame * 0.16);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="scanFade" x1="0" x2="1">
            <stop offset="0%" stopColor="#8beaff" stopOpacity="0" />
            <stop offset="16%" stopColor="#b9f5ff" stopOpacity="0.72" />
            <stop offset="50%" stopColor="#f3ffff" stopOpacity="1" />
            <stop offset="84%" stopColor="#b9f5ff" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#8beaff" stopOpacity="0" />
          </linearGradient>
          <filter id="scanGlow" x="-80%" y="-500%" width="260%" height="1100%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <line
          x1="790" y1={y} x2="1130" y2={y}
          stroke="#57dfff" strokeWidth="13" opacity={0.24 * pulse}
          filter="url(#scanGlow)" strokeLinecap="round"
        />
        <line
          x1="790" y1={y} x2="1130" y2={y}
          stroke="url(#scanFade)" strokeWidth="2.2" opacity={pulse}
          strokeLinecap="round"
        />
        <line
          x1="835" y1={y - 1} x2="1085" y2={y - 1}
          stroke="#f2ffff" strokeWidth="0.8" opacity="0.9"
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};

const BottleFilm = () => (
  <AbsoluteFill style={{ backgroundColor: "#080808" }}>
    <Sequence from={0} durationInFrames={150}>
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile("videos/01-bottle-scan.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
        <BottleScan />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={150} durationInFrames={240}>
      <OffthreadVideo
        src={staticFile("videos/02-diamonds-spill.mov")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <Composition
    id="BottleFilm"
    component={BottleFilm}
    durationInFrames={390}
    fps={30}
    width={1920}
    height={1080}
  />
);
