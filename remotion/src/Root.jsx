import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";

const FPS = 30;
const DISSOLVE_FRAMES = 15;
const FILM_BURN_FRAMES = 18;

const sceneFiles = [
  "videos/scene-one.mp4",
  "videos/scene-two.mp4",
  "videos/scene-three.mp4",
];

const FilmBurn = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 5, FILM_BURN_FRAMES - 1],
    [0, 0.62, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "radial-gradient(ellipse at 52% 48%, rgba(255,245,190,0.98) 0%, rgba(255,164,65,0.9) 27%, rgba(190,58,20,0.72) 58%, rgba(30,8,4,0.18) 100%)",
        mixBlendMode: "screen",
        filter: "blur(3px)",
      }}
    />
  );
};

const SceneVideo = ({ src, opacity = 1 }) => (
  <OffthreadVideo
    src={staticFile(src)}
    volume={1}
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity,
    }}
  />
);

const Main = ({ sceneDurations }) => {
  const frame = useCurrentFrame();
  const [first, second, third] = sceneDurations;
  const secondStart = first - DISSOLVE_FRAMES;
  const thirdStart = secondStart + second - FILM_BURN_FRAMES;

  const firstOpacity = interpolate(
    frame,
    [first - DISSOLVE_FRAMES, first],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );
  const secondOpacity = interpolate(
    frame,
    [secondStart, secondStart + DISSOLVE_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );
  const secondFadeOut = interpolate(
    frame,
    [thirdStart, thirdStart + FILM_BURN_FRAMES],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );
  const thirdOpacity = interpolate(
    frame,
    [thirdStart, thirdStart + FILM_BURN_FRAMES],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={0} durationInFrames={first}>
        <SceneVideo src={sceneFiles[0]} opacity={firstOpacity} />
      </Sequence>
      <Sequence from={secondStart} durationInFrames={second}>
        <SceneVideo src={sceneFiles[1]} opacity={secondOpacity * secondFadeOut} />
      </Sequence>
      <Sequence from={thirdStart} durationInFrames={third}>
        <SceneVideo src={sceneFiles[2]} opacity={thirdOpacity} />
      </Sequence>
      <Sequence from={thirdStart} durationInFrames={FILM_BURN_FRAMES}>
        <FilmBurn />
      </Sequence>
    </AbsoluteFill>
  );
};

const calculateMainMetadata = async () => {
  const metadata = await Promise.all(
    sceneFiles.map((src) => getVideoMetadata(staticFile(src))),
  );
  const sceneDurations = metadata.map((item) =>
    Math.ceil(item.durationInSeconds * FPS),
  );
  const durationInFrames =
    sceneDurations.reduce((sum, duration) => sum + duration, 0) -
    DISSOLVE_FRAMES -
    FILM_BURN_FRAMES;

  if (sceneDurations.some((duration) => duration <= 0) || durationInFrames <= 0) {
    throw new Error("Unable to determine valid durations for the three scene videos.");
  }

  return {
    durationInFrames,
    props: { sceneDurations },
  };
};

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={300}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={{ sceneDurations: [300, 300, 300] }}
    calculateMetadata={calculateMainMetadata}
  />
);
