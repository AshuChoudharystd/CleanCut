import express from 'express';
import userRouter from './userRoutes/userRouter';
import adminRouter from './adminRoutes/adminRouter';
import { getProductById, getProducts } from './controllers/productController';
import productModel from '../models/productModel';
import orderRouter from './orderRoutes/orderRouter';
import redisClient from '../config/redis';

const router = express.Router();

router.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        auth: { userMe: true, userRefresh: true, adminRefresh: true },
    });
});

router.get('/', async(_req, res) => {
    try {
        const catched = await redisClient.get("products");
        if(catched){
           res.status(200).json({message:"using redis",...JSON.parse(catched)});
           return ;
        }
        const products = await productModel.find({});
        await redisClient.setEx("products", 300, JSON.stringify(products));
        res.status(200).json({
            message: "Products fetched successfully",
            products,
        });
    } catch {
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.get("/getProducts", getProducts);
router.get("/getProductById/:productId", getProductById);
router.use('/orders', orderRouter);

export default router;