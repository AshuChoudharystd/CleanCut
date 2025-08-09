import express from "express";
import userModel from "../../models/userModel";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userMiddleware from "../../middleware/userMiddleware";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController";

dotenv.config();
const userRouter = express.Router();
const saltRounds = 10;

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

userRouter.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = signupSchema.safeParse(body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.errors });
    return;
  }
  let { name, email, password } = parsedData.data;

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
    const user = await userModel.create({
      name,
      email,
      password,
    });

    if (!user) {
      res.status(400).json({ error: "User creation failed" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.USER_JWT_SECRET as string
    );

    res.status(201).json({
      message: "User created successfully",
      user: user,
      token: token,
    });
    return;
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

userRouter.post("/login", async (req, res) => {
  const parsedData = loginSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.errors });
    return;
  }

  const { email, password } = parsedData.data;

  try {
    const user = await userModel.findOne({ email });
    console.log(user);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = jwt.sign(
      { userId: user?._id },
      process.env.USER_JWT_SECRET as string
    );

    res.status(200).json({
      message: "Login successful",
      user: user,
      token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

userRouter.put("/update", userMiddleware, async (req, res) => {
  const userId = req.body.userId.userId;
  console.log(userId);

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  let { name, password } = req.body;

  password = await bcrypt.hash(password, saltRounds);
  console.log(password);

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { name, password },
      { new: true }
    );
    console.log(user);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post("/add-to-cart",userMiddleware, addToCart);
userRouter.get("/get-cart",userMiddleware, getCart);
userRouter.delete("/remove-from-cart",userMiddleware, removeFromCart);

export default userRouter;
