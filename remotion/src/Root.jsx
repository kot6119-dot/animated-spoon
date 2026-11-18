import React from "react";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
} from "remotion";
import { shatter } from "@remotion/effects/shatter";
import { Video } from "@remotion/media";

const FPS = 30;
const DURATION = 8 * FPS;

const GlassesBreak = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = 180;
  if (frame < start) return null;

  // Remotion's native glass shatter effect. Time is measured in seconds.
  const shatterTime = interpolate(frame, [start, start + 42], [0, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The original lens pixels are darkened underneath, so the gaps between
  // departing fragments read as missing glass rather than intact lenses.
  return (
    <>
      <svg
        viewBox="0 0 1080 1920"
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <g transform="matrix(1.29 0 0 1.58 -39 -281)">
          <path
            d="M 400 646 Q 410 638 429 638 Q 448 638 459 646 Q 461 655 456 665 Q 444 674 426 674 Q 408 672 401 662 Q 398 654 400 646 Z M 485 646 Q 496 638 515 638 Q 534 638 544 646 Q 547 654 543 662 Q 536 672 518 674 Q 500 674 488 665 Q 483 655 485 646 Z"
            fill="#11191c"
            fillOpacity={0.52}
            fillRule="evenodd"
            stroke="#d7e0df"
            strokeOpacity={0.48}
            strokeWidth="0.7"
          />
        </g>
      </svg>
      <Video
        src={staticFile("videos/content 3.mp4")}
        muted
        effects={[
          shatter({
            time: shatterTime,
            pattern: "glass",
            repetitions: 18,
            center: [0.5, 0.39],
            origin: [0.5, 0.39],
            radius: 0.18,
            depth: 0.08,
            strength: 3.8,
            rotationSpeed: 0.32,
            randomness: 0.18,
            viscosity: 0.16,
            massVariance: 0.38,
            gravity: 1.2,
            seed: 27,
            extrusionDepth: 0.08,
          }),
        ]}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          clipPath: "path('M 477 740 L 490 727 L 516 723 L 541 729 L 553 741 L 549 764 L 535 779 L 510 785 L 487 779 L 477 764 Z M 587 740 L 601 727 L 626 723 L 651 729 L 667 741 L 664 762 L 649 779 L 626 785 L 603 785 L 590 770 Z')",
        }}
        effectsOutputSize={{width: 1080, height: 1920}}
      />
    </>
  );
};

const Main = () => {
  const video = staticFile("videos/content 3.mp4");

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <Video
        src={video}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(42px) brightness(0.38)",
          transform: "scale(1.16)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Video
          src={video}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </AbsoluteFill>
      <GlassesBreak />
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={DURATION}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
