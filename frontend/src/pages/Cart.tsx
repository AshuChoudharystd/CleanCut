import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import type { ProductType } from "./Product";
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
  const { products,isLogin, currency, cartItems, updateQuantity ,getCartCount} =
    useContext(ShopContext);

  const [cartData, setCartData] = useState<CartType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            quantity: cartItems[items][item],
            _id: items,
            size: item,
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  useEffect(()=>{
    if(!isLogin){
      navigate("/login")
    }
  })

  return (
    <div>
      {getCartCount() === 0 ? (
        <div className="mt-30">
          <div className="flex flex-col items-center justify-center min-h-96 p-8 bg-white">
            <div className="relative mb-8">
              {/* Cart icon with subtle shadow */}
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <ShoppingCart
                  className="w-12 h-12 text-gray-400"
                  strokeWidth={1.5}
                />
              </div>

              {/* Empty indicator */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">0</span>
              </div>
            </div>

            {/* Main message */}
            <h2 className="text-2xl font-semibold text-black mb-3">
              Your cart is empty
            </h2>

            <p className="text-gray-600 text-center mb-8 max-w-md leading-relaxed">
              Looks like you haven't added any items to your cart yet. Start
              shopping to fill it up with amazing products.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2" onClick={()=>{navigate("/collection")}}>
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

              return (
                <div
                  key={index}
                  className="ml-20 mr-20 py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex justify-items-center">
                    <div className="flex items-start">
                      <img
                        src={productData?.image[0]}
                        className="w-16 sm:w-20 ml-7 mr-5"
                      />
                      <div>
                        <p className="text-xs sm:text-lg font-medium">
                          {productData?.name}
                        </p>
                        <div className="flex items-center gap-5 mt-2 font-medium">
                          <p>
                            {currency}
                            {productData?.price}
                          </p>
                          <p className="p-2 bg-gray-100">{data.size}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <input
                      type="number"
                      className="border-1 p-2 w-20 border-gray-100"
                      min={1}
                      defaultValue={data.quantity}
                      onChange={(e) => {
                        e.preventDefault();
                        updateQuantity(
                          { _id: data._id, size: data.size },
                          Number(e.target.value)
                        );
                      }}
                    />
                  </div>
                  <img
                    src={assets.bin_icon}
                    className="w-4 mr-4 sm:w-5 cursor-pointer"
                    onClick={() => {
                      updateQuantity({ _id: data._id, size: data.size }, 0);
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
