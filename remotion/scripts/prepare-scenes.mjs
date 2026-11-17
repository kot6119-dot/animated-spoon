import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const files = {
  scene1: "public/videos/01-pervaya-scena-jaguar.mp4",
  scene2: "public/videos/02-vtoraya-scena-kot-v-jaguar.mp4",
  scene3: "public/videos/03-scena-tretya.mp4",
  scene4: "public/videos/04-chetvertaya-scena-s-muzykoy.mp4",
};

const durations = {};
for (const [key, file] of Object.entries(files)) {
  const seconds = Number(execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    file,
  ], { encoding: "utf8" }).trim());
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error(`Could not read duration for ${file}`);
  }
  durations[key] = Math.round(seconds * 30);
  console.log(`${key}: ${seconds.toFixed(3)}s / ${durations[key]} frames`);
}
writeFileSync("src/scene-durations.json", JSON.stringify(durations, null, 2) + "\n");
