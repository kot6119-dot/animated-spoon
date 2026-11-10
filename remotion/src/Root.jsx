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

// A fully synthetic 10-second animation: diamonds gradually disappear beneath
// a rising, dark-blue water layer. This is an original graphic composition,
// independent from the two approved footage-based compositions.
const WaterHidesDiamonds = () => {
  const frame = useCurrentFrame();
  const waterY = interpolate(frame, [0, 35, 150, 240, 300], [790, 770, 510, 265, 235], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const diamondOpacity = interpolate(frame, [0, 125, 245, 300], [1, 1, 0.16, 0.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const diamondBlur = interpolate(frame, [0, 150, 270, 300], [0, 0.3, 3.2, 4.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glint = interpolate(frame, [0, 60, 115, 185, 245], [0.85, 0.45, 0.9, 0.38, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const waterOpacity = interpolate(frame, [0, 25, 90, 300], [0.04, 0.14, 0.48, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave = Math.sin(frame * 0.075) * 9 + Math.sin(frame * 0.031) * 5;

  const Diamond = ({ x, y, scale = 1, rotation = 0 }) => (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      <g filter={`url(#diamondSoftness)`}>
        <polygon points="0,-92 66,-42 48,48 0,88 -48,48 -66,-42" fill="#d9f5ff" stroke="#ffffff" strokeWidth="4" />
        <polygon points="0,-92 0,0 -66,-42" fill="#ffffff" opacity="0.95" />
        <polygon points="0,-92 66,-42 0,0" fill="#8edcff" opacity="0.9" />
        <polygon points="-66,-42 0,0 -48,48" fill="#75b9df" opacity="0.82" />
        <polygon points="66,-42 0,0 48,48" fill="#f7fdff" opacity="0.88" />
        <polygon points="-48,48 0,0 0,88" fill="#b8e9ff" opacity="0.9" />
        <polygon points="48,48 0,0 0,88" fill="#5799c5" opacity="0.72" />
        <path d="M-54 -43 L0 -80 L52 -43 M-42 46 L0 72 L42 46" fill="none" stroke="#ffffff" strokeWidth="5" opacity="0.85" />
      </g>
    </g>
  );

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 38%, #203c52 0%, #0b1722 55%, #05090e 100%)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="waterBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9eaff" stopOpacity="0.55" />
            <stop offset="18%" stopColor="#3b91bd" stopOpacity="0.46" />
            <stop offset="100%" stopColor="#071d30" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="surfaceLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b8f1ff" stopOpacity="0" />
            <stop offset="25%" stopColor="#d9f8ff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#8bdcff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#b8f1ff" stopOpacity="0" />
          </linearGradient>
          <filter id="waterGlow" x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="diamondSoftness">
            <feGaussianBlur stdDeviation={diamondBlur} />
          </filter>
          <clipPath id="underwaterClip">
            <rect x="0" y={waterY + 8} width="1920" height={1080 - waterY} />
          </clipPath>
        </defs>

        <ellipse cx="960" cy="850" rx="620" ry="110" fill="#6bbfe5" opacity="0.09" filter="url(#waterGlow)" />

        <g opacity={diamondOpacity}>
          <Diamond x={650} y={720} scale={0.9} rotation={-8} />
          <Diamond x={960} y={700} scale={1.18} rotation={5} />
          <Diamond x={1260} y={730} scale={0.82} rotation={-4} />
        </g>

        <g clipPath="url(#underwaterClip)" opacity={waterOpacity}>
          <rect x="0" y={waterY} width="1920" height={1080 - waterY} fill="url(#waterBody)" />
          <g opacity={0.28}>
            <Diamond x={650} y={720} scale={0.9} rotation={-8} />
            <Diamond x={960} y={700} scale={1.18} rotation={5} />
            <Diamond x={1260} y={730} scale={0.82} rotation={-4} />
          </g>
        </g>

        <path d={`M0 ${waterY + wave} C280 ${waterY - 16 + wave}, 470 ${waterY + 18 + wave}, 720 ${waterY + wave} S1190 ${waterY - 18 + wave}, 1450 ${waterY + wave} S1740 ${waterY - 12 + wave}, 1920 ${waterY + wave}`} fill="none" stroke="#bcefff" strokeWidth="24" opacity={0.24 + waterOpacity * 0.35} filter="url(#waterGlow)" />
        <path d={`M0 ${waterY + wave} C280 ${waterY - 16 + wave}, 470 ${waterY + 18 + wave}, 720 ${waterY + wave} S1190 ${waterY - 18 + wave}, 1450 ${waterY + wave} S1740 ${waterY - 12 + wave}, 1920 ${waterY + wave}`} fill="none" stroke="url(#surfaceLine)" strokeWidth="5" opacity="0.95" />

        <g opacity={glint * diamondOpacity}>
          <path d="M940 585 l20 -42 l20 42 l-20 42 z" fill="#ffffff" opacity="0.82" />
          <path d="M625 630 l12 -26 l12 26 l-12 26 z" fill="#d9f7ff" opacity="0.72" />
          <path d="M1260 640 l15 -32 l15 32 l-15 32 z" fill="#ffffff" opacity="0.68" />
        </g>

        <g opacity={interpolate(frame, [210, 300], [0.16, 0.025], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <path d="M0 900 Q260 880 520 900 T1040 900 T1560 900 T2080 900" fill="none" stroke="#9edfff" strokeWidth="2" opacity="0.35" />
        </g>
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
