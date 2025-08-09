import { Request, Response } from "express";
import userModel from "../../models/userModel";
import orderModel from "../../models/orderModel";

interface AuthRequest extends Request {
  userId?: string;
}

export const addOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    const { address, totalCost, payment_mode } = req.body;

    try {

        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const cartData = user.cartData;
        if (!cartData || Object.keys(cartData).length === 0) {
            res.status(400).json({ success: false, message: "Cannot place order: Cart is empty" });
            return;
        }

        const newOrder = new orderModel({
            userId: userId,
            items: cartData,
            amount: totalCost,
            address: address,
            status: "Processing",
            date: new Date(),
            payment_mode: payment_mode,
        });

        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ success: true, message: "Order placed successfully!" });

    } catch (error) {
        console.error("Error in addOrder:", error);
        res.status(500).json({ success: false, message: "An error occurred while placing the order." });
    }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    try {
        const orders = await orderModel.find({ userId: userId });
        res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        console.error("Error in getOrders:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
};


export const cancelOrder = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const orderId = req.body.orderId;

    try {
        const order = await orderModel.findOne({
            userId: userId,
            _id: orderId
        });
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }
        await orderModel.deleteOne({ _id: orderId });
        res.status(200).json({ success: true, message: "Order cancelled successfully" });
    } catch (error) {   
        console.error("Error in cancelOrder:", error);
        res.status(500).json({ success: false, message: "An error occurred while cancelling the order." });
    }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    try {
        const orders = await orderModel.find({ userId: userId });
        if (!orders || orders.length === 0) {
            res.status(404).json({ success: false, message: "No orders found" });
            return;
        }
        res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        console.error("Error in getAllOrders:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching orders." });
    }
};


