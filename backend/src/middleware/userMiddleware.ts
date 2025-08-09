import jwt  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  userId?: string; // or whatever type your decoded user ID is
}

export default function userMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    
    if (!token) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.USER_JWT_SECRET as string);
        req.userId = (decoded as any).userId;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
}