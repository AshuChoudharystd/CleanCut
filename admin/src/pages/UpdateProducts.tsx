import { Package } from "lucide-react";
import { useContext, useState } from "react";
import { adminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateProducts = () => {
  const { products } = useContext(adminContext);

  const [current, setCurrent] = useState<string>("");
  const [editData, setEditData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status: string, stock: number) => {
    if (stock === 0 || status === "Out of Stock")
      return "bg-red-100 text-red-700 border border-red-200";
    if (stock < 15)
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    return "bg-green-100 text-green-800 border border-green-200";
  };

  const handleEditClick = (product: any) => {
    setCurrent(product._id);
    setEditData({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      sizes: product.sizes?.join(",") || "", // join to string for input
      bestseller: product.bestseller || false,
    });
  };

  const handleUpdate = async () => {
    if (!current || !editData) return;
    // convert sizes back to array
    const payload = {
      ...editData,
      sizes: editData.sizes
        ? editData.sizes.split(",").map((s: string) => s.trim())
        : [],
    };

    try {
      setLoading(true);
      await axios.put(`${backendUrl}/admin/updateProducts/${current}`, payload, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      toast.success("Product updated successfully!");
      setEditData(null);
      setCurrent("");
      window.location.reload(); // or refetch products
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Update Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row overflow-hidden"
            >
              {/* Image section */}
              <div className="relative md:w-1/3 w-full h-90 bg-gray-100">
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="w-full h-full object-fill"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    product.status,
                    product.stock
                  )}`}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.stock < 15
                    ? "Low Stock"
                    : product.status || "Available"}
                </span>
              </div>

              {/* Content section */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">
                  {product.name}
                </h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    {product.subCategory}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Package size={16} className="text-gray-500" />
                    <span>{product.stock} in stock</span>
                  </div>
                </div>

                <div>{product.description}</div>

                <div className="mr-10 mt-5">
                  <div className="flex justify-end">
                    <button
                      className="border-0 bg-blue-600 text-white font-semibold text-2xl p-2 rounded-lg hover:ease-in hover:scale-110"
                      onClick={() => handleEditClick(product)}
                    >
                      Update Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder="Product Name"
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: e.target.value })
                }
                placeholder="Price"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                placeholder="Category"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={editData.subCategory}
                onChange={(e) =>
                  setEditData({ ...editData, subCategory: e.target.value })
                }
                placeholder="Sub Category"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={editData.sizes}
                onChange={(e) =>
                  setEditData({ ...editData, sizes: e.target.value })
                }
                placeholder="Sizes (comma separated)"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={editData.bestseller}
                onChange={(e) =>
                  setEditData({ ...editData, bestseller: e.target.value })
                }
                placeholder="Bestseller (true/false)"
                className="border p-2 rounded"
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Description"
                className="border p-2 rounded"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => {
                    setEditData(null);
                    setCurrent("");
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleUpdate}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProducts;
