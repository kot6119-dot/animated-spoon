import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";

const BottleScan = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [5, 145], [105, 875], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.9 + 0.1 * Math.sin(frame * 0.18);

  return (
    <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none" }}>
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="laserFade" x1="0" x2="1">
            <stop offset="0%" stopColor="#74ddff" stopOpacity="0" />
            <stop offset="12%" stopColor="#a9edff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="88%" stopColor="#a9edff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#74ddff" stopOpacity="0" />
          </linearGradient>
          <filter id="laserGlow" x="-100%" y="-900%" width="300%" height="1900%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <line
          x1="790" y1={y} x2="1130" y2={y}
          stroke="#43d9ff" strokeWidth="22" opacity={0.34 * pulse}
          filter="url(#laserGlow)" strokeLinecap="round"
        />
        <line
          x1="790" y1={y} x2="1130" y2={y}
          stroke="url(#laserFade)" strokeWidth="4" opacity={pulse}
          strokeLinecap="round"
        />
        <line
          x1="825" y1={y - 1} x2="1095" y2={y - 1}
          stroke="#ffffff" strokeWidth="1.5" opacity="0.95"
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};

const BottleScanOnly = () => (
  <AbsoluteFill style={{ backgroundColor: "#080808" }}>
    <OffthreadVideo
      src={staticFile("videos/01-bottle-scan.mp4")}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
    <BottleScan />
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <Composition
    id="BottleScanOnly"
    component={BottleScanOnly}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
);
