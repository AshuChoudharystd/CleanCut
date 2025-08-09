import express from 'express';
import userRouter from './userRoutes/userRouter';
import adminRouter from './adminRoutes/adminRouter';
import { getProductById, getProducts } from './controllers/productController';
import productModel from '../models/productModel';
import orderRouter from './orderRoutes/orderRouter';

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({
            message: "Products fetched successfully",
            products: products
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error
        });
        return;
    }
});

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.get("/getProducts", getProducts);
router.get("/getProductById/:productId", getProductById);
router.use('/orders',orderRouter);

export default router;