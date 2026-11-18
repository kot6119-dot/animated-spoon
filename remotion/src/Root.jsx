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

  const crack = interpolate(frame, [start, start + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const burst = interpolate(frame, [start + 4, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flyingOpacity = interpolate(frame, [start + 11, start + 19], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shards = [
    { x: 420, y: 646, dx: -24, dy: -18, r: -34, points: "0,0 10,2 3,10" },
    { x: 442, y: 644, dx: 16, dy: -24, r: 30, points: "0,0 11,3 2,10" },
    { x: 410, y: 660, dx: -30, dy: -5, r: -48, points: "0,0 9,2 2,9" },
    { x: 512, y: 644, dx: -16, dy: -24, r: -30, points: "0,0 11,3 2,10" },
    { x: 534, y: 646, dx: 24, dy: -18, r: 34, points: "0,0 10,2 3,10" },
    { x: 544, y: 660, dx: 30, dy: -5, r: 48, points: "0,0 9,2 2,9" },
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
          <path d="M 398 642 Q 416 630 442 635 Q 460 638 462 653 Q 461 670 443 676 Q 418 681 402 665 Q 396 655 398 642 Z" />
        </clipPath>
        <clipPath id="rightLensCrackClip">
          <path d="M 482 653 Q 484 638 502 635 Q 528 630 546 642 Q 548 655 542 665 Q 526 681 501 676 Q 483 670 482 653 Z" />
        </clipPath>
        <linearGradient id="newGlassShard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#d8e8eb" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <g transform="matrix(1.29 0 0 1.58 -39 -281)">
        {/* Both crack patterns are clipped to their own lens areas. */}
        <g opacity={crack} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g clipPath="url(#leftLensCrackClip)">
            <path d="M 431 654 L 422 646 L 426 638 M 422 646 L 410 644 L 404 638 M 422 646 L 414 658 L 402 662 M 414 658 L 425 663 L 420 675 M 414 658 L 435 657 L 447 671 M 435 657 L 443 645 L 455 641 M 435 657 L 451 654 L 463 660" stroke="#f7f7ed" strokeWidth="1.15" />
            <path d="M 431 654 L 422 646 L 426 638 M 422 646 L 410 644 L 404 638 M 414 658 L 402 662 M 435 657 L 447 671" stroke="#ffffff" strokeWidth="0.55" />
          </g>
          <g clipPath="url(#rightLensCrackClip)">
            <path d="M 513 654 L 522 646 L 518 638 M 522 646 L 534 644 L 540 638 M 522 646 L 530 658 L 542 662 M 530 658 L 519 663 L 524 675 M 530 658 L 509 657 L 497 671 M 509 657 L 501 645 L 489 641 M 509 657 L 493 654 L 481 660" stroke="#f7f7ed" strokeWidth="1.15" />
            <path d="M 513 654 L 522 646 L 518 638 M 522 646 L 534 644 L 540 638 M 530 658 L 542 662 M 509 657 L 497 671" stroke="#ffffff" strokeWidth="0.55" />
          </g>
        </g>

        {/* A few tiny fragments fly outward and upward, away from the cat's muzzle. */}
        <g opacity={flyingOpacity}>
          {shards.map((s, i) => (
            <g
              key={i}
              transform={`translate(${s.x + s.dx * burst} ${s.y + s.dy * burst}) rotate(${s.r * burst})`}
            >
              <polygon points={s.points} fill="url(#newGlassShard)" stroke="#ffffff" strokeWidth="0.7" />
            </g>
          ))}
        </g>

        {/* The fractured state remains on both lenses until the final frame. */}
        <g opacity={crack} fill="none" stroke="#f1f3e9" strokeWidth="0.85" strokeLinecap="round">
          <path d="M 431 654 L 422 646 L 426 638 M 422 646 L 410 644 M 414 658 L 402 662 M 435 657 L 447 671" />
          <path d="M 513 654 L 522 646 L 518 638 M 522 646 L 534 644 M 530 658 L 542 662 M 509 657 L 497 671" />
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
