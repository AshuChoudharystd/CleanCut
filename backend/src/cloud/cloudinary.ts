import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const connectCloudinary = async() => {
    cloudinary.config({
        cloud_name: process.env.Cloudinary_NAME,
        api_key: process.env.Cloudinary_API_KEY,
        api_secret: process.env.Cloudinary_API_SECRET,
    });
};

export default connectCloudinary;