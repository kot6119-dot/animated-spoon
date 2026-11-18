import React from "react";
import {
  AbsoluteFill,
  Composition,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Video } from "@remotion/media";

const FPS = 30;
const DURATION = 8 * FPS;

const GlassesBreak = () => {
  const frame = useCurrentFrame();
  const start = 180;
  if (frame < start) return null;

  const crack = interpolate(frame, [start, start + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burst = interpolate(frame, [start + 5, start + 17], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flyingOpacity = interpolate(frame, [start + 10, start + 19], [0.82, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shards = [
    { x: 416, y: 651, dx: -13, dy: -5, r: -22, points: "0,0 7,1 2,6" },
    { x: 444, y: 659, dx: -10, dy: 5, r: 18, points: "0,0 6,1 2,5" },
    { x: 520, y: 651, dx: 13, dy: -5, r: 24, points: "0,0 7,1 2,6" },
    { x: 494, y: 660, dx: 10, dy: 5, r: -18, points: "0,0 6,1 2,5" },
  ];

  return (
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
        overflow: "hidden",
      }}
    >
      <defs>
        <clipPath id="leftLensCrackClip">
          <path d="M 400 646 Q 410 638 429 638 Q 448 638 459 646 Q 461 655 456 665 Q 444 674 426 674 Q 408 672 401 662 Q 398 654 400 646 Z" />
        </clipPath>
        <clipPath id="rightLensCrackClip">
          <path d="M 485 646 Q 496 638 515 638 Q 534 638 544 646 Q 547 654 543 662 Q 536 672 518 674 Q 500 674 488 665 Q 483 655 485 646 Z" />
        </clipPath>
        <linearGradient id="newGlassShard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="45%" stopColor="#d8e8eb" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <g transform="matrix(1.29 0 0 1.58 -39 -281)">
        {/* Fine, irregular fractures stay strictly inside each lens. */}
        <g opacity={crack} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g clipPath="url(#leftLensCrackClip)">
            <path d="M 428 654 L 421 649 L 423 643 M 421 649 L 411 648 L 405 644 M 421 649 L 414 657 L 405 662 M 414 657 L 426 660 L 430 670 M 426 660 L 439 654 L 448 646 M 439 654 L 450 656 L 457 663" stroke="#e8eeee" strokeWidth="0.72" />
            <path d="M 428 654 L 435 647 L 433 641 M 426 660 L 418 666" stroke="#ffffff" strokeOpacity="0.58" strokeWidth="0.42" />
          </g>
          <g clipPath="url(#rightLensCrackClip)">
            <path d="M 516 654 L 523 648 L 521 642 M 523 648 L 534 647 L 540 643 M 523 648 L 530 657 L 540 662 M 530 657 L 518 661 L 514 670 M 518 661 L 505 654 L 496 647 M 505 654 L 494 657 L 488 663" stroke="#e8eeee" strokeWidth="0.72" />
            <path d="M 516 654 L 509 647 L 511 641 M 518 661 L 526 667" stroke="#ffffff" strokeOpacity="0.58" strokeWidth="0.42" />
          </g>
        </g>

        {/* Small translucent glass splinters move sideways, away from the muzzle. */}
        <g opacity={flyingOpacity}>
          {shards.map((s, i) => (
            <g
              key={i}
              transform={`translate(${s.x + s.dx * burst} ${s.y + s.dy * burst}) rotate(${s.r * burst})`}
            >
              <polygon points={s.points} fill="url(#newGlassShard)" stroke="#dce9eb" strokeOpacity="0.72" strokeWidth="0.45" />
              <path d="M 1 1 L 5 2" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="0.45" />
            </g>
          ))}
        </g>

        {/* Persistent hairline cracks remain visible after the fragments pass. */}
        <g opacity={crack} fill="none" stroke="#dfe7e5" strokeOpacity="0.78" strokeWidth="0.62" strokeLinecap="round" strokeLinejoin="round">
          <path clipPath="url(#leftLensCrackClip)" d="M 428 654 L 421 649 L 423 643 M 421 649 L 411 648 M 414 657 L 405 662 M 426 660 L 430 670 M 439 654 L 448 646" />
          <path clipPath="url(#rightLensCrackClip)" d="M 516 654 L 523 648 L 521 642 M 523 648 L 534 647 M 530 657 L 540 662 M 518 661 L 514 670 M 505 654 L 496 647" />
        </g>
      </g>
    </svg>
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
