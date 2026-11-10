import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || path.resolve("../data");
const videoDir = path.join(dataDir, "remotion", "videos");
const outputDir = path.join(dataDir, "remotion", "output");
const port = Number(process.env.PORT || 3000);
const token = process.env.CONTROL_TOKEN;

if (!token) throw new Error("CONTROL_TOKEN is required.");
for (const name of ["bottle-intro.mp4", "diamonds-spill.mp4"]) {
  if (!fs.existsSync(path.join(videoDir, name))) {
    throw new Error("Не найден файл " + name + ". Сначала загрузите оба видео.");
  }
}

fs.mkdirSync(outputDir, { recursive: true });
const serveUrl = await bundle({
  entryPoint: path.join(here, "index.jsx")
});
const inputProps = {
  bottleVideo: `http://127.0.0.1:${port}/remotion-video/bottle-intro.mp4?token=${encodeURIComponent(token)}`,
  diamondsVideo: `http://127.0.0.1:${port}/remotion-video/diamonds-spill.mp4?token=${encodeURIComponent(token)}`
};
const composition = await selectComposition({
  serveUrl,
  id: "BottleDiamondCase",
  inputProps
});
const outputLocation = path.join(outputDir, "bottle-diamond-case.mp4");

await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation,
  inputProps,
  browserExecutable: chromium.executablePath(),
  concurrency: 2,
  timeoutInMilliseconds: 120000
});

console.log(JSON.stringify({
  ok: true,
  output: outputLocation,
  composition: "BottleDiamondCase",
  durationSeconds: 13,
  resolution: "1920x1080"
}));
