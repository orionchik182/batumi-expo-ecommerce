import express from "express";
import { ENV } from "./config/env.js";
import path from "path";
import { clerkMiddleware } from '@clerk/express'

import { connectDB } from "./config/db.js";

const app = express();

app.use(clerkMiddleware()); // adds auth object under the req => req.auth

const __dirname = path.resolve();

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile();
  });
}

app.listen(ENV.PORT, () => {
  console.log("Server is up and running");
  connectDB();
});
