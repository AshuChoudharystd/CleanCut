import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Request type to include `userId`
interface AuthRequest extends Request {
  userId?: string;
}

export const cartMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Expected format: "Bearer <token>"
    const token = authHeader;
    if (!token) {
      res.status(401).json({ message: "Invalid token format" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.userId = decoded.userId;

    next(); // pass to the next handler
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
