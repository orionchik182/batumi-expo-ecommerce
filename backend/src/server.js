import express from "express";
import { ENV } from "./config/env.js";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import { Webhook } from "svix";

import { connectDB } from "./config/db.js";

const app = express();

const __dirname = path.resolve();

// === 1. ВЕБХУК CLERK ===
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const SIGNING_SECRET = ENV.CLERK_WEBHOOK_SECRET;

    if (!SIGNING_SECRET) {
      console.error("Ошибка: Нет CLERK_WEBHOOK_SECRET в .env");
      return res.status(500).send("Server Error");
    }

    const wh = new Webhook(SIGNING_SECRET);
    const payload = req.body.toString();
    const headers = req.headers;

    let evt;
    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      console.error("Ошибка верификации вебхука:", err.message);
      return res.status(400).json({ success: false });
    }

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.deleted") {
      await inngest.send({
        name: `clerk/${eventType}`,
        data: evt.data,
      });
    }

    res.status(200).json({ success: true });
  },
);

// === 2. БАЗОВЫЕ НАСТРОЙКИ ===
app.use(express.json());

// === 3. INNGEST ===
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

// === 4. CLERK ===
app.use(clerkMiddleware());

// === 5. МАРШРУТЫ ПРОВЕРКИ ЗДОРОВЬЯ ===
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// === 6. РАЗДАЧА ФРОНТЕНДА (Оставил правильный путь на будущее) ===
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../admin/dist", "index.html"));
  });
}

// === 7. ЗАПУСК СЕРВЕРА ===
const startServer = async () => {
  await connectDB();

  // 0.0.0.0 необходим для работы в Docker-контейнерах на Sevalla
  app.listen(ENV.PORT, "0.0.0.0", () => {
    console.log(`Server is up and running on port ${ENV.PORT}`);
  });
};

startServer();
