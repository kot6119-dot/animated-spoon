import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, useCurrentFrame, staticFile } from "remotion";

const TRANSITION = 12;
const DIAMOND_TRANSITION = 15; // 0.5s soft dissolve, matching the Grok review
const PHONE_TRANSITION = 17; // ~0.57s soft dissolve into the phone
const SCENE_1 = 150;
const SCENE_2 = 207; // 99 frames normal, then the diamond spill slowed to 0.75x
const SCENE_3 = 281; // the final water movement is slightly accelerated
const SCENE_4 = 210;
const START_2 = SCENE_1 - TRANSITION;
const START_3 = START_2 + SCENE_2 - DIAMOND_TRANSITION;
const START_4 = START_3 + SCENE_3 - PHONE_TRANSITION;
export const IMPERIAL_LUXE_REEL_DURATION = START_4 + SCENE_4;

const ReelClip = ({ src, duration, fadeIn = true, fadeOut = true, fadeInFrames = TRANSITION, fadeOutFrames = TRANSITION, zoomIn = false, zoomOut = false, waterHighlight = false, phoneFlash = false, diamondFlash = false, playbackRate = 1, slowStartFrame = null, slowPlaybackRate = 0.75, rushTailFrom = null, rushTailRate = 1.35, videoFilter = "none", diamondVignette = false, children }) => {
  const frame = useCurrentFrame();
  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, fadeInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const fadeOutOpacity = fadeOut
    ? interpolate(frame, [duration - fadeOutFrames, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);
  let scale = 1;
  if (zoomIn) scale = interpolate(frame, [0, TRANSITION], [1.09, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (zoomOut) scale = interpolate(frame, [duration - TRANSITION, duration], [1, 1.09], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const highlight = waterHighlight
    ? interpolate(frame, [duration - PHONE_TRANSITION, duration - 5, duration], [0, 0.24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const flash = phoneFlash
    ? interpolate(frame, [0, 4, 10, PHONE_TRANSITION], [0.08, 0.22, 0.09, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const diamondGlint = diamondFlash
    ? interpolate(frame, [duration - DIAMOND_TRANSITION, duration - 8, duration], [0, 0.72, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})`, backgroundColor: "#050505" }}>
      {rushTailFrom !== null ? (
        <>
          <Sequence from={0} durationInFrames={rushTailFrom}>
            <OffthreadVideo src={staticFile(src)} muted startFrom={0} endAt={rushTailFrom} style={{ width: "100%", height: "100%", objectFit: "cover", filter: videoFilter }} />
          </Sequence>
          <Sequence from={rushTailFrom} durationInFrames={duration - rushTailFrom}>
            <OffthreadVideo src={staticFile(src)} muted startFrom={rushTailFrom} endAt={300} playbackRate={rushTailRate} style={{ width: "100%", height: "100%", objectFit: "cover", filter: videoFilter }} />
          </Sequence>
        </>
      ) : slowStartFrame === null ? (
        <OffthreadVideo src={staticFile(src)} muted playbackRate={playbackRate} style={{ width: "100%", height: "100%", objectFit: "cover", filter: videoFilter }} />
      ) : (
        <>
          <Sequence from={0} durationInFrames={slowStartFrame}>
            <OffthreadVideo src={staticFile(src)} muted startFrom={0} endAt={slowStartFrame} style={{ width: "100%", height: "100%", objectFit: "cover", filter: videoFilter }} />
          </Sequence>
          <Sequence from={slowStartFrame} durationInFrames={Math.ceil((180 - slowStartFrame) / slowPlaybackRate)}>
            <OffthreadVideo src={staticFile(src)} muted startFrom={slowStartFrame} endAt={180} playbackRate={slowPlaybackRate} style={{ width: "100%", height: "100%", objectFit: "cover", filter: videoFilter }} />
          </Sequence>
        </>
      )}
      {diamondVignette && <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 54%, rgba(0,0,0,0.20) 100%)" }} />}
      {children}
      {highlight > 0 && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(224,248,255,0.68) 0%, rgba(170,224,245,0.24) 34%, rgba(3,7,13,0) 72%)", opacity: highlight }} />}
      {diamondGlint > 0 && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 52% 48%, rgba(255,250,229,0.95) 0%, rgba(235,195,119,0.48) 12%, rgba(235,195,119,0.12) 30%, rgba(0,0,0,0) 62%)", mixBlendMode: "screen", opacity: diamondGlint }} />}
      {flash > 0 && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(255,246,220,0.88) 0%, rgba(230,190,116,0.34) 26%, rgba(3,5,8,0) 72%)", mixBlendMode: "screen", opacity: flash }} />}
    </AbsoluteFill>
  );
};

const PhoneBreakingNews = () => (
  <div style={{
    position: "absolute", left: "22%", top: "29%", width: "56%", boxSizing: "border-box",
    padding: "3.2% 3.6%", borderRadius: 28, background: "rgba(17, 20, 25, 0.96)",
    border: "1px solid rgba(232,194,124,0.58)", backgroundImage: "linear-gradient(145deg, rgba(255,255,255,0.12), transparent 38%), linear-gradient(160deg, rgba(24,27,32,0.98), rgba(7,9,13,0.97))", backdropFilter: "blur(16px)", boxShadow: "0 18px 54px rgba(0,0,0,0.58), 0 0 26px rgba(220,177,99,0.12), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 0 0 1px rgba(232,194,124,0.10)",
    color: "#f7f8fa", fontFamily: "Arial, Helvetica, sans-serif",
    transform: "rotate(24deg)", transformOrigin: "center center", pointerEvents: "none"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: "#b93630", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23, fontWeight: 800, color: "#fff" }}>!</div>
      <div style={{ fontSize: 25, letterSpacing: 1, fontWeight: 800, color: "#f0c77a" }}>BREAKING NEWS</div>
      <div style={{ marginLeft: "auto", fontSize: 17, color: "rgba(255,255,255,0.65)" }}>СЕЙЧАС</div>
    </div>
    <div style={{ height: 1, background: "rgba(255,255,255,0.17)", marginBottom: 18 }} />
    <div style={{ fontSize: 39, lineHeight: 1.05, fontWeight: 800, marginBottom: 13 }}>СРОЧНО!</div>
    <div style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 700, marginBottom: 11 }}>АЭРОПОРТ ШЕРЕМЕТЬЕВО</div>
    <div style={{ fontSize: 24, lineHeight: 1.2, marginBottom: 13 }}>ОБНАРУЖЕНА КОНТРАБАНДА</div>
    <div style={{ fontSize: 37, lineHeight: 1.05, fontWeight: 800, color: "#f0c77a" }}>НА 2 000 000 $</div>
  </div>
);

export const ImperialLuxeReel = () => (
  <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
    <Sequence from={0} durationInFrames={SCENE_1}>
      <ReelClip src="videos/01-bottle-scan.mp4" duration={SCENE_1} fadeIn={false} fadeOut />
    </Sequence>
    <Sequence from={START_2} durationInFrames={SCENE_2}>
      <ReelClip src="videos/02-diamonds-spill.mov" duration={SCENE_2} fadeIn fadeOut fadeOutFrames={DIAMOND_TRANSITION} zoomOut slowStartFrame={99} slowPlaybackRate={0.75} videoFilter="brightness(1.07) contrast(1.12) saturate(1.08) sepia(0.035)" diamondVignette diamondFlash />
    </Sequence>
    <Sequence from={START_3} durationInFrames={SCENE_3}>
      <ReelClip src="videos/water-hides-diamonds-final-touch.mp4" duration={SCENE_3} fadeIn fadeOut fadeInFrames={DIAMOND_TRANSITION} fadeOutFrames={PHONE_TRANSITION} zoomIn waterHighlight rushTailFrom={225} rushTailRate={1.35} />
    </Sequence>
    <Sequence from={START_4} durationInFrames={SCENE_4}>
      <ReelClip src="videos/I2V Камера плавно прибли_11-10_23_04_17.mp4" duration={SCENE_4} fadeIn fadeOut={false} fadeInFrames={PHONE_TRANSITION} phoneFlash videoFilter="brightness(0.80) contrast(1.03) saturate(0.94)">
        <PhoneBreakingNews />
      </ReelClip>
    </Sequence>
  </AbsoluteFill>
);
