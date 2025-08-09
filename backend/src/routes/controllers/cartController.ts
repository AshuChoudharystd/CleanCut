import { Request, Response } from "express";
import userModel from "../../models/userModel";
import productModel from "../../models/productModel";

interface AuthRequest extends Request {
  userId?: string;
} 

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    console.log("addToCart body:", req.body);

    const userId = req.userId;
    const productId = req.body.productId;
    const size = req.body.size;

    if (!size) {
      res.status(400).json({ message: "Select Product Size" });
      return;
    }

    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const product = await productModel.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (!user.cartData) {
      user.cartData = {};
    }
    if (!user.cartData[productId]) {
      user.cartData[productId] = {};
    }
    user.cartData[productId][size] = (user.cartData[productId][size] || 0) + 1;

    user.markModified("cartData");
    await user.save();

    res
      .status(200)
      .json({ message: "Product added to cart", cartData: user.cartData });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const productId = req.body.productId;
  const size = req.body.size;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const product = await productModel.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (
      user.cartData &&
      user.cartData[productId] &&
      user.cartData[productId][size] !== undefined
    ) {
      if (user.cartData[productId][size] > 1) {
        user.cartData[productId][size] -= 1;
      } else {
        delete user.cartData[productId][size];

        if (Object.keys(user.cartData[productId]).length === 0) {
          delete user.cartData[productId];
        }
      }

      user.markModified("cartData");
      await user.save();

      res.status(200).json({ message: "Product removed from cart" });
    } else {
      res.status(400).json({ message: "Product not in cart" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ cartData: user.cartData || {} }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
