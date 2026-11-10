import React from "react";
import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";

const BottleFilm = () => (
  <AbsoluteFill style={{ backgroundColor: "#080808" }}>
    <Sequence from={0} durationInFrames={150}>
      <OffthreadVideo
        src={staticFile("videos/I2V A thin blue-white sc_11-10_00_57_16.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Sequence>
    <Sequence from={150} durationInFrames={240}>
      <OffthreadVideo
        src={staticFile("videos/92D0FBD7-43D6-41E7-B9C9-EE69B4EB2B1B.mov")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <Composition
    id="BottleFilm"
    component={BottleFilm}
    durationInFrames={390}
    fps={30}
    width={1920}
    height={1080}
  />
);
