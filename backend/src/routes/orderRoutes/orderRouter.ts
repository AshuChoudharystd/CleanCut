import express from "express";
const orderRouter = express.Router();
orderRouter.use(express.json());
orderRouter.use(express.Router());

import { getOrder, addOrder,cancelOrder, getAllOrders } from "../controllers/orderController";
import userMiddleware from "../../middleware/userMiddleware";

orderRouter.get("/", userMiddleware, getOrder);
orderRouter.post("/", userMiddleware, addOrder);
orderRouter.delete("/:orderId", userMiddleware, cancelOrder);
orderRouter.get("/all", userMiddleware, getAllOrders);

export default orderRouter;