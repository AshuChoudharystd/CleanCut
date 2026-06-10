import { useContext, useState } from "react";
import { adminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { api } from "../lib/api";

interface EditData {
  name: string;
  price: string | number;
  description: string;
  category: string;
  subCategory: string;
  sizes: string;
  bestseller: boolean;
}

const UpdateProducts = () => {
  const { products, refreshProducts } = useContext(adminContext);
  const [current, setCurrent] = useState<string>("");
  const [editData, setEditData] = useState<EditData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEditClick = (product: (typeof products)[number]) => {
    setCurrent(product._id);
    setEditData({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      sizes: product.sizes?.join(",") || "",
      bestseller: product.bestseller || false,
    });
  };

  const handleUpdate = async () => {
    if (!current || !editData) return;

    const payload = {
      ...editData,
      sizes: editData.sizes ? editData.sizes.split(",").map((s) => s.trim()) : [],
    };

    try {
      setLoading(true);
      await api.put(`/admin/updateProducts/${current}`, payload);
      toast.success("Product updated successfully!");
      setEditData(null);
      setCurrent("");
      await refreshProducts();
    } catch (err) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      toast.error(axiosErr.response?.data?.error || "Failed to update product");
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
              key={product._id}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="md:w-1/3 w-full h-90 bg-gray-100">
                <img src={product.image?.[0]} alt={product.name} className="w-full h-full object-fill" />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">{product.name}</h3>
                <div className="text-2xl font-bold text-gray-900 mb-4">₹{product.price.toLocaleString()}</div>
                <div>{product.description}</div>
                <div className="mt-5 flex justify-end">
                  <button
                    className="bg-blue-600 text-white font-semibold text-lg p-2 rounded-lg"
                    onClick={() => handleEditClick(product)}
                  >
                    Update Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <div className="flex flex-col gap-3">
              <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} placeholder="Product Name" className="border p-2 rounded" />
              <input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })} placeholder="Price" className="border p-2 rounded" />
              <input type="text" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} placeholder="Category" className="border p-2 rounded" />
              <input type="text" value={editData.subCategory} onChange={(e) => setEditData({ ...editData, subCategory: e.target.value })} placeholder="Sub Category" className="border p-2 rounded" />
              <input type="text" value={editData.sizes} onChange={(e) => setEditData({ ...editData, sizes: e.target.value })} placeholder="Sizes (comma separated)" className="border p-2 rounded" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editData.bestseller} onChange={(e) => setEditData({ ...editData, bestseller: e.target.checked })} />
                Bestseller
              </label>
              <textarea value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description" className="border p-2 rounded" />

              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => { setEditData(null); setCurrent(""); }}>
                  Cancel
                </button>
                <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdate}>
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
