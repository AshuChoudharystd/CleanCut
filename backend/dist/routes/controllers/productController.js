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
exports.getProductById = exports.getProducts = exports.updateProducts = exports.removeProducts = exports.addProducts = void 0;
const productModel_1 = __importDefault(require("../../models/productModel"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const uploadToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_1.v2.uploader.upload(filePath, { resource_type: "image" });
    fs_1.default.unlink(filePath, () => { });
    return result.secure_url;
});
const addProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { name, price, description, category, subCategory, sizes, bestseller } = req.body;
    const files = req.files;
    const image1 = (_a = files === null || files === void 0 ? void 0 : files.image1) === null || _a === void 0 ? void 0 : _a[0];
    const image2 = (_b = files === null || files === void 0 ? void 0 : files.image2) === null || _b === void 0 ? void 0 : _b[0];
    const image3 = (_c = files === null || files === void 0 ? void 0 : files.image3) === null || _c === void 0 ? void 0 : _c[0];
    const image4 = (_d = files === null || files === void 0 ? void 0 : files.image4) === null || _d === void 0 ? void 0 : _d[0];
    const images = [image1, image2, image3, image4].filter((image) => image !== undefined);
    if (!name || !price || !description || !category || !subCategory || !sizes) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        const imagesURL = yield Promise.all(images.map(img => uploadToCloudinary(img.path)));
        const product = yield productModel_1.default.create({
            name,
            price: Number(price),
            description,
            image: imagesURL,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true' || bestseller === true,
            date: new Date(),
        });
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
        return;
    }
    catch (_e) {
        res.status(500).json({ message: "Failed to create the product" });
        return;
    }
});
exports.addProducts = addProducts;
const removeProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!productId) {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }
    try {
        const product = yield productModel_1.default.findByIdAndDelete(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
        return;
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to delete the product" });
        return;
    }
});
exports.removeProducts = removeProducts;
const updateProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { name, price, description, category, subCategory, sizes, bestseller } = req.body;
    if (!name || !price || !description || !category || !subCategory || !sizes) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        const updatedFields = {
            name,
            price: Number(price),
            description,
            category,
            subCategory,
            sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes),
            bestseller: bestseller === 'true' || bestseller === true,
        };
        const product = yield productModel_1.default.findByIdAndUpdate(productId, updatedFields, { new: true });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product updated successfully", product });
        return;
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to update the product" });
        return;
    }
});
exports.updateProducts = updateProducts;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find({});
        res.status(200).json({ message: "Products fetched successfully", products });
        return;
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to fetch products" });
        return;
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!productId) {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }
    try {
        const product = yield productModel_1.default.findById(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product fetched successfully", product });
        return;
    }
    catch (_a) {
        res.status(500).json({ message: "Failed to fetch the product" });
        return;
    }
});
exports.getProductById = getProductById;
