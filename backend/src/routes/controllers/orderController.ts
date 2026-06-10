import { Request, Response } from "express";
import userModel from "../../models/userModel";
import productModel from "../../models/productModel";
import orderModel from "../../models/orderModel";
import { AuthRequest } from "../../middleware/userMiddleware";

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"] as const;

export const addOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const { address, payment_mode } = req.body;

    if (!address || !payment_mode) {
        res.status(400).json({ success: false, message: "Address and payment mode are required" });
        return;
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const cartData = user.cartData as Record<string, Record<string, number>>;
        if (!cartData || Object.keys(cartData).length === 0) {
            res.status(400).json({ success: false, message: "Cannot place order: Cart is empty" });
            return;
        }

        let amount = 0;
        for (const productId in cartData) {
            const product = await productModel.findById(productId);
            if (!product) {
                res.status(400).json({ success: false, message: "One or more products in your cart no longer exist" });
                return;
            }

            for (const size in cartData[productId]) {
                amount += product.price * cartData[productId][size];
            }
        }

        const newOrder = new orderModel({
            userId,
            items: cartData,
            amount,
            address,
            status: "Processing",
            date: new Date(),
            payment_mode,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ success: true, message: "Order placed successfully!" });
    } catch {
        res.status(500).json({ success: false, message: "An error occurred while placing the order." });
    }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    try {
        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, orders });
    } catch {
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const orderId = req.params.orderId;

    try {
        const order = await orderModel.findOne({ userId, _id: orderId });
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }

        if (order.status !== "Processing") {
            res.status(400).json({ success: false, message: "Only processing orders can be cancelled" });
            return;
        }

        await orderModel.deleteOne({ _id: orderId });
        res.status(200).json({ success: true, message: "Order cancelled successfully" });
    } catch {
        res.status(500).json({ success: false, message: "An error occurred while cancelling the order." });
    }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    try {
        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, orders });
    } catch {
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
};

export const getAllOrdersAdmin = async (_req: Request, res: Response) => {
    try {
        const orders = await orderModel.find({}).populate("userId", "name email").sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch {
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
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
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Order status updated", order });
    } catch {
        res.status(500).json({ success: false, message: "An error occurred while updating the order." });
    }
};
