import productModel from "../../models/productModel";
import {Request,Response} from "express";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

const uploadToCloudinary = async (filePath: string): Promise<string> => {
    const result = await cloudinary.uploader.upload(filePath, { resource_type: "image" });
    fs.unlink(filePath, () => {});
    return result.secure_url;
};

export const addProducts = async(req:Request,res:Response)=>{
    const { name, price, description, category, subCategory, sizes, bestseller } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const image1 = files?.image1?.[0];
    const image2 = files?.image2?.[0];
    const image3 = files?.image3?.[0];
    const image4 = files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((image): image is Express.Multer.File => image !== undefined);
    
    if (!name || !price || !description || !category || !subCategory || !sizes) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    try {
        const imagesURL = await Promise.all(images.map(img => uploadToCloudinary(img.path)));

        const product = await productModel.create({
            name,
            price: Number(price),
            description,
            image: imagesURL,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === 'true' || bestseller === true,
            date: new Date(),
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
        return;
    } catch {
        res.status(500).json({ message: "Failed to create the product" });
        return;
    }
};

export const removeProducts = async (req:Request,res:Response) => {
    const { productId } = req.params;

    if (!productId) {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }

    try {
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted successfully" });
        return;
    } catch {
        res.status(500).json({ message: "Failed to delete the product" });
        return;
    }
};

export const updateProducts = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { name, price, description, category, subCategory, sizes, bestseller } = req.body;

  if (!name || !price || !description || !category || !subCategory || !sizes) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const updatedFields: Record<string, unknown> = {
      name,
      price: Number(price),
      description,
      category,
      subCategory,
      sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes),
      bestseller: bestseller === 'true' || bestseller === true,
    };

    const product = await productModel.findByIdAndUpdate(productId, updatedFields, { new: true });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({ message: "Product updated successfully", product });
    return;
  } catch {
    res.status(500).json({ message: "Failed to update the product" });
    return;
  }
};

export const getProducts = async(req:Request,res:Response) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ message: "Products fetched successfully", products });
        return;
    } catch {
        res.status(500).json({ message: "Failed to fetch products" });
        return;
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const { productId } = req.params;

    if (!productId) {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }

    try {
        const product = await productModel.findById(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product fetched successfully", product });
        return;
    } catch {
        res.status(500).json({ message: "Failed to fetch the product" });
        return;
    }
};