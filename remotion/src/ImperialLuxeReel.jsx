import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import sceneDurations from "./scene-durations.json";

// Remove the baked-in dissolve/ghost frames at the two reviewed scene joins.
// 5s join: trim 15 frames on both sides (0.5s total per source edge).
// 13s join: trim 9 frames on both sides (0.3s total per source edge).
const scenes = [
  { video: "videos/01-pervaya-scena-jaguar.mp4", audio: "videos/Сцена первая.m4a", frames: sceneDurations.scene1, trimAfter: 15, audioVolume: 1.2 },
  { video: "videos/02-vtoraya-scena-kot-v-jaguar.mp4", audio: "videos/Сцена вторая.mp3", frames: sceneDurations.scene2, trimBefore: 15, trimAfter: 9 },
  { video: "videos/03-scena-tretya.mp4", audio: "videos/Сцена третья аудио.mp3", frames: sceneDurations.scene3, trimBefore: 9 },
  { video: "videos/04-chetvertaya-scena-s-muzykoy.mp4", frames: sceneDurations.scene4, embeddedAudio: true },
];

const visibleFrames = (scene) =>
  scene.frames - (scene.trimBefore || 0) - (scene.trimAfter || 0);

const starts = scenes.reduce((result, scene, index) => {
  result.push(index === 0 ? 0 : result[index - 1] + visibleFrames(scenes[index - 1]));
  return result;
}, []);

export const IMPERIAL_LUXE_REEL_DURATION =
  starts[3] + visibleFrames(scenes[3]);

const Scene = ({ scene }) => (
  <AbsoluteFill style={{ backgroundColor: "#050505" }}>
    <OffthreadVideo
      src={staticFile(scene.video)}
      muted={!scene.embeddedAudio}
      trimBefore={scene.trimBefore || 0}
      trimAfter={scene.frames - (scene.trimAfter || 0)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    {scene.audio && (
      <Audio
        src={staticFile(scene.audio)}
        startFrom={scene.trimBefore || 0}
        volume={scene.audioVolume || 1}
      />
    )}
  </AbsoluteFill>
);

export const ImperialLuxeReel = () => (
  <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
    {scenes.map((scene, index) => (
      <Sequence
        key={scene.video}
        from={starts[index]}
        durationInFrames={visibleFrames(scene)}
      >
        <Scene scene={scene} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
