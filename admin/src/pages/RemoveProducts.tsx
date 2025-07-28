import { Package } from "lucide-react";
import { useContext, useState } from "react";
import { adminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL

const RemoveProducts = () => {
  const { products } = useContext(adminContext);

  const [current,setCurrent] = useState("");

  const getStatusColor = (status: string, stock: number) => {
    if (stock === 0 || status === "Out of Stock")
      return "bg-red-100 text-red-700 border border-red-200";
    if (stock < 15)
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    return "bg-green-100 text-green-800 border border-green-200";
  };

  const removeItem = async()=>{
    try{
        if(!localStorage.getItem("token")){
            toast.error("No token available!!")
        }
        await axios.delete(`${backendUrl}/admin/removeProducts/${current}`,{
        headers:{
            Authorization:localStorage.getItem("token")
        }
    }).then(()=>{
        toast.success("Product Removed Successfully")
    })
    }catch(error){
        toast.error("error removing the product")
        console.error(error);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Remove Products</h1>

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

                {product.sizes?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      Sizes:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size: string, index: number) => (
                        <span
                          key={index}
                          className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-md hover:bg-gray-50"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                    <div>{product.description}</div>
                  </div>
                )}
                <div className="mr-10 mt-5">
                  <div className="flex justify-end">
                    <button className="border-0 bg-blue-600 text-white font-semibold text-2xl p-2 rounded-lg hover:ease-in hover:scale-110"
                    onClick={()=>{
                        setCurrent(product._id)
                        removeItem()
                    }}>
                      Remove Item
                    </button>
                  </div>
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
