import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL; // your .env var

const AddProducts = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
    sizes: "", // comma-separated, will convert to array
    bestseller: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // handle field updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.category ||
      !formData.subCategory ||
      !formData.sizes
    ) {
      toast.error("All fields are required!");
      return;
    }

    // convert sizes into array
    let sizesArray: string[];
    try {
      sizesArray = formData.sizes.split(",").map((s) => s.trim());
    } catch {
      toast.error("Invalid sizes format");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("sizes", JSON.stringify(sizesArray));
    data.append("bestseller", String(formData.bestseller));

    // append up to 4 images
    images.forEach((img, idx) => {
      data.append(`image${idx + 1}`, img);
    });

    try {
      setLoading(true);
      await axios.post(`${backendUrl}/admin/addProducts`, data, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        subCategory: "",
        sizes: "",
        bestseller: false,
      });
      setImages([]);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-3 rounded"
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="border p-3 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded"
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 rounded"
        />
        <input
          name="subCategory"
          placeholder="Sub Category"
          value={formData.subCategory}
          onChange={handleChange}
          className="border p-3 rounded"
        />
        <input
          name="sizes"
          placeholder="Sizes (comma separated, e.g. S,M,L)"
          value={formData.sizes}
          onChange={handleChange}
          className="border p-3 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            name="bestseller"
            type="checkbox"
            checked={formData.bestseller}
            onChange={handleChange}
          />
          Bestseller
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="border p-3 rounded"
        />
        {images.length > 0 && (
          <div className="text-sm text-gray-600">
            {images.length} file(s) selected
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
