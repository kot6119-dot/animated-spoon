import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Img,
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
          x1="680" y1={y} x2="970" y2={y}
          stroke="#43d9ff" strokeWidth="22" opacity={0.34 * pulse}
          filter="url(#laserGlow)" strokeLinecap="round"
        />
        <line
          x1="680" y1={y} x2="970" y2={y}
          stroke="url(#laserFade)" strokeWidth="4" opacity={pulse}
          strokeLinecap="round"
        />
        <line
          x1="710" y1={y - 1} x2="940" y2={y - 1}
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

// Separate restrained treatment for the original diamonds footage.
const DiamondsPolish = () => (
  <AbsoluteFill style={{ backgroundColor: "#080808" }}>
    <OffthreadVideo
      src={staticFile("videos/02-diamonds-spill.mov")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        filter: "brightness(1.12) contrast(1.05) saturate(1.03)",
      }}
    />
  </AbsoluteFill>
);

// Third scene: the uploaded diamond photograph with a rising animated water layer.
const WaterHidesDiamonds = () => {
  const frame = useCurrentFrame();
  const waterY = interpolate(frame, [0, 35, 150, 240, 300], [930, 900, 650, 390, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave = Math.sin(frame * 0.075) * 8 + Math.sin(frame * 0.031) * 5;
  const waterOpacity = interpolate(frame, [0, 25, 90, 300], [0.02, 0.12, 0.34, 0.58], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underwaterBlur = interpolate(frame, [0, 120, 260, 300], [0, 0.4, 2.2, 2.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underwaterBrightness = interpolate(frame, [0, 120, 300], [1, 0.92, 0.78], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#03070d" }}>
      <Img
        src={staticFile("images/diamonds-for-remotion.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          clipPath: `inset(${waterY}px 0 0 0)`,
          filter: `blur(${underwaterBlur}px) brightness(${underwaterBrightness}) saturate(0.82)`,
          transform: "scale(1.006)",
        }}
      >
        <Img
          src={staticFile("images/diamonds-for-remotion.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="waterBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9efff" stopOpacity="0.34" />
            <stop offset="22%" stopColor="#3e9bc4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#061c30" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="surfaceLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c9f5ff" stopOpacity="0" />
            <stop offset="22%" stopColor="#e9fcff" stopOpacity="0.95" />
            <stop offset="76%" stopColor="#8bdfff" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#b8f1ff" stopOpacity="0" />
          </linearGradient>
          <filter id="waterGlow" x="-30%" y="-100%" width="160%" height="300%">
            <feGaussianBlur stdDeviation="15" />
          </filter>
          <clipPath id="waterClip">
            <rect x="0" y={waterY} width="1920" height={1080 - waterY} />
          </clipPath>
        </defs>
        <g clipPath="url(#waterClip)" opacity={waterOpacity}>
          <rect x="0" y={waterY} width="1920" height={1080 - waterY} fill="url(#waterBody)" />
          <path d={`M0 ${waterY + 42} Q320 ${waterY + 12} 640 ${waterY + 42} T1280 ${waterY + 42} T1920 ${waterY + 42}`} fill="none" stroke="#d7f7ff" strokeWidth="3" opacity="0.22" />
        </g>
        <path
          d={`M0 ${waterY + wave} C280 ${waterY - 15 + wave}, 470 ${waterY + 17 + wave}, 720 ${waterY + wave} S1190 ${waterY - 17 + wave}, 1450 ${waterY + wave} S1740 ${waterY - 11 + wave}, 1920 ${waterY + wave}`}
          fill="none" stroke="#a9eaff" strokeWidth="24" opacity={0.2 + waterOpacity * 0.34} filter="url(#waterGlow)"
        />
        <path
          d={`M0 ${waterY + wave} C280 ${waterY - 15 + wave}, 470 ${waterY + 17 + wave}, 720 ${waterY + wave} S1190 ${waterY - 17 + wave}, 1450 ${waterY + wave} S1740 ${waterY - 11 + wave}, 1920 ${waterY + wave}`}
          fill="none" stroke="url(#surfaceLine)" strokeWidth="5" opacity="0.96"
        />
      </svg>
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <>
    <Composition id="BottleScanOnly" component={BottleScanOnly} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="DiamondsPolish" component={DiamondsPolish} durationInFrames={180} fps={30} width={1920} height={1080} />
    <Composition id="WaterHidesDiamonds" component={WaterHidesDiamonds} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
