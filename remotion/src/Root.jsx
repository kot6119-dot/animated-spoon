import React from "react";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  HtmlInCanvas,
} from "remotion";
import { shatter } from "@remotion/effects/shatter";
import { Video } from "@remotion/media";

const FPS = 30;
const DURATION = 8 * FPS;

const GlassesBreak = () => {
  const frame = useCurrentFrame();
  const start = 180;
  if (frame < start) return null;

  const shatterTime = interpolate(frame - start, [0, 42], [0, 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftEffect = shatter({
    time: shatterTime,
    pattern: "glass",
    repetitions: 30,
    center: [0.405, 0.34],
    radius: 0.075,
    strength: 7,
    rotationSpeed: 0.35,
    randomness: 0.18,
    viscosity: 0.08,
    massVariance: 0.35,
    gravity: 1.2,
    seed: 27,
    extrusionDepth: 0.1,
  });

  const rightEffect = shatter({
    time: shatterTime,
    pattern: "glass",
    repetitions: 30,
    center: [0.484, 0.34],
    radius: 0.12,
    strength: 7,
    rotationSpeed: 0.35,
    randomness: 0.18,
    viscosity: 0.08,
    massVariance: 0.35,
    gravity: 1.2,
    seed: 43,
    extrusionDepth: 0.1,
  });

  return (
    <>
      <HtmlInCanvas
        width={1080}
        height={1920}
        effects={[leftEffect]}
        effectsOutputSize={{width: 1080, height: 1920}}
        style={{position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none"}}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            clipPath: "path('M 397px 645px Q 402px 625px 432px 623px Q 462px 624px 476px 642px L 472px 665px Q 455px 681px 430px 679px Q 405px 676px 397px 659px Z')",
          }}
        >
          <Video
            src={staticFile("videos/content 3.mp4")}
            muted
            style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain"}}
          />
        </div>
      </HtmlInCanvas>

      <HtmlInCanvas
        width={1080}
        height={1920}
        effects={[rightEffect]}
        effectsOutputSize={{width: 1080, height: 1920}}
        style={{position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none"}}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            clipPath: "path('M 468px 642px Q 484px 624px 519px 624px Q 555px 625px 576px 644px L 570px 666px Q 552px 682px 520px 682px Q 488px 678px 468px 660px Z')",
          }}
        >
          <Video
            src={staticFile("videos/content 3.mp4")}
            muted
            style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain"}}
          />
        </div>
      </HtmlInCanvas>

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
