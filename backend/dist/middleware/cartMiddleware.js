"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cartMiddleware = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next(); // pass to the next handler
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
};
exports.cartMiddleware = cartMiddleware;
