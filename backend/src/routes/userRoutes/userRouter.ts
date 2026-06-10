import express from "express";
import userModel from "../../models/userModel";
import { z } from "zod";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import userMiddleware, { AuthRequest } from "../../middleware/userMiddleware";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController";
import {
  setUserAuthCookies,
  clearUserAuthCookies,
} from "../../utils/authCookies";
import { issueUserSession, verifyUserRefreshToken } from "../../utils/tokens";
import { getRefreshCookieToken } from "../../utils/getToken";

dotenv.config();
const userRouter = express.Router();
const saltRounds = 10;

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

userRouter.post("/signup", async (req, res) => {
  const parsedData = signupSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.errors });
    return;
  }
  let { name, email, password } = parsedData.data;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    password = hashedPassword;
  } catch {
    res.status(500).json({ error: "Error hashing password" });
    return;
  }

  try {
    const user = await userModel.create({ name, email, password });
    const { accessToken, refreshToken } = issueUserSession(String(user._id));
    setUserAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "User created successfully",
      user: { _id: user._id, name: user.name, email: user.email },
      token: accessToken,
    });
    return;
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
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

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const { accessToken, refreshToken } = issueUserSession(String(user._id));
    setUserAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Login successful",
      user: { _id: user._id, name: user.name, email: user.email },
      token: accessToken,
    });
    return;
  } catch {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

userRouter.post("/refresh", async (req, res) => {
  const refreshToken = getRefreshCookieToken(req, "userRefreshToken");

  if (!refreshToken) {
    res.status(401).json({ error: "Refresh token required" });
    return;
  }

  try {
    const userId = verifyUserRefreshToken(refreshToken);
    const user = await userModel.findById(userId);
    if (!user) {
      clearUserAuthCookies(res);
      res.status(401).json({ error: "User not found" });
      return;
    }

    const session = issueUserSession(userId);
    setUserAuthCookies(res, session.accessToken, session.refreshToken);

    res.status(200).json({ message: "Token refreshed", token: session.accessToken });
  } catch {
    clearUserAuthCookies(res);
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

userRouter.post("/logout", (_req, res) => {
  clearUserAuthCookies(res);
  res.status(200).json({ message: "Logged out successfully" });
});

userRouter.get("/me", userMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await userModel.findById(req.userId).select("name email");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email } });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
  currentPassword: z.string().min(8, "Current password is required"),
});

userRouter.put("/update", userMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsedData = updateSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ error: parsedData.error.errors });
    return;
  }

  const { name, password, currentPassword } = parsedData.data;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const updates: { name?: string; password?: string } = {};
    if (name) updates.name = name;
    if (password) updates.password = await bcrypt.hash(password, saltRounds);

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true });

    res.status(200).json({
      message: "User updated successfully",
      user: { _id: updatedUser?._id, name: updatedUser?.name, email: updatedUser?.email },
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post("/add-to-cart", userMiddleware, addToCart);
userRouter.get("/get-cart", userMiddleware, getCart);
userRouter.delete("/remove-from-cart", userMiddleware, removeFromCart);

export default userRouter;
