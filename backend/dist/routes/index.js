"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexApp = (0, express_1.default)();
indexApp.use(express_1.default.json());
indexApp.use(express_1.default.Router());
indexApp.get('/', (req, res) => {
    res.send('API is running on http://localhost:3001/api/v1 using routing');
});
exports.default = indexApp;
