import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { getBearerOrCookieToken } from "../utils/getToken";
import { verifyUserAccessToken } from "../utils/tokens";

dotenv.config();

export interface AuthRequest extends Request {
  userId?: string;
}

export default function userMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = getBearerOrCookieToken(req, "userToken");

  if (!token) {
    res.status(401).json({ error: "Unauthorized access" });
    return;
  }

  try {
    req.userId = verifyUserAccessToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
