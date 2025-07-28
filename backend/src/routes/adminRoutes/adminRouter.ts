import adminModel from "../../models/adminModel";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";
import bcrypt from "bcrypt";
import { addProducts, getProductById, getProducts, removeProducts, updateProducts } from "../controllers/productController";
import upload from "../../middleware/multer";
import adminMiddleware from "../../middleware/adminMiddleware";

const adminRouter = express.Router();
adminRouter.use(express.json());
const saltRounds = 10;

const adminSignupSchema = z.object({
  email: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

adminRouter.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = adminSignupSchema.safeParse(body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.errors });
    return;
  }
  let { email, password } = parsedData.data;

  if (password) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      password = hashedPassword;
    } catch (error) {
      res.status(500).json({ error: "Error hashing password" });
      return;
    }
  }

  try {
    const admin = await adminModel.create({
      email,
      password,
    });

    if (!admin) {
      res.status(400).json({ error: "Admin creation failed" });
      return;
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.ADMIN_JWT_SECRET as string
    );

    res.status(201).json({
      message: "Admin created successfully",
      admin: admin,
      token:token,
    });
    return;
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post("/login", async (req, res) => {
  const body = req.body;
  const parsedData = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }).safeParse(body);

  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.errors });
    return;
  }

  const { email, password } = parsedData.data;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.ADMIN_JWT_SECRET as string
    );

    res.status(200).json({
      message: "Login successful",
      admin: admin,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.get("/getProducts",adminMiddleware, getProducts);
adminRouter.post("/addProducts",upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]),adminMiddleware, addProducts);
adminRouter.get("/getProductById/:productId",adminMiddleware, getProductById);
adminRouter.put("/updateProducts/:productId",upload.none(), adminMiddleware,updateProducts);
adminRouter.delete("/removeProducts/:productId", adminMiddleware,removeProducts);


export default adminRouter;