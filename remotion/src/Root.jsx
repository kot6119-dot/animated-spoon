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

// Third scene: clear rising water, diamonds fading with depth, and restrained reflected light.
const WaterHidesDiamonds = () => {
  const frame = useCurrentFrame();
  const waterY = interpolate(frame, [0, 35, 150, 240, 300], [930, 880, 560, 260, 65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wave = Math.sin(frame * 0.075) * 6 + Math.sin(frame * 0.031) * 4;
  const immersion = interpolate(frame, [0, 45, 150, 240, 300], [0, 0.18, 0.48, 0.78, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const underwaterBlur = interpolate(frame, [0, 100, 220, 300], [0, 0.25, 1.1, 1.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const reflectionPulse = 0.72 + 0.18 * Math.sin(frame * 0.13);
  const reflectionDrift = (frame * 3.1) % 620;

  return (
    <AbsoluteFill style={{ backgroundColor: "#03070d" }}>
      <Img
        src={staticFile("images/diamonds-for-remotion.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          clipPath: `inset(${waterY}px 0 0 0)`,
          filter: `blur(${underwaterBlur}px) saturate(0.72)`,
        }}
      >
        <Img
          src={staticFile("images/diamonds-for-remotion.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9) contrast(0.88)" }}
        />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="depthFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#07131d" stopOpacity={0.12 + immersion * 0.12} />
              <stop offset="28%" stopColor="#07131d" stopOpacity={0.22 + immersion * 0.22} />
              <stop offset="65%" stopColor="#030910" stopOpacity={0.42 + immersion * 0.32} />
              <stop offset="100%" stopColor="#02060b" stopOpacity={0.58 + immersion * 0.34} />
            </linearGradient>
            <linearGradient id="clearWaterTint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b9efff" stopOpacity="0.055" />
              <stop offset="100%" stopColor="#3b8eb5" stopOpacity="0.035" />
            </linearGradient>
          </defs>
          <rect x="0" y={waterY} width="1920" height={1080 - waterY} fill="url(#depthFade)" />
          <rect x="0" y={waterY} width="1920" height={1080 - waterY} fill="url(#clearWaterTint)" />
        </svg>
      </AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="surfaceLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e9fbff" stopOpacity="0" />
            <stop offset="18%" stopColor="#ffffff" stopOpacity="0.78" />
            <stop offset="52%" stopColor="#c9f4ff" stopOpacity="0.92" />
            <stop offset="84%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d8f7ff" stopOpacity="0" />
          </linearGradient>
          <filter id="surfaceGlow" x="-30%" y="-180%" width="160%" height="460%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="diamondReflectionBlur" x="-50%" y="-250%" width="200%" height="600%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
          <linearGradient id="diamondReflection" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="45%" stopColor="#f4fdff" stopOpacity="0.9" />
            <stop offset="56%" stopColor="#bdefff" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M0 ${waterY + wave} C280 ${waterY - 12 + wave}, 470 ${waterY + 15 + wave}, 720 ${waterY + wave} S1190 ${waterY - 13 + wave}, 1450 ${waterY + wave} S1740 ${waterY - 8 + wave}, 1920 ${waterY + wave}`}
          fill="none" stroke="#c9f4ff" strokeWidth="22" opacity="0.16" filter="url(#surfaceGlow)"
        />
        <path
          d={`M0 ${waterY + wave} C280 ${waterY - 12 + wave}, 470 ${waterY + 15 + wave}, 720 ${waterY + wave} S1190 ${waterY - 13 + wave}, 1450 ${waterY + wave} S1740 ${waterY - 8 + wave}, 1920 ${waterY + wave}`}
          fill="none" stroke="url(#surfaceLine)" strokeWidth="3.5" opacity="0.9"
        />
        <g opacity={immersion * reflectionPulse}>
          <path d={`M${160 + reflectionDrift * 0.22} ${waterY + wave - 5} q70 -9 145 1`} stroke="url(#diamondReflection)" strokeWidth="5" fill="none" filter="url(#diamondReflectionBlur)" />
          <path d={`M${720 + reflectionDrift * 0.13} ${waterY + wave + 2} q95 -12 190 0`} stroke="url(#diamondReflection)" strokeWidth="4" fill="none" filter="url(#diamondReflectionBlur)" />
          <path d={`M${1330 - reflectionDrift * 0.16} ${waterY + wave - 3} q62 -8 132 1`} stroke="url(#diamondReflection)" strokeWidth="4.5" fill="none" filter="url(#diamondReflectionBlur)" />
        </g>
        <g opacity={0.16 + immersion * 0.22}>
          <path d={`M${300 + reflectionDrift * 0.18} ${waterY + wave - 1} l42 -3`} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <path d={`M${1080 - reflectionDrift * 0.12} ${waterY + wave + 3} l58 -4`} stroke="#e9fbff" strokeWidth="1.8" strokeLinecap="round" />
          <path d={`M${1600 + reflectionDrift * 0.08} ${waterY + wave - 2} l36 -2`} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};


const SmartphoneNotification = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [154, 170, 210], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(frame, [154, 170], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const screenDim = interpolate(frame, [145, 165], [0, 0.38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      <OffthreadVideo
        src={staticFile("videos/I2V Камера плавно прибли_11-10_23_04_17.mp4")}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "brightness(0.94) contrast(1.04) saturate(0.96)",
        }}
      />
      {/* A restrained dark glass layer tames the over-bright final display without dimming the whole shot. */}
      <div
        style={{
          position: "absolute",
          left: "38.8%",
          top: "15.5%",
          width: "22.4%",
          height: "69%",
          borderRadius: 44,
          background: "#03070d",
          opacity: screenDim,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "39.5%",
          top: "28%",
          width: "21%",
          minHeight: "43%",
          boxSizing: "border-box",
          padding: "2.1% 1.45%",
          borderRadius: 28,
          background: "linear-gradient(145deg, rgba(24,29,36,0.96), rgba(7,10,15,0.94))",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.12)",
          color: "#f7f8fa",
          fontFamily: "Arial, Helvetica, sans-serif",
          opacity: fade,
          transform: `translateY(${rise}px)`,
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #c43a32, #761d1b)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#fff",
          }}>!</div>
          <div style={{ fontSize: 19, letterSpacing: 1.7, fontWeight: 700, color: "#f0c77a" }}>
            BREAKING NEWS
          </div>
          <div style={{ marginLeft: "auto", fontSize: 14, color: "rgba(255,255,255,0.58)" }}>СЕЙЧАС</div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.16)", marginBottom: 22 }} />
        <div style={{ fontSize: 30, lineHeight: 1.05, fontWeight: 800, color: "#fff", marginBottom: 18 }}>
          СРОЧНО!
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.18, fontWeight: 700, color: "#f2f3f5", marginBottom: 14 }}>
          АЭРОПОРТ ШЕРЕМЕТЬЕВО
        </div>
        <div style={{ fontSize: 20, lineHeight: 1.25, color: "rgba(255,255,255,0.86)", marginBottom: 18 }}>
          ОБНАРУЖЕНА КОНТРАБАНДА
        </div>
        <div style={{ fontSize: 29, lineHeight: 1.1, fontWeight: 800, color: "#f0c77a" }}>
          НА 2 000 000 $
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <>
    <Composition id="BottleScanOnly" component={BottleScanOnly} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="DiamondsPolish" component={DiamondsPolish} durationInFrames={180} fps={30} width={1920} height={1080} />
    <Composition id="WaterHidesDiamonds" component={WaterHidesDiamonds} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="SmartphoneNotification" component={SmartphoneNotification} durationInFrames={210} fps={30} width={1920} height={1080} />
  </>
);
