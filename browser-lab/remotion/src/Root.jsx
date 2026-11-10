import React from "react";
import { Composition } from "remotion";
import { BottleCase } from "./BottleCase.jsx";

export const RemotionRoot = () => (
  <Composition
    id="BottleDiamondCase"
    component={BottleCase}
    durationInFrames={390}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      bottleVideo: "",
      diamondsVideo: ""
    }}
  />
);
