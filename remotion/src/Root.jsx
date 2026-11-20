import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import { getVideoMetadata } from "@remotion/media";

const INSERT_FRAMES = 36; // 1.2 seconds
const MAIN_TRIM_FRAMES = 27; // 0.9 seconds at 30 fps
const insertSrc = staticFile("videos/content 6.mp4");
const mainSrc = staticFile("videos/cat-video-after-remotion-edit.MP4");

const Main = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={INSERT_FRAMES}>
      <OffthreadVideo
        src={insertSrc}
        startFrom={60}
        endAt={96}
        volume={0}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Sequence>
    <Sequence from={INSERT_FRAMES}>
      <OffthreadVideo
        src={mainSrc}
        startFrom={MAIN_TRIM_FRAMES}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
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
      const mainFrames = Math.ceil(metadata.durationInSeconds * 30) - MAIN_TRIM_FRAMES;
      return {
        durationInFrames: INSERT_FRAMES + Math.max(1, mainFrames),
      };
    }}
  />
);
