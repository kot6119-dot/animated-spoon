import { ImperialLuxeReel, IMPERIAL_LUXE_REEL_DURATION } from "./ImperialLuxeReel";
import React from "react";
import { Video } from "@remotion/media";
import { shatter } from "@remotion/effects/shatter";
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
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
      playbackRate={0.87}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        filter: "brightness(1.07) contrast(1.12) saturate(1.08) sepia(0.035)",
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
          filter: `blur(${underwaterBlur}px) saturate(0.82) brightness(1.04)`,
        }}
      >
        <Img
          src={staticFile("images/diamonds-for-remotion.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.98) contrast(0.86)" }}
        />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="depthFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#07131d" stopOpacity={0.07 + immersion * 0.08} />
              <stop offset="28%" stopColor="#07131d" stopOpacity={0.14 + immersion * 0.14} />
              <stop offset="65%" stopColor="#030910" stopOpacity={0.30 + immersion * 0.24} />
              <stop offset="100%" stopColor="#02060b" stopOpacity={0.42 + immersion * 0.28} />
            </linearGradient>
            <linearGradient id="clearWaterTint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b9efff" stopOpacity="0.075" />
              <stop offset="100%" stopColor="#3b8eb5" stopOpacity="0.055" />
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
  const fade = interpolate(frame, [154, 170, 205], [0, 1, 1], {
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
      {/* One understated phone notification, angled to follow the handset. */}
      <div
        style={{
          position: "absolute",
          left: "36.5%",
          top: "30.5%",
          width: "27%",
          minHeight: "29%",
          boxSizing: "border-box",
          padding: "1.35% 1.55%",
          borderRadius: 24,
          background: "rgba(25, 29, 35, 0.91)",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
          color: "#f7f8fa",
          fontFamily: "Arial, Helvetica, sans-serif",
          opacity: fade,
          transform: "rotate(24deg)",
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: "#b93630",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 700, color: "#fff",
          }}>!</div>
          <div style={{ fontSize: 16, letterSpacing: 0.8, fontWeight: 700, color: "#f0c77a" }}>
            BREAKING NEWS
          </div>
          <div style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.62)" }}>СЕЙЧАС</div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.15)", marginBottom: 13 }} />
        <div style={{ fontSize: 25, lineHeight: 1.08, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
          СРОЧНО!
        </div>
        <div style={{ fontSize: 19, lineHeight: 1.18, fontWeight: 700, color: "#f2f3f5", marginBottom: 8 }}>
          АЭРОПОРТ ШЕРЕМЕТЬЕВО
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.2, color: "rgba(255,255,255,0.88)", marginBottom: 10 }}>
          ОБНАРУЖЕНА КОНТРАБАНДА
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.08, fontWeight: 800, color: "#f0c77a" }}>
          НА 2 000 000 $
        </div>
      </div>
    </AbsoluteFill>
  );
};


const LightningStrike = () => {
  const frame = useCurrentFrame();
  const pulse = (start, peak, end) => {
    if (frame < start || frame > end) return 0;
    if (frame <= peak) return (frame - start) / Math.max(1, peak - start);
    return (end - frame) / Math.max(1, end - peak);
  };
  const hit = Math.max(
    pulse(18, 20, 25),
    pulse(67, 69, 75),
    pulse(116, 118, 125)
  );
  const secondary = Math.max(
    pulse(22, 23, 26) * 0.7,
    pulse(71, 72, 76) * 0.55,
    pulse(120, 121, 126) * 0.65
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}>
        <defs>
          <filter id="stormGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="boltGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <radialGradient id="stormFlash">
            <stop offset="0%" stopColor="#d8eaff" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#8db8e8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#315078" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="#18283c" opacity={0.12 + hit * 0.12} />
        <ellipse cx="1410" cy="180" rx="440" ry="310" fill="url(#stormFlash)" opacity={hit} />
        <g opacity={hit}>
          <path d="M1250 0 L1281 42 L1260 67 L1310 91 L1292 119 L1348 143 L1330 161 L1412 180"
            fill="none" stroke="#9bcaff" strokeWidth="25" strokeLinejoin="bevel"
            filter="url(#stormGlow)" />
          <path d="M1250 0 L1281 42 L1260 67 L1310 91 L1292 119 L1348 143 L1330 161 L1412 180"
            fill="none" stroke="#d9edff" strokeWidth="8" strokeLinejoin="bevel" />
          <path d="M1308 91 L1360 79 L1381 102 L1402 96"
            fill="none" stroke="#c7e3ff" strokeWidth="4" />
          <path d="M1348 143 L1390 132 L1412 149 L1438 145"
            fill="none" stroke="#ffffff" strokeWidth="3.5" />
          <path d="M1278 42 L1235 57 L1218 83"
            fill="none" stroke="#c7e3ff" strokeWidth="3" />
        </g>
        <g opacity={secondary}>
          <path d="M1515 0 L1492 39 L1510 62 L1470 91 L1485 117 L1440 151 L1412 180"
            fill="none" stroke="#b8d9ff" strokeWidth="17" filter="url(#boltGlow)" />
          <path d="M1515 0 L1492 39 L1510 62 L1470 91 L1485 117 L1440 151 L1412 180"
            fill="none" stroke="#eef7ff" strokeWidth="5" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};


const ThirdSceneCatMusicTest = () => {
  const frame = useCurrentFrame();
  const seconds = frame / 30;

  // The original scene audio is quiet until 5.53s, then the cat speaks
  // through approximately 8.78s. Keep music at 60% under the voice,
  // then restore its normal level. The music loops, but the composition
  // duration remains tied to the original picture (269 frames / 8.967s).
  const musicVolume = seconds < 5.48
    ? 1
    : seconds < 5.58
      ? interpolate(seconds, [5.48, 5.58], [1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : seconds < 8.72
        ? 0.6
        : seconds < 8.82
          ? interpolate(seconds, [8.72, 8.82], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("videos/03-scena-tretya.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {/* First play: fade out during the 0.4s overlap. */}
      <Audio
        src={staticFile("videos/Сцена вторая.mp3")}
        volume={(f) => musicVolume * (f < 139 ? 1 : interpolate(f, [139, 151], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
      />
      {/* Second play starts 0.4s before the first ends, with a matching fade-in. */}
      <Sequence from={139} durationInFrames={130}>
        <Audio
          src={staticFile("videos/Сцена вторая.mp3")}
          volume={(f) => musicVolume * interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const FirstSceneVideoTest = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <OffthreadVideo
      src={staticFile("videos/01-pervaya-scena-jaguar.mp4")}
      muted
      style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0.88) contrast(1.08) saturate(0.9)" }}
    />
    <LightningStrike />
  </AbsoluteFill>
);


const GlassesShatterTest = () => {
  const frame = useCurrentFrame();

  // Three short, side-by-side-in-time experiments. The source video stays
  // untouched underneath; only small lens-shaped windows receive shatter.
  const variants = [
    { from: 150, to: 179, radius: 0.045, strength: 2.4, repetitions: 18, seed: 73, label: "TEST 1: tight / gentle" },
    { from: 180, to: 209, radius: 0.060, strength: 3.2, repetitions: 28, seed: 89, label: "TEST 2: medium" },
    { from: 210, to: 239, radius: 0.075, strength: 4.1, repetitions: 38, seed: 97, label: "TEST 3: wider / stronger" },
  ];

  const activeVariant = variants.find((v) => frame >= v.from && frame <= v.to) ?? variants[0];
  const localFrame = Math.max(0, Math.min(29, frame - activeVariant.from));
  const effectTime = interpolate(localFrame, [0, 29], [0, 0.96], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visible = frame >= activeVariant.from && frame <= activeVariant.to ? 1 : 0;

  const lenses = [
    { center: [0.455, 0.285], seedOffset: 0 },
    { center: [0.545, 0.285], seedOffset: 1 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Video
        src={staticFile("videos/content 3.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {lenses.map(({ center, seedOffset }) => (
        <Video
          key={seedOffset}
          src={staticFile("videos/content 3.mp4")}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: visible,
            // Isolate each lens from the rest of the duplicate full-frame video.
            clipPath: `ellipse(3.1% 2.7% at ${center[0] * 100}% ${center[1] * 100}%)`,
          }}
          effects={[
            shatter({
              time: effectTime,
              pattern: "glass",
              repetitions: activeVariant.repetitions,
              center,
              radius: activeVariant.radius,
              strength: activeVariant.strength,
              rotationSpeed: 0.18,
              randomness: 0.16,
              viscosity: 0.12,
              gravity: 1.25,
              extrusionDepth: 0.018,
              seed: activeVariant.seed + seedOffset,
            }),
          ]}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 28,
          padding: "10px 16px",
          borderRadius: 8,
          backgroundColor: "rgba(0,0,0,0.72)",
          color: "#fff",
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          letterSpacing: 1,
        }}
      >
        {activeVariant.label}
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <>
    <Composition id="GlassesShatterTest" component={GlassesShatterTest} durationInFrames={240} fps={30} width={1920} height={1080} />
    <Composition id="ThirdSceneCatMusicTest" component={ThirdSceneCatMusicTest} durationInFrames={269} fps={30} width={1920} height={1080} />
    <Composition id="FirstSceneVideoTest" component={FirstSceneVideoTest} durationInFrames={153} fps={30} width={1920} height={1080} />
    <Composition id="ImperialLuxeReel" component={ImperialLuxeReel} durationInFrames={IMPERIAL_LUXE_REEL_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="BottleScanOnly" component={BottleScanOnly} durationInFrames={150} fps={30} width={1920} height={1080} />
    <Composition id="DiamondsPolish" component={DiamondsPolish} durationInFrames={180} fps={30} width={1920} height={1080} />
    <Composition id="WaterHidesDiamonds" component={WaterHidesDiamonds} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="SmartphoneNotification" component={SmartphoneNotification} durationInFrames={210} fps={30} width={1920} height={1080} />
  </>
);
