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
  const flight = interpolate(frame, [start + 5, start + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shardOpacity = interpolate(frame, [start + 19, start + 27], [1, 0.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shards = [
    { x: -24, y: -29, r: -38, dx: -34, dy: -49 },
    { x: 13, y: -25, r: 42, dx: 24, dy: -54 },
    { x: -49, y: 8, r: -62, dx: -61, dy: 11 },
    { x: 47, y: 5, r: 58, dx: 62, dy: 12 },
    { x: -10, y: 28, r: 24, dx: -21, dy: 46 },
    { x: 28, y: 26, r: -48, dx: 43, dy: 45 },
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
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient id="glassShard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="48%" stopColor="#b9d8df" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
        <filter id="shardGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <g transform="translate(-56 105) scale(1.12 1)">
      <g opacity={crack}>
        {/* Fine fractures across the left lens */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 430 646 L 420 654 L 427 660 L 414 671 L 421 679" stroke="#f4f0df" strokeWidth="1.7" />
          <path d="M 420 654 L 405 650 L 399 642" stroke="#e7edf0" strokeWidth="1.2" />
          <path d="M 427 660 L 440 653 L 447 641" stroke="#ffffff" strokeWidth="1.25" />
          <path d="M 427 660 L 439 670 L 449 678" stroke="#d9e7e8" strokeWidth="1.35" />
          <path d="M 414 671 L 404 674 L 398 680" stroke="#ffffff" strokeWidth="1.1" />

          {/* Fine fractures across the right lens */}
          <path d="M 489 645 L 501 654 L 493 662 L 508 671 L 501 679" stroke="#f4f0df" strokeWidth="1.7" />
          <path d="M 501 654 L 517 650 L 526 642" stroke="#e7edf0" strokeWidth="1.2" />
          <path d="M 493 662 L 481 653 L 474 642" stroke="#ffffff" strokeWidth="1.25" />
          <path d="M 493 662 L 481 671 L 471 679" stroke="#d9e7e8" strokeWidth="1.35" />
          <path d="M 508 671 L 519 675 L 526 681" stroke="#ffffff" strokeWidth="1.1" />
          {/* Central bridge fracture */}
          <path d="M 456 655 L 463 661 L 457 667 L 466 674" stroke="#ffffff" strokeWidth="1.8" />
        </g>
      </g>

      {/* Flying glass fragments. Their motion finishes once; the cracked,
          incomplete lens remnants below stay visible for the rest of the clip. */}
      <g opacity={shardOpacity}>
        {shards.map((s, i) => {
          const x = s.x + s.dx * flight;
          const y = s.y + s.dy * flight;
          const rotate = s.r * flight;
          const points = i % 2 === 0 ? "0,0 17,4 8,20" : "0,0 21,8 5,17";
          return (
            <g
              key={i}
              transform={`translate(${466 + x} ${660 + y}) rotate(${rotate})`}
            >
              <polygon points={points} fill="url(#glassShard)" stroke="#f5f0d9" strokeWidth="1.1" />
              <path d="M 2 2 L 8 12" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
            </g>
          );
        })}
      </g>

      {/* Permanent broken-glass state: fractured lens edges and missing
          sections remain after the loose fragments have flown away. */}
      {frame >= start + 5 && (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 398 642 Q 420 633 444 643 L 448 650 M 447 669 L 442 677 Q 418 685 400 675" stroke="#d9b66c" strokeWidth="2.2" />
          <path d="M 475 650 L 480 643 Q 506 633 528 644 M 528 675 Q 507 685 483 677 L 478 671" stroke="#d9b66c" strokeWidth="2.2" />
          <path d="M 447 651 L 453 657 M 470 657 L 477 651" stroke="#d9b66c" strokeWidth="2" />
          <path d="M 430 646 L 420 654 L 427 660 L 414 671 L 421 679 M 489 645 L 501 654 L 493 662 L 508 671 L 501 679" stroke="#ffffff" strokeWidth="1.8" />
          <path d="M 420 654 L 405 650 M 427 660 L 440 653 M 493 662 L 481 653 M 508 671 L 519 675" stroke="#dcecf0" strokeWidth="1.25" />
        </g>
      )}
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
