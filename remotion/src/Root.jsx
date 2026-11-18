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
  const burst = interpolate(frame, [start + 3, start + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flyingOpacity = interpolate(frame, [start + 7, start + 12, start + 21], [0, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shards = [
    { x: 420, y: 650, dx: -19, dy: -12, r: -38, points: "0,0 10,-2 4,5 1,9" },
    { x: 438, y: 660, dx: -13, dy: 8, r: 27, points: "0,0 8,1 3,7" },
    { x: 450, y: 648, dx: -8, dy: -15, r: -17, points: "0,0 7,-2 4,4" },
    { x: 508, y: 650, dx: 18, dy: -13, r: 32, points: "0,0 10,1 5,7 1,5" },
    { x: 495, y: 660, dx: 13, dy: 8, r: -25, points: "0,0 8,-1 4,6" },
    { x: 488, y: 647, dx: 8, dy: -16, r: 21, points: "0,0 7,1 2,6" },
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
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
          <stop offset="38%" stopColor="#dce9ed" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.10" />
        </linearGradient>
      </defs>

      <g transform="matrix(1.29 0 0 1.58 -39 -281)">
        {/* Individual impact points and irregular branching fractures. */}
        <g opacity={crack} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <g clipPath="url(#leftLensCrackClip)">
            <path d="M 425 653 L 419 647 L 420 641 M 419 647 L 410 646 L 404 642 M 419 647 L 412 654 L 403 656 M 412 654 L 418 660 L 415 669 M 418 660 L 430 658 L 438 663 M 430 658 L 435 650 L 445 645 M 435 650 L 432 642 M 430 658 L 441 655 L 453 659 M 441 655 L 449 649 M 418 660 L 407 665" stroke="#dce6e7" strokeWidth="0.68" />
            <path d="M 425 653 L 428 648 L 427 644 M 412 654 L 407 651 M 430 658 L 434 666" stroke="#ffffff" strokeOpacity="0.62" strokeWidth="0.38" />
            <path d="M 423 650 L 425 653 L 428 655" stroke="#ffffff" strokeOpacity="0.72" strokeWidth="0.48" />
          </g>
          <g clipPath="url(#rightLensCrackClip)">
            <path d="M 518 653 L 524 647 L 522 640 M 524 647 L 535 645 L 542 641 M 524 647 L 531 655 L 541 658 M 531 655 L 525 662 L 527 670 M 525 662 L 513 659 L 505 665 M 513 659 L 508 650 L 497 645 M 508 650 L 512 642 M 513 659 L 501 657 L 490 661 M 501 657 L 493 652 M 525 662 L 537 666" stroke="#dce6e7" strokeWidth="0.68" />
            <path d="M 518 653 L 515 647 L 517 643 M 531 655 L 536 652 M 513 659 L 509 668" stroke="#ffffff" strokeOpacity="0.62" strokeWidth="0.38" />
            <path d="M 520 650 L 518 653 L 515 655" stroke="#ffffff" strokeOpacity="0.72" strokeWidth="0.48" />
          </g>
        </g>

        {/* Briefly visible glass pieces fly outward, away from the cat's face. */}
        <g opacity={flyingOpacity}>
          {shards.map((s, i) => (
            <g
              key={i}
              transform={`translate(${s.x + s.dx * burst} ${s.y + s.dy * burst}) rotate(${s.r * burst})`}
            >
              <polygon points={s.points} fill="url(#newGlassShard)" stroke="#f4fbfc" strokeOpacity="0.9" strokeWidth="0.55" />
              <path d="M 1 1 L 5 0" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="0.55" />
              <path d="M 3 2 L 4 5" stroke="#b9cbd0" strokeOpacity="0.7" strokeWidth="0.4" />
            </g>
          ))}
        </g>

        {/* Fine permanent fracture lines remain in the lenses after the burst. */}
        <g opacity={crack} fill="none" stroke="#d9e3e4" strokeOpacity="0.72" strokeWidth="0.54" strokeLinecap="round" strokeLinejoin="round">
          <path clipPath="url(#leftLensCrackClip)" d="M 425 653 L 419 647 L 420 641 M 419 647 L 410 646 L 404 642 M 419 647 L 412 654 L 403 656 M 412 654 L 418 660 L 415 669 M 418 660 L 430 658 L 438 663 M 430 658 L 435 650 L 445 645 M 441 655 L 453 659 M 418 660 L 407 665" />
          <path clipPath="url(#rightLensCrackClip)" d="M 518 653 L 524 647 L 522 640 M 524 647 L 535 645 L 542 641 M 524 647 L 531 655 L 541 658 M 531 655 L 525 662 L 527 670 M 525 662 L 513 659 L 505 665 M 513 659 L 508 650 L 497 645 M 501 657 L 490 661 M 525 662 L 537 666" />
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
