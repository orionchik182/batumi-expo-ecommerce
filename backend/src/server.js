import "dotenv/config";
import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import { Webhook } from "svix";
import cors from "cors";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";

const app = express();

const __dirname = path.resolve();

// === 1. ВЕБХУК CLERK ===
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const SIGNING_SECRET = ENV.CLERK_WEBHOOK_SECRET;

      if (!SIGNING_SECRET) {
        console.error("Ошибка: Нет CLERK_WEBHOOK_SECRET");
        return res.status(500).json({ error: "Missing secret" });
      }

      const wh = new Webhook(SIGNING_SECRET);
      const payload = req.body.toString();
      const headers = req.headers;

      let evt;
      try {
        evt = wh.verify(payload, headers);
      } catch (err) {
        console.error("Ошибка верификации вебхука:", err.message);
        return res.status(400).json({ error: "Verification failed" });
      }

      const eventType = evt.type;
      console.log(`Успешно получен вебхук от Clerk: ${eventType}`);

      if (eventType === "user.created" || eventType === "user.deleted") {
        try {
          console.log("Отправляем событие в Inngest...");
          await inngest.send({
            name: `clerk/${eventType}`,
            data: evt.data,
          });
          console.log("Событие успешно отправлено в Inngest!");
        } catch (inngestErr) {
          console.error("КРИТИЧЕСКАЯ ОШИБКА INNGEST:", inngestErr.message);
          return res.status(500).json({ error: "Inngest send failed" });
        }
      }

      res.status(200).json({ success: true });
    } catch (globalError) {
      console.error("Неизвестная ошибка в вебхуке:", globalError);
      res.status(500).json({ error: "Internal Server Error" });
    }
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

const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "https://batumi-expo-ecommerce.serg-batumi2022.workers.dev",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// === 5. МАРШРУТЫ ПРОВЕРКИ ЗДОРОВЬЯ ===
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// === 6. РАЗДАЧА ФРОНТЕНДА (не используется, так как фронтенд на Cloudflare) ===



// === 7. ЗАПУСК СЕРВЕРА ===
connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });
}

app.use((err, req, res, next) => {
  console.error("Global Error Handler Caught:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: ENV.NODE_ENV === "development" ? err.stack : undefined
  });
});

export default app;