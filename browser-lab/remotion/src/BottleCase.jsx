import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence } from "remotion";

export const BottleCase = ({ bottleVideo, diamondsVideo }) => {
  if (!bottleVideo || !diamondsVideo) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#101010",
          color: "#ffffff",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 42,
          fontFamily: "Arial, sans-serif"
        }}
      >
        Загрузите оба видеофрагмента
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence from={0} durationInFrames={150}>
        <OffthreadVideo
          src={bottleVideo}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
      <Sequence from={150} durationInFrames={240}>
        <OffthreadVideo
          src={diamondsVideo}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
