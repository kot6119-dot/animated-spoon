import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import sceneDurations from "./scene-durations.json";

const FPS = 30;
const TRANSITION_FRAMES = 24;
const scenes = [
  { video: "videos/01-pervaya-scena-jaguar.mp4", audio: "videos/Сцена первая.m4a", frames: sceneDurations.scene1 },
  { video: "videos/02-vtoraya-scena-kot-v-jaguar.mp4", audio: "videos/Сцена вторая.mp3", frames: sceneDurations.scene2 },
  { video: "videos/03-scena-tretya.mp4", audio: "videos/Сцена третья аудио.mp3", frames: sceneDurations.scene3 },
  { video: "videos/04-chetvertaya-scena-s-muzykoy.mp4", frames: sceneDurations.scene4, embeddedAudio: true },
];

const starts = scenes.reduce((result, scene, index) => {
  result.push(index === 0 ? 0 : result[index - 1] + scenes[index - 1].frames - TRANSITION_FRAMES);
  return result;
}, []);

export const IMPERIAL_LUXE_REEL_DURATION =
  starts[3] + scenes[3].frames;

const GoldTransition = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0, TRANSITION_FRAMES - 1], [-110, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(
    frame,
    [0, 4, TRANSITION_FRAMES - 5, TRANSITION_FRAMES - 1],
    [0, 0.9, 0.75, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", opacity }}>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(110deg, transparent 35%, rgba(255,225,165,0.68) 49%, rgba(177,128,53,0.28) 53%, transparent 66%)",
        transform: `translateX(${sweep}%)`,
        mixBlendMode: "screen",
      }} />
    </AbsoluteFill>
  );
};

const Scene = ({ scene, isFirst, isLast }) => {
  const frame = useCurrentFrame();
  const fadeIn = isFirst ? 1 : interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [scene.frames - TRANSITION_FRAMES, scene.frames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", opacity: Math.min(fadeIn, fadeOut) }}>
      <OffthreadVideo
        src={staticFile(scene.video)}
        muted={!scene.embeddedAudio}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {scene.audio && <Audio src={staticFile(scene.audio)} volume={1} />}
    </AbsoluteFill>
  );
};

export const ImperialLuxeReel = () => (
  <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
    {scenes.map((scene, index) => (
      <Sequence
        key={scene.video}
        from={starts[index]}
        durationInFrames={scene.frames}
      >
        <Scene scene={scene} isFirst={index === 0} isLast={index === scenes.length - 1} />
      </Sequence>
    ))}
    {starts.slice(1).map((start, index) => (
      <Sequence key={`transition-${index}`} from={start} durationInFrames={TRANSITION_FRAMES}>
        <GoldTransition />
      </Sequence>
    ))}
  </AbsoluteFill>
);
