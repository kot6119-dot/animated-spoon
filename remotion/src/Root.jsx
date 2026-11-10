import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";

const BottleFilm: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#080808" }}>
    <Sequence from={0} durationInFrames={150}>
      <OffthreadVideo
        src={staticFile("videos/bottle-intro.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Sequence>
    <Sequence from={150} durationInFrames={240}>
      <OffthreadVideo
        src={staticFile("videos/diamonds-spill.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="BottleFilm"
    component={BottleFilm}
    durationInFrames={390}
    fps={30}
    width={1920}
    height={1080}
  />
);
