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

const INSERT_FRAMES = 36; // 1.2 seconds
const OVERLAP_FRAMES = 10; // short dissolve into the main video
const MAIN_START = INSERT_FRAMES - OVERLAP_FRAMES;
const insertSrc = staticFile("videos/content 6.mp4");
const mainSrc = staticFile("videos/cat-video-after-remotion-edit.MP4");

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
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Sequence>
    <Sequence from={0} durationInFrames={INSERT_FRAMES}>
      <InsertClip />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot = () => (
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
);
