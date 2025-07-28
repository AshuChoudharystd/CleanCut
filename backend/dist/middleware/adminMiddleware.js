"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = adminMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ADMIN_JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
}
