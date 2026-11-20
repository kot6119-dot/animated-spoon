import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";

const INSERT_FRAMES = 39; // 1.3 seconds
const OVERLAP_FRAMES = 10; // short dissolve into the main video
const MAIN_START = INSERT_FRAMES - OVERLAP_FRAMES;
const insertSrc = staticFile("videos/content 6.mp4");
const mainSrc = staticFile("videos/cat-video-after-remotion-edit.MP4");
const cowSrc = staticFile("videos/content 11.mp4");

const InsertClip = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [INSERT_FRAMES - OVERLAP_FRAMES, INSERT_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <OffthreadVideo
      src={insertSrc}
      startFrom={60}
      endAt={96}
      volume={0}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity,
      }}
    />
  );
};

const Main = () => (
  <AbsoluteFill>
    <Sequence from={MAIN_START}>
      <OffthreadVideo
        src={mainSrc}
        startFrom={0}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.55)" }}
      />
    </Sequence>
    <Sequence from={0} durationInFrames={INSERT_FRAMES}>
      <InsertClip />
    </Sequence>
  </AbsoluteFill>
);

// Isolated test: the existing Main composition above remains unchanged.
const CowScreamShake = ({ children }) => {
  const frame = useCurrentFrame();
  const fps = 30;
  const shakeStart = Math.round(5.1 * fps); // frame 153
  const shakeDuration = Math.round(0.55 * fps); // about 17 frames

  let translateX = 0;
  let translateY = 0;
  let rotate = 0;
  let scale = 1;

  if (frame >= shakeStart && frame < shakeStart + shakeDuration) {
    const progress = (frame - shakeStart) / shakeDuration;
    const intensity = interpolate(progress, [0, 0.15, 1], [22, 16, 0], {
      extrapolateRight: "clamp",
    });

    translateX =
      Math.sin(frame * 3.1) * intensity +
      Math.cos(frame * 1.7) * intensity * 0.6;
    translateY =
      Math.cos(frame * 2.8) * intensity * 0.9 +
      Math.sin(frame * 1.9) * intensity * 0.5;
    rotate = Math.sin(frame * 2.4) * intensity * 0.35;
    scale = interpolate(progress, [0, 0.12, 0.4, 1], [1, 1.07, 1.03, 1], {
      extrapolateRight: "clamp",
    });
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CowShakeTest = () => (
  <CowScreamShake>
    <OffthreadVideo
      src={cowSrc}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </CowScreamShake>
);

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
        const metadata = await getVideoMetadata(mainSrc);
        const mainFrames = Math.ceil(metadata.durationInSeconds * 30);
        return {
          durationInFrames: MAIN_START + Math.max(1, mainFrames),
        };
      }}
    />
    <Composition
      id="CowShakeTest"
      component={CowShakeTest}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={async () => {
        const metadata = await getVideoMetadata(cowSrc);
        return {
          durationInFrames: Math.max(1, Math.ceil(metadata.durationInSeconds * 30)),
        };
      }}
    />
  </>
);
