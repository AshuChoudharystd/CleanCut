import adminModel from "../../models/adminModel";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";
import bcrypt from "bcrypt";
import { addProducts, getProductById, getProducts, removeProducts, updateProducts } from "../controllers/productController";
import { getAllOrdersAdmin, updateOrderStatus } from "../controllers/orderController";
import upload from "../../middleware/multer";
import adminMiddleware, { AdminAuthRequest } from "../../middleware/adminMiddleware";
import {
  setAdminAuthCookies,
  clearAdminAuthCookies,
} from "../../utils/authCookies";
import { issueAdminSession, verifyAdminRefreshToken } from "../../utils/tokens";
import { getRefreshCookieToken } from "../../utils/getToken";

const adminRouter = express.Router();
adminRouter.use(express.json());

adminRouter.post("/login", async (req, res) => {
  const parsedData = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }).safeParse(req.body);

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

    const { accessToken, refreshToken } = issueAdminSession(String(admin._id));
    setAdminAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Login successful",
      admin: { _id: admin._id, email: admin.email },
      token: accessToken,
    });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.post("/refresh", async (req, res) => {
  const refreshToken = getRefreshCookieToken(req, "adminRefreshToken");

  if (!refreshToken) {
    res.status(401).json({ error: "Refresh token required" });
    return;
  }

  try {
    const adminId = verifyAdminRefreshToken(refreshToken);
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      clearAdminAuthCookies(res);
      res.status(401).json({ error: "Admin not found" });
      return;
    }

    const session = issueAdminSession(adminId);
    setAdminAuthCookies(res, session.accessToken, session.refreshToken);

    res.status(200).json({ message: "Token refreshed", token: session.accessToken });
  } catch {
    clearAdminAuthCookies(res);
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

adminRouter.post("/logout", (_req, res) => {
  clearAdminAuthCookies(res);
  res.status(200).json({ message: "Logged out successfully" });
});

adminRouter.get("/me", adminMiddleware, async (req: AdminAuthRequest, res) => {
  try {
    const admin = await adminModel.findById(req.adminId).select("email");
    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }
    res.status(200).json({ admin: { _id: admin._id, email: admin.email } });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.get("/getProducts", adminMiddleware, getProducts);
adminRouter.post("/addProducts", adminMiddleware, upload.fields([{name:"image1",maxCount:1},{name:"image2",maxCount:1},{name:"image3",maxCount:1},{name:"image4",maxCount:1}]), addProducts);
adminRouter.get("/getProductById/:productId", adminMiddleware, getProductById);
adminRouter.put("/updateProducts/:productId", adminMiddleware, upload.none(), updateProducts);
adminRouter.delete("/removeProducts/:productId", adminMiddleware, removeProducts);
adminRouter.get("/orders", adminMiddleware, getAllOrdersAdmin);
adminRouter.put("/orders/:orderId/status", adminMiddleware, updateOrderStatus);

export default adminRouter;
