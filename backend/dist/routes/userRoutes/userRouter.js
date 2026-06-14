"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const userMiddleware_1 = __importDefault(require("../../middleware/userMiddleware"));
const cartController_1 = require("../controllers/cartController");
const authCookies_1 = require("../../utils/authCookies");
const tokens_1 = require("../../utils/tokens");
const getToken_1 = require("../../utils/getToken");
const redis_1 = __importDefault(require("../../config/redis"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = require("rate-limit-redis");
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Try again later",
    },
    store: new rate_limit_redis_1.RedisStore({
        sendCommand: (...args) => redis_1.default.sendCommand(args),
    })
});
dotenv_1.default.config();
const userRouter = express_1.default.Router();
const saltRounds = 10;
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
userRouter.post("/signup", limiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.errors });
        return;
    }
    let { name, email, password } = parsedData.data;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        password = hashedPassword;
    }
    catch (_a) {
        res.status(500).json({ error: "Error hashing password" });
        return;
    }
    try {
        const user = yield userModel_1.default.create({ name, email, password });
        const { accessToken, refreshToken } = (0, tokens_1.issueUserSession)(String(user._id));
        (0, authCookies_1.setUserAuthCookies)(res, accessToken, refreshToken);
        res.status(201).json({
            message: "User created successfully",
            user: { _id: user._id, name: user.name, email: user.email },
            token: accessToken,
        });
        return;
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "Email already exists" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
userRouter.post("/login", limiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.errors });
        return;
    }
    const { email, password } = parsedData.data;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const { accessToken, refreshToken } = (0, tokens_1.issueUserSession)(String(user._id));
        (0, authCookies_1.setUserAuthCookies)(res, accessToken, refreshToken);
        res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email },
            token: accessToken,
        });
        return;
    }
    catch (_a) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
userRouter.post("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = (0, getToken_1.getRefreshCookieToken)(req, "userRefreshToken");
    if (!refreshToken) {
        res.status(401).json({ error: "Refresh token required" });
        return;
    }
    try {
        const userId = (0, tokens_1.verifyUserRefreshToken)(refreshToken);
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            (0, authCookies_1.clearUserAuthCookies)(res);
            res.status(401).json({ error: "User not found" });
            return;
        }
        const session = (0, tokens_1.issueUserSession)(userId);
        (0, authCookies_1.setUserAuthCookies)(res, session.accessToken, session.refreshToken);
        res.status(200).json({ message: "Token refreshed", token: session.accessToken });
    }
    catch (_a) {
        (0, authCookies_1.clearUserAuthCookies)(res);
        res.status(401).json({ error: "Invalid or expired refresh token" });
    }
}));
userRouter.post("/logout", (_req, res) => {
    (0, authCookies_1.clearUserAuthCookies)(res);
    res.status(200).json({ message: "Logged out successfully" });
});
userRouter.get("/me", userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catched = yield redis_1.default.get(`user${req.userId}`);
        if (catched) {
            const user = JSON.parse(catched);
            res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email } });
            return;
        }
        const user = yield userModel_1.default.findById(req.userId).select("name email");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        yield redis_1.default.setEx(`user${req.userId}`, 3600, JSON.stringify(user));
        res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email } });
    }
    catch (_a) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
const updateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    password: zod_1.z.string().min(8).optional(),
    currentPassword: zod_1.z.string().min(8, "Current password is required"),
});
userRouter.put("/update", userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: "Current password is incorrect" });
            return;
        }
        const updates = {};
        if (name)
            updates.name = name;
        if (password)
            updates.password = yield bcrypt_1.default.hash(password, saltRounds);
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({
            message: "User updated successfully",
            user: { _id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id, name: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name, email: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email },
        });
    }
    catch (_a) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/add-to-cart", userMiddleware_1.default, cartController_1.addToCart);
userRouter.get("/get-cart", userMiddleware_1.default, cartController_1.getCart);
userRouter.delete("/remove-from-cart", userMiddleware_1.default, cartController_1.removeFromCart);
exports.default = userRouter;
