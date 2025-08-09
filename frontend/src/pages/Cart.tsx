import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartType {
  _id: string;
  size: string;
  quantity: number;
}

const Cart = () => {
  const { products, isLogin, currency, cartItems, getCartCount, removeFromCart } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState<CartType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData: CartType[] = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size: size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  return (
    <div>
      {getCartCount() === 0 ? (
        <div className="mt-30">
          <div className="flex flex-col items-center justify-center min-h-96 p-8 bg-white">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <ShoppingCart
                  className="w-12 h-12 text-gray-400"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">0</span>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-black mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up with amazing products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
                onClick={() => {
                  navigate("/collection");
                }}
              >
                <Plus className="w-4 h-4" />
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t pt-14 mt-25 mb-10">
          <div className="text-3xl mb-5 text-center">
            <Title text1={"YOUR "} text2={"CART"}></Title>
          </div>
          <div>
            {cartData.map((data, index) => {
              const productData = products.find(
                (product) => product._id === data._id
              );
              if (!productData) return null; // Handle case where product might not be loaded yet

              return (
                <div
                  key={index}
                  className="ml-20 mr-20 py-4 border-t border-b text-gray-700 grid grid-cols-[1fr_auto_auto_auto] items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={productData.image[0]}
                      alt={productData.name}
                      className="w-16 sm:w-20"
                    />
                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-5 mt-2 font-medium">
                        <p>
                          {currency}
                          {productData.price}
                        </p>
                        <p className="p-2 bg-gray-100">{data.size}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center">Qty: {data.quantity}</p>
                  <p className="font-medium text-center">
                    {currency}
                    {productData.price * data.quantity}
                  </p>
                  <img
                    src={assets.bin_icon}
                    alt="Remove item"
                    className="w-4 mr-4 sm:w-5 cursor-pointer justify-self-end"
                    onClick={() => {
                      removeFromCart({ _id: data._id, size: data.size });
                    }}
                  />
                </div>
              );
            })}
          </div>
          <CartTotal />
        </div>
      )}
    </div>
  );
};

export default Cart;