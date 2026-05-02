import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }
  
  try {
    const conn = await mongoose.connect(ENV.DB_URL);
    isConnected = !!conn.connections[0].readyState;
    console.log(`Database connected successfully`);
  } catch (error) {
    console.error("Database connection failed", error.message);
  }
};
