"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userMiddleware;
const dotenv_1 = __importDefault(require("dotenv"));
const getToken_1 = require("../utils/getToken");
const tokens_1 = require("../utils/tokens");
dotenv_1.default.config();
function userMiddleware(req, res, next) {
    const token = (0, getToken_1.getBearerOrCookieToken)(req, "userToken");
    if (!token) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }
    try {
        req.userId = (0, tokens_1.verifyUserAccessToken)(token);
        next();
    }
    catch (_a) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
