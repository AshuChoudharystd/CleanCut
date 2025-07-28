"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartRouter = (0, express_1.default)();
cartRouter.use(express_1.default.json());
cartRouter.use(express_1.default.Router());
exports.default = cartRouter;
