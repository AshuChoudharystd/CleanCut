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
exports.getAllOrders = exports.cancelOrder = exports.getOrder = exports.addOrder = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const orderModel_1 = __importDefault(require("../../models/orderModel"));
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { address, totalCost, payment_mode } = req.body;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const cartData = user.cartData;
        if (!cartData || Object.keys(cartData).length === 0) {
            res.status(400).json({ success: false, message: "Cannot place order: Cart is empty" });
            return;
        }
        const newOrder = new orderModel_1.default({
            userId: userId,
            items: cartData,
            amount: totalCost,
            address: address,
            status: "Processing",
            date: new Date(),
            payment_mode: payment_mode,
        });
        yield newOrder.save();
        yield userModel_1.default.findByIdAndUpdate(userId, { cartData: {} });
        res.status(201).json({ success: true, message: "Order placed successfully!" });
    }
    catch (error) {
        console.error("Error in addOrder:", error);
        res.status(500).json({ success: false, message: "An error occurred while placing the order." });
    }
});
exports.addOrder = addOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const orders = yield orderModel_1.default.find({ userId: userId });
        res.status(200).json({ success: true, orders: orders });
    }
    catch (error) {
        console.error("Error in getOrders:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
});
exports.getOrder = getOrder;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const orderId = req.body.orderId;
    try {
        const order = yield orderModel_1.default.findOne({
            userId: userId,
            _id: orderId
        });
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }
        yield orderModel_1.default.deleteOne({ _id: orderId });
        res.status(200).json({ success: true, message: "Order cancelled successfully" });
    }
    catch (error) {
        console.error("Error in cancelOrder:", error);
        res.status(500).json({ success: false, message: "An error occurred while cancelling the order." });
    }
});
exports.cancelOrder = cancelOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const orders = yield orderModel_1.default.find({ userId: userId });
        if (!orders || orders.length === 0) {
            res.status(404).json({ success: false, message: "No orders found" });
            return;
        }
        res.status(200).json({ success: true, orders: orders });
    }
    catch (error) {
        console.error("Error in getAllOrders:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
});
exports.getAllOrders = getAllOrders;
