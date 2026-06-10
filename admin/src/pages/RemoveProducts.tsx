import { useContext } from "react";
import { adminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { api } from "../lib/api";

const RemoveProducts = () => {
  const { products, refreshProducts } = useContext(adminContext);

  const removeItem = async (productId: string) => {
    try {
      await api.delete(`/admin/removeProducts/${productId}`);
      toast.success("Product removed successfully");
      await refreshProducts();
    } catch {
      toast.error("Error removing the product");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Remove Products</h1>

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
                    className="bg-red-600 text-white font-semibold text-lg p-2 rounded-lg"
                    onClick={() => removeItem(product._id)}
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RemoveProducts;
