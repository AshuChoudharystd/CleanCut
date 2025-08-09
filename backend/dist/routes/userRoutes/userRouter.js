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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const userMiddleware_1 = __importDefault(require("../../middleware/userMiddleware"));
const cartController_1 = require("../controllers/cartController");
dotenv_1.default.config();
const userRouter = express_1.default.Router();
const saltRounds = 10;
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = signupSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.errors });
        return;
    }
    let { name, email, password } = parsedData.data;
    if (password) {
        try {
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            password = hashedPassword;
        }
        catch (error) {
            res.status(500).json({ error: "Error hashing password" });
            return;
        }
    }
    try {
        const user = yield userModel_1.default.create({
            name,
            email,
            password,
        });
        if (!user) {
            res.status(400).json({ error: "User creation failed" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.USER_JWT_SECRET);
        res.status(201).json({
            message: "User created successfully",
            user: user,
            token: token,
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
userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.errors });
        return;
    }
    const { email, password } = parsedData.data;
    try {
        const user = yield userModel_1.default.findOne({ email });
        console.log(user);
        if (!user) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user === null || user === void 0 ? void 0 : user._id }, process.env.USER_JWT_SECRET);
        res.status(200).json({
            message: "Login successful",
            user: user,
            token: token,
        });
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
        return;
    }
}));
userRouter.put("/update", userMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId.userId;
    console.log(userId);
    if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    let { name, password } = req.body;
    password = yield bcrypt_1.default.hash(password, saltRounds);
    console.log(password);
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(userId, { name, password }, { new: true });
        console.log(user);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({
            message: "User updated successfully",
            user: user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
userRouter.post("/add-to-cart", userMiddleware_1.default, cartController_1.addToCart);
userRouter.get("/get-cart", userMiddleware_1.default, cartController_1.getCart);
userRouter.delete("/remove-from-cart", userMiddleware_1.default, cartController_1.removeFromCart);
exports.default = userRouter;
