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

  const shatterTime = interpolate(frame - start, [0, 42], [0, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <>
      <svg width="0" height="0" style={{position: "absolute"}}>
        <defs>
          <clipPath id="leftLensShatterClip" clipPathUnits="userSpaceOnUse">
            <path d="M 458 757 Q 468 730 501 729 Q 536 730 552 750 L 547 786 Q 528 808 496 805 Q 468 800 458 778 Z" />
          </clipPath>
          <clipPath id="rightLensShatterClip" clipPathUnits="userSpaceOnUse">
            <path d="M 548 750 Q 566 730 599 731 Q 631 733 645 753 L 641 783 Q 625 805 592 807 Q 562 803 548 783 Z" />
          </clipPath>
        </defs>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          clipPath: "url(#leftLensShatterClip)",
          pointerEvents: "none",
        }}
      >
        <Video
          src={staticFile("videos/content 3.mp4")}
          muted
          effects={[
            shatter({
              time: shatterTime,
              pattern: "glass",
              repetitions: 30,
              center: [0.47, 0.18],
              radius: 0.12,
              strength: 7,
              rotationSpeed: 0.35,
              randomness: 0.18,
              viscosity: 0.08,
              massVariance: 0.35,
              gravity: 1.2,
              seed: 27,
              extrusionDepth: 0.1,
            }),
          ]}
          effectsOutputSize={{width: 1080, height: 1920}}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}}
        />
      </div>
      <div style={{position:"absolute",inset:0,width:"100%",height:"100%",overflow:"hidden",clipPath:"url(#rightLensShatterClip)",pointerEvents:"none"}}>
        <Video
          src={staticFile("videos/content 3.mp4")}
          muted
          effects={[
            shatter({
              time: shatterTime,
              pattern: "glass",
              repetitions: 30,
              center: [0.55, 0.18],
              radius: 0.12,
              strength: 7,
              rotationSpeed: 0.35,
              randomness: 0.18,
              viscosity: 0.08,
              massVariance: 0.35,
              gravity: 1.2,
              seed: 43,
              extrusionDepth: 0.1,
            }),
          ]}
          effectsOutputSize={{width:1080,height:1920}}
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}}
        />
      </div>
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
            fillOpacity={0.5}
            fillRule="evenodd"
            stroke="#e8f0ef"
            strokeOpacity={0.52}
            strokeWidth="0.85"
          />
        </g>
      </svg>
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
