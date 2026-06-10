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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const productController_1 = require("../controllers/productController");
const orderController_1 = require("../controllers/orderController");
const multer_1 = __importDefault(require("../../middleware/multer"));
const adminMiddleware_1 = __importDefault(require("../../middleware/adminMiddleware"));
const authCookies_1 = require("../../utils/authCookies");
const tokens_1 = require("../../utils/tokens");
const getToken_1 = require("../../utils/getToken");
const adminRouter = express_1.default.Router();
adminRouter.use(express_1.default.json());
adminRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
    }).safeParse(req.body);
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
        const { accessToken, refreshToken } = (0, tokens_1.issueAdminSession)(String(admin._id));
        (0, authCookies_1.setAdminAuthCookies)(res, accessToken, refreshToken);
        res.status(200).json({
            message: "Login successful",
            admin: { _id: admin._id, email: admin.email },
            token: accessToken,
        });
    }
    catch (_a) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
adminRouter.post("/refresh", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = (0, getToken_1.getRefreshCookieToken)(req, "adminRefreshToken");
    if (!refreshToken) {
        res.status(401).json({ error: "Refresh token required" });
        return;
    }
    try {
        const adminId = (0, tokens_1.verifyAdminRefreshToken)(refreshToken);
        const admin = yield adminModel_1.default.findById(adminId);
        if (!admin) {
            (0, authCookies_1.clearAdminAuthCookies)(res);
            res.status(401).json({ error: "Admin not found" });
            return;
        }
        const session = (0, tokens_1.issueAdminSession)(adminId);
        (0, authCookies_1.setAdminAuthCookies)(res, session.accessToken, session.refreshToken);
        res.status(200).json({ message: "Token refreshed", token: session.accessToken });
    }
    catch (_a) {
        (0, authCookies_1.clearAdminAuthCookies)(res);
        res.status(401).json({ error: "Invalid or expired refresh token" });
    }
}));
adminRouter.post("/logout", (_req, res) => {
    (0, authCookies_1.clearAdminAuthCookies)(res);
    res.status(200).json({ message: "Logged out successfully" });
});
adminRouter.get("/me", adminMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield adminModel_1.default.findById(req.adminId).select("email");
        if (!admin) {
            res.status(404).json({ error: "Admin not found" });
            return;
        }
        res.status(200).json({ admin: { _id: admin._id, email: admin.email } });
    }
    catch (_a) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
adminRouter.get("/getProducts", adminMiddleware_1.default, productController_1.getProducts);
adminRouter.post("/addProducts", adminMiddleware_1.default, multer_1.default.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), productController_1.addProducts);
adminRouter.get("/getProductById/:productId", adminMiddleware_1.default, productController_1.getProductById);
adminRouter.put("/updateProducts/:productId", adminMiddleware_1.default, multer_1.default.none(), productController_1.updateProducts);
adminRouter.delete("/removeProducts/:productId", adminMiddleware_1.default, productController_1.removeProducts);
adminRouter.get("/orders", adminMiddleware_1.default, orderController_1.getAllOrdersAdmin);
adminRouter.put("/orders/:orderId/status", adminMiddleware_1.default, orderController_1.updateOrderStatus);
exports.default = adminRouter;
