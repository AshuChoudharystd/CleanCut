import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { getBearerOrCookieToken } from "../utils/getToken";
import { verifyAdminAccessToken } from "../utils/tokens";

dotenv.config();

export interface AdminAuthRequest extends Request {
  adminId?: string;
}

export default function adminMiddleware(
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = getBearerOrCookieToken(req, "adminToken");

  if (!token) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }

  try {
    req.adminId = verifyAdminAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
