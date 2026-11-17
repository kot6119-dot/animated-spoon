import React from "react";
import { Composition } from "remotion";
import { ImperialLuxeReel, IMPERIAL_LUXE_REEL_DURATION } from "./ImperialLuxeReel";

export const RemotionRoot = () => (
  <Composition
    id="ImperialLuxeReel"
    component={ImperialLuxeReel}
    durationInFrames={IMPERIAL_LUXE_REEL_DURATION}
    fps={30}
    width={1080}
    height={1920}
  />
);
