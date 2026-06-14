import express from "express";
import dotenv from "dotenv";
import router from "./routes/index";
import connectDB from "./db/db";
import connectCloudinary from "./cloud/cloudinary";
import { connectRedis } from "./config/redis";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { validateEnv, getAllowedOrigins } from "./config/env";

dotenv.config();
validateEnv();

const port = process.env.PORT || 3000;
const allowedOrigins = getAllowedOrigins();

const app = express();

async function startServer() {
  try {
    await connectDB();
    await connectRedis();

    await connectCloudinary();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Startup Error:", error);
    process.exit(1);
  }
}

startServer();

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/api/v1", router);
