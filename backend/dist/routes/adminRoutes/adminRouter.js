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
const adminModel_1 = __importDefault(require("../../models/adminModel"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const productController_1 = require("../controllers/productController");
const multer_1 = __importDefault(require("../../middleware/multer"));
const adminMiddleware_1 = __importDefault(require("../../middleware/adminMiddleware"));
const adminRouter = express_1.default.Router();
adminRouter.use(express_1.default.json());
const saltRounds = 10;
const adminSignupSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, "Username is required"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
adminRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = adminSignupSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.errors });
        return;
    }
    let { email, password } = parsedData.data;
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
        const admin = yield adminModel_1.default.create({
            email,
            password,
        });
        if (!admin) {
            res.status(400).json({ error: "Admin creation failed" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id }, process.env.ADMIN_JWT_SECRET);
        res.status(201).json({
            message: "Admin created successfully",
            admin: admin,
            token: token,
        });
        return;
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: "Username already exists" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
}));
adminRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    }).safeParse(body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error.errors });
        return;
    }
    const { email, password } = parsedData.data;
    try {
        const admin = yield adminModel_1.default.findOne({ email });
        if (!admin) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id }, process.env.ADMIN_JWT_SECRET);
        res.status(200).json({
            message: "Login successful",
            admin: admin,
            token: token,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
adminRouter.get("/getProducts", adminMiddleware_1.default, productController_1.getProducts);
adminRouter.post("/addProducts", multer_1.default.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), adminMiddleware_1.default, productController_1.addProducts);
adminRouter.get("/getProductById/:productId", adminMiddleware_1.default, productController_1.getProductById);
adminRouter.put("/updateProducts/:productId", multer_1.default.none(), adminMiddleware_1.default, productController_1.updateProducts);
adminRouter.delete("/removeProducts/:productId", adminMiddleware_1.default, productController_1.removeProducts);
exports.default = adminRouter;
