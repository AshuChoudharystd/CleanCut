"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const index_js_1 = __importDefault(require("./routes/index.js"));
dotenv_1.default.config();
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.Router());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/v1', index_js_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
