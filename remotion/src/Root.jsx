import React from "react";
import { Composition } from "remotion";

const StarterVideo = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #101820 0%, #263746 55%, #101820 100%)",
        color: "#f4f0e6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: 5 }}>
        REMOTION
      </div>
      <div style={{ marginTop: 22, fontSize: 28, opacity: 0.8 }}>
        Video workspace is ready
      </div>
    </div>
  );
};

export const RemotionRoot = () => (
  <>
    <Composition
      id="Main"
      component={StarterVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
