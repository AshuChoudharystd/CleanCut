import { useContext } from "react";
import { adminContext } from "../context/AdminContext";

const formatDate = (createdAt?: string, date?: string) => {
  const value = createdAt ?? date;
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ListProducts = () => {
  const { products } = useContext(adminContext);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row overflow-hidden"
            >
              <div className="relative md:w-1/3 w-full h-90 bg-gray-100">
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className="w-full h-full object-fill"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">{product.name}</h3>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                    {product.subCategory}
                  </span>
                </div>

                <div className="text-2xl font-bold text-gray-900 mb-4">
                  ₹{product.price.toLocaleString()}
                </div>

                {product.sizes?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-1">Sizes:</div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <span
                          key={index}
                          className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-md"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-gray-600">{product.description}</div>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-gray-100 text-sm text-gray-500">
                  Added {formatDate(product.createdAt, product.date)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListProducts;
