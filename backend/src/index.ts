import express from "express";
import dotenv from "dotenv";
import router from "./routes/index";
import connectDB from "./db/db";
import connectCloudinary from "./cloud/cloudinary";
import cors from "cors";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
connectDB();
connectCloudinary();

app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
