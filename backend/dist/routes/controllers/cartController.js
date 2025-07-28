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
exports.getCart = exports.removeFromCart = exports.addToCart = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const productModel_1 = __importDefault(require("../../models/productModel"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("addToCart body:", req.body);
        const userId = req.body.userId.userId;
        const productId = req.body.productId;
        const size = req.body.size;
        if (!size) {
            res.status(400).json({ message: "Select Product Size" });
            return;
        }
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if (!user.cartData) {
            user.cartData = {};
        }
        if (!user.cartData[productId]) {
            user.cartData[productId] = {};
        }
        user.cartData[productId][size] = (user.cartData[productId][size] || 0) + 1;
        user.markModified("cartData");
        yield user.save();
        res
            .status(200)
            .json({ message: "Product added to cart", cartData: user.cartData });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId.userId;
    const productId = req.body.productId;
    const size = req.body.size;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if (user.cartData &&
            user.cartData[productId] &&
            user.cartData[productId][size] !== undefined) {
            if (user.cartData[productId][size] > 1) {
                user.cartData[productId][size] -= 1;
            }
            else {
                delete user.cartData[productId][size];
                if (Object.keys(user.cartData[productId]).length === 0) {
                    delete user.cartData[productId];
                }
            }
            user.markModified("cartData");
            yield user.save();
            res.status(200).json({ message: "Product removed from cart" });
        }
        else {
            res.status(400).json({ message: "Product not in cart" });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.removeFromCart = removeFromCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId.userId;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ cart: user.cartData });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getCart = getCart;
