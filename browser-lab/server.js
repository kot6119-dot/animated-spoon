import express from "express";
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const CONTROL_TOKEN = process.env.CONTROL_TOKEN;
const DATA_DIR = process.env.DATA_DIR || path.resolve("data");
const PROFILE_DIR = path.join(DATA_DIR, "browser-profile");
const VIEWPORT = { width: 1280, height: 800 };

if (!CONTROL_TOKEN || CONTROL_TOKEN.length < 24) {
  console.error("Set CONTROL_TOKEN to a random value of at least 24 characters.");
  process.exit(1);
}

fs.mkdirSync(PROFILE_DIR, { recursive: true });
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

let context;
let page;

function authorized(req, res, next) {
  const token = req.get("authorization")?.replace(/^Bearer\\s+/i, "");
  if (token !== CONTROL_TOKEN) return res.status(401).json({ error: "Неверный ключ доступа." });
  next();
}

async function ensureBrowser() {
  if (context && page && !page.isClosed()) return;
  context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: true,
    viewport: VIEWPORT,
    args: ["--no-sandbox"]
  });
  page = context.pages()[0] || await context.newPage();
  page.setDefaultTimeout(15000);
}

function allowedUrl(raw) {
  const u = new URL(raw);
  if (u.protocol !== "https:") throw new Error("Разрешены только HTTPS-сайты.");
  const host = u.hostname.toLowerCase();
  const allowed = ["kaggle.com", "www.kaggle.com", "accounts.google.com", "google.com", "www.google.com"];
  if (!allowed.includes(host) && !host.endsWith(".kaggle.com")) {
    throw new Error("Пока разрешены только Kaggle и страницы входа Google.");
  }
  return u.toString();
}

app.get("/health", (_req, res) => res.json({ ok: true, service: "browser-lab" }));

app.get("/api/status", authorized, async (_req, res) => {
  try {
    await ensureBrowser();
    res.json({ ok: true, url: page.url(), title: await page.title() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/open", authorized, async (req, res) => {
  try {
    const url = allowedUrl(String(req.body.url || ""));
    await ensureBrowser();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    res.json({ ok: true, url: page.url(), title: await page.title() });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// Credentials are used only to fill the live page. They are not logged or saved by this service.
app.post("/api/login", authorized, async (req, res) => {
  try {
    await ensureBrowser();
    const login = String(req.body.login || "").trim();
    const password = String(req.body.password || "");
    if (!login && !password) return res.status(400).json({ error: "Введи логин или пароль." });
    if (login.length > 320 || password.length > 1024) {
      return res.status(400).json({ error: "Проверь длину введённых данных." });
    }

    const visible = async locator => {
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        const item = locator.nth(i);
        if (await item.isVisible().catch(() => false) && await item.isEnabled().catch(() => false)) return item;
      }
      return null;
    };

    const passwordField = await visible(page.locator('input[type="password"]'));
    const emailField = await visible(page.locator('input[type="email"], input[autocomplete="username"], input[type="text"]'));

    if (passwordField) {
      if (emailField && login) await emailField.fill(login);
      if (password) await passwordField.fill(password);
      const submit = await visible(page.locator('button[type="submit"], input[type="submit"], button').filter({ hasText: /sign in|log in|continue|next|войти|далее/i }));
      if (submit) await submit.click();
      else await passwordField.press("Enter");
      return res.json({ ok: true, step: "submitted", message: "Данные отправлены форме входа. Проверяю страницу." });
    }

    if (emailField && login) {
      await emailField.fill(login);
      const next = await visible(page.locator('button[type="submit"], input[type="submit"], button').filter({ hasText: /continue|next|далее|продолжить/i }));
      if (next) await next.click();
      else await emailField.press("Enter");
      return res.json({ ok: true, step: "login", message: "Логин введён. Если сайт запросит пароль, нажми «Войти» ещё раз." });
    }

    return res.status(400).json({ error: "Не нашла поле логина или пароля на этой странице. Сначала открой страницу входа Kaggle." });
  } catch (e) {
    res.status(500).json({ error: "Не удалось заполнить форму: " + e.message });
  }
});

app.post("/api/click", authorized, async (req, res) => {
  try {
    await ensureBrowser();
    const x = Number(req.body.x), y = Number(req.body.y);
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0 || x > VIEWPORT.width || y > VIEWPORT.height) {
      return res.status(400).json({ error: "Координаты вне окна браузера." });
    }
    await page.mouse.click(x, y);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/type", authorized, async (req, res) => {
  try {
    await ensureBrowser();
    const text = String(req.body.text || "");
    if (text.length > 2000) return res.status(400).json({ error: "Слишком длинный текст." });
    await page.keyboard.type(text);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/press", authorized, async (req, res) => {
  try {
    await ensureBrowser();
    const key = String(req.body.key || "");
    const allowedKeys = ["Enter", "Tab", "Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Backspace"];
    if (!allowedKeys.includes(key)) return res.status(400).json({ error: "Эта клавиша пока не разрешена." });
    await page.keyboard.press(key);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/screenshot", authorized, async (_req, res) => {
  try {
    await ensureBrowser();
    const image = await page.screenshot({ type: "jpeg", quality: 65 });
    res.set("Content-Type", "image/jpeg").send(image);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/read", authorized, async (_req, res) => {
  try {
    await ensureBrowser();
    const text = (await page.locator("body").innerText({ timeout: 10000 })).slice(0, 12000);
    res.json({ ok: true, url: page.url(), title: await page.title(), text });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(PORT, () => console.log(`Browser Lab listening on ${PORT}`));
