import productModel from "../../models/productModel";
import {Request,Response} from "express";
import cloudinary from "cloudinary";
    

export const addProducts = async(req:Request,res:Response)=>{
    const { name, price, description, category, subCategory, sizes, bestseller } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const image1 = files.image1 && files?.image1?.[0];
    const image2 = files.image2 && files?.image2?.[0];
    const image3 = files.image3 && files?.image3?.[0];
    const image4 = files.image4 && files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(image => image!==undefined);
    
    if (!name || !price || !description || !category || !subCategory || !sizes) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }

    let imagesURL = await Promise.all(
        images.map(async (image) => {
            if (image) {
                let result = await cloudinary.v2.uploader.upload(image.path,{resource_type:"image"});
                return result.secure_url;
            }
            return null;
        })
    );

    try{
        const product = await productModel.create({
            name,
            price:Number(price),
            description,
            image:imagesURL,
            category,
            subCategory,
            sizes:JSON.parse(sizes),
            bestseller: bestseller || false,
            date: new Date(),
        });

        if(!product){
            res.status(404).json({
                msg:"Failed to create the product into the website"
            });
            return;
        }

        res.status(201).json({
            message:"Product created successfully",
            product:product
        });
        return;
    }catch(error) {
        res.status(500).json({
            message:"Failed to create the product into the website",
            error:error
        });
        return;
    }
}

export const removeProducts =async (req:Request,res:Response)=>{
    const { productId } = req.params;

    if (!productId) {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }

    try{
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json({
            message: "Product deleted successfully",
            product: product
        });
        return;
    }catch(error) {
        res.status(500).json({
            message: "Failed to delete the product",
            error: error
        });
        return;
    }
}

export const updateProducts = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { name, price, description, category, subCategory, sizes, bestseller } = req.body;

  if (!name || !price || !description || !category || !subCategory || !sizes) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    const updatedFields: any = {
      name,
      price: Number(price),
      description,
      category,
      subCategory,
      sizes: Array.isArray(sizes) ? sizes : JSON.parse(sizes),
      bestseller: bestseller || false,
    };

    const product = await productModel.findByIdAndUpdate(productId, updatedFields, { new: true });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Failed to update the product",
      error,
    });
    return;
  }
};

export const getProducts= async(req:Request,res:Response) => {
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
}

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
        res.status(200).json({
            message: "Product fetched successfully",
            product: product
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch the product",
            error: error
        });
        return;
    }
}