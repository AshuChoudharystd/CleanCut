import jwt  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export default function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    
    if (!token) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET as string);
        if(!decoded){
            res.status(401).json({ error: "Invalid token" });
            return ;
        }
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
}