import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController";


const cartRouter = express();
cartRouter.use(express.json());
cartRouter.use(express.Router());



export default cartRouter;
