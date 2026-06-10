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
exports.updateOrderStatus = exports.getAllOrdersAdmin = exports.getAllOrders = exports.cancelOrder = exports.getOrder = exports.addOrder = void 0;
const userModel_1 = __importDefault(require("../../models/userModel"));
const productModel_1 = __importDefault(require("../../models/productModel"));
const orderModel_1 = __importDefault(require("../../models/orderModel"));
const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { address, payment_mode } = req.body;
    if (!address || !payment_mode) {
        res.status(400).json({ success: false, message: "Address and payment mode are required" });
        return;
    }
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
        let amount = 0;
        for (const productId in cartData) {
            const product = yield productModel_1.default.findById(productId);
            if (!product) {
                res.status(400).json({ success: false, message: "One or more products in your cart no longer exist" });
                return;
            }
            for (const size in cartData[productId]) {
                amount += product.price * cartData[productId][size];
            }
        }
        const newOrder = new orderModel_1.default({
            userId,
            items: cartData,
            amount,
            address,
            status: "Processing",
            date: new Date(),
            payment_mode,
        });
        yield newOrder.save();
        yield userModel_1.default.findByIdAndUpdate(userId, { cartData: {} });
        res.status(201).json({ success: true, message: "Order placed successfully!" });
    }
    catch (_a) {
        res.status(500).json({ success: false, message: "An error occurred while placing the order." });
    }
});
exports.addOrder = addOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const orders = yield orderModel_1.default.find({ userId });
        res.status(200).json({ success: true, orders });
    }
    catch (_a) {
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
});
exports.getOrder = getOrder;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const orderId = req.params.orderId;
    try {
        const order = yield orderModel_1.default.findOne({ userId, _id: orderId });
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }
        if (order.status !== "Processing") {
            res.status(400).json({ success: false, message: "Only processing orders can be cancelled" });
            return;
        }
        yield orderModel_1.default.deleteOne({ _id: orderId });
        res.status(200).json({ success: true, message: "Order cancelled successfully" });
    }
    catch (_a) {
        res.status(500).json({ success: false, message: "An error occurred while cancelling the order." });
    }
});
exports.cancelOrder = cancelOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const orders = yield orderModel_1.default.find({ userId });
        res.status(200).json({ success: true, orders });
    }
    catch (_a) {
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
});
exports.getAllOrders = getAllOrders;
const getAllOrdersAdmin = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find({}).populate("userId", "name email").sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    }
    catch (_a) {
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
});
exports.getAllOrdersAdmin = getAllOrdersAdmin;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status || !ORDER_STATUSES.includes(status)) {
        res.status(400).json({
            success: false,
            message: `Status must be one of: ${ORDER_STATUSES.join(", ")}`,
        });
        return;
    }
    try {
        const order = yield orderModel_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Order status updated", order });
    }
    catch (_a) {
        res.status(500).json({ success: false, message: "An error occurred while updating the order." });
    }
});
exports.updateOrderStatus = updateOrderStatus;
