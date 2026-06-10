import express from "express";
import dotenv from "dotenv";
import router from "./routes/index";
import connectDB from "./db/db";
import connectCloudinary from "./cloud/cloudinary";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { validateEnv, getAllowedOrigins } from "./config/env";

dotenv.config();
validateEnv();

const port = process.env.PORT || 3000;
const allowedOrigins = getAllowedOrigins();

const app = express();

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
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

connectDB();
connectCloudinary();

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
