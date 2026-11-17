import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import sceneDurations from "./scene-durations.json";

const scenes = [
  { video: "videos/01-pervaya-scena-jaguar.mp4", audio: "videos/Сцена первая.m4a", frames: sceneDurations.scene1 },
  { video: "videos/02-vtoraya-scena-kot-v-jaguar.mp4", audio: "videos/Сцена вторая.mp3", frames: sceneDurations.scene2 },
  { video: "videos/03-scena-tretya.mp4", audio: "videos/Сцена третья аудио.mp3", frames: sceneDurations.scene3 },
  { video: "videos/04-chetvertaya-scena-s-muzykoy.mp4", frames: sceneDurations.scene4, embeddedAudio: true },
];

const starts = scenes.reduce((result, scene, index) => {
  result.push(index === 0 ? 0 : result[index - 1] + scenes[index - 1].frames);
  return result;
}, []);

export const IMPERIAL_LUXE_REEL_DURATION =
  starts[3] + scenes[3].frames;

const Scene = ({ scene }) => (
  <AbsoluteFill style={{ backgroundColor: "#050505" }}>
    <OffthreadVideo
      src={staticFile(scene.video)}
      muted={!scene.embeddedAudio}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    {scene.audio && <Audio src={staticFile(scene.audio)} volume={1} />}
  </AbsoluteFill>
);

export const ImperialLuxeReel = () => (
  <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
    {scenes.map((scene, index) => (
      <Sequence
        key={scene.video}
        from={starts[index]}
        durationInFrames={scene.frames}
      >
        <Scene scene={scene} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
