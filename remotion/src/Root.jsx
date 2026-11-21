import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";

// Existing first scene: preserved as it was.
const videoSrc = staticFile("videos/content 11.mp4");
const SHAKE_START = 153; // 5.1 seconds at 30 fps
const SHAKE_DURATION = 14; // about 0.47 seconds

const Main = () => {
  const frame = useCurrentFrame();
  const shakeFrame = frame - SHAKE_START;
  const active = shakeFrame >= 0 && shakeFrame < SHAKE_DURATION;
  const motionFrame = Math.max(0, shakeFrame);
  const progress = active
    ? interpolate(
        motionFrame,
        [0, 2, 8, SHAKE_DURATION],
        [1, 0.82, 0.38, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 0;

  const intensity = 40 * progress;
  const translateX =
    (Math.sin(motionFrame * 3.1) + Math.cos(motionFrame * 1.7) * 0.6) * intensity;
  const translateY =
    (Math.cos(motionFrame * 2.8) * 0.9 + Math.sin(motionFrame * 1.9) * 0.5) * intensity;
  const rotate = Math.sin(motionFrame * 2.4) * intensity * 0.06;
  const scale = active
    ? interpolate(
        motionFrame,
        [0, 2, 8, SHAKE_DURATION],
        [1.20, 1.18, 1.12, 1.08],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={videoSrc}
        volume={1}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
    </AbsoluteFill>
  );
};

// New cat clip: separate composition so the first scene remains untouched.
const catVideoSrc = staticFile("videos/final-video-iPhone-compatible 3.MP4");
const glassEffectSrc = staticFile("videos/cow_glass_bright_siren_very_low.mp3");
const CAT_SHAKE_DURATION = 36; // first 1.2 seconds at 30 fps

const CatClip = () => {
  const frame = useCurrentFrame();
  const active = frame < CAT_SHAKE_DURATION;
  const progress = active
    ? interpolate(frame, [0, 3, 18, CAT_SHAKE_DURATION], [0.45, 1, 0.55, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const intensity = 11 * progress;
  const translateX =
    (Math.sin(frame * 2.7) + Math.cos(frame * 1.6) * 0.45) * intensity;
  const translateY =
    (Math.cos(frame * 2.3) * 0.75 + Math.sin(frame * 1.8) * 0.35) * intensity;
  const rotate = Math.sin(frame * 2.1) * intensity * 0.035;
  const scale = active
    ? interpolate(frame, [0, 3, 18, CAT_SHAKE_DURATION], [1.045, 1.05, 1.035, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <OffthreadVideo
        src={catVideoSrc}
        volume={1}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
      <Audio src={glassEffectSrc} volume={1} />
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={async () => {
        const metadata = await getVideoMetadata(videoSrc);
        return {
          durationInFrames: Math.max(1, Math.ceil(metadata.durationInSeconds * 30)),
        };
      }}
    />
    <Composition
      id="CatClip"
      component={CatClip}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={async () => {
        const metadata = await getVideoMetadata(catVideoSrc);
        return {
          durationInFrames: Math.max(1, Math.ceil(metadata.durationInSeconds * 30)),
        };
      }}
    />
  </>
);
