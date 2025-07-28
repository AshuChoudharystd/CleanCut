"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: (Array),
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    sizes: {
        type: (Array),
        required: true,
    },
    bestseller: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    }
});
const productModel = mongoose_1.default.models['product'] || mongoose_1.default.model('product', productSchema);
exports.default = productModel;
