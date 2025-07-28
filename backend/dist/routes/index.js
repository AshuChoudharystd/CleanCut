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
const userRouter_1 = __importDefault(require("./userRoutes/userRouter"));
const adminRouter_1 = __importDefault(require("./adminRoutes/adminRouter"));
const productController_1 = require("./controllers/productController");
const productModel_1 = __importDefault(require("../models/productModel"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find({});
        res.status(200).json({
            message: "Products fetched successfully",
            products: products
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error
        });
        return;
    }
}));
router.use('/user', userRouter_1.default);
router.use('/admin', adminRouter_1.default);
router.get("/getProducts", productController_1.getProducts);
router.get("/getProductById/:productId", productController_1.getProductById);
exports.default = router;
