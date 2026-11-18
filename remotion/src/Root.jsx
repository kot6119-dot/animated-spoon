import React from "react";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  useCurrentFrame,
  interpolate,
  HtmlInCanvas,
  Img,
} from "remotion";
import { shatter } from "@remotion/effects/shatter";
import { Video } from "@remotion/media";

const FPS = 30;
const DURATION = 8 * FPS;
const SHATTER_START = 198;
const SHATTER_DURATION = 42;

const FinalFrameShatter = () => {
  const frame = useCurrentFrame();
  if (frame < SHATTER_START) return null;

  const time = interpolate(
    frame - SHATTER_START,
    [0, SHATTER_DURATION],
    [0, 1.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const effect = shatter({
    time,
    pattern: "glass",
    repetitions: 100,
    center: [0.5, 0.5],
    radius: 0.82,
    strength: 9,
    rotationSpeed: 0.42,
    randomness: 0.22,
    viscosity: 0.045,
    massVariance: 0.5,
    gravity: 1.15,
    seed: 6119,
    extrusionDepth: 0.06,
  });

  return (
    <HtmlInCanvas
      width={1080}
      height={1920}
      effects={[effect]}
      effectsOutputSize={{ width: 1080, height: 1920 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", background: "#050505" }}>
        <Img
          src={staticFile("images/final-frame.png")}
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(42px) brightness(0.38)", transform: "scale(1.16)" }}
        />
        <Img
          src={staticFile("images/final-frame.png")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </HtmlInCanvas>
  );
};

const Main = () => {
  const video = staticFile("videos/content 3.mp4");
  const frame = useCurrentFrame();
  const showVideo = frame < SHATTER_START;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      {showVideo ? (
        <>
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
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
            <Video
              src={video}
              muted
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </AbsoluteFill>
        </>
      ) : null}
      <FinalFrameShatter />
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
