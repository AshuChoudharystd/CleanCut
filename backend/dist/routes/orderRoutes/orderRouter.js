"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderRouter = express_1.default.Router();
orderRouter.use(express_1.default.json());
orderRouter.use(express_1.default.Router());
const orderController_1 = require("../controllers/orderController");
const userMiddleware_1 = __importDefault(require("../../middleware/userMiddleware"));
orderRouter.get("/", userMiddleware_1.default, orderController_1.getOrder);
orderRouter.post("/", userMiddleware_1.default, orderController_1.addOrder);
orderRouter.delete("/:orderId", userMiddleware_1.default, orderController_1.cancelOrder);
orderRouter.get("/all", userMiddleware_1.default, orderController_1.getAllOrders);
exports.default = orderRouter;
