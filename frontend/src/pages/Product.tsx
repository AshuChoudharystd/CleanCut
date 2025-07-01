import React, { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";
import RelatedProduct from "../components/RelatedProduct";
import Title from "../components/Title";

export interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: Array<string>;
  category: string;
  subCategory: string;
  sizes: Array<string>;
  date: number;
  bestseller: boolean;
}

const Product = () => {
  const { productId } = useParams();

  console.log(productId);
  const { products, currency,addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState<ProductType>();
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = () => {
    products.map((item: any) => {
      if (productId === item._id) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 mt-30">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="ml-7 mr-3 flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal ">
            {productData.image.map((item: string, index: number) => (
              <img
                src={item}
                key={index}
                className="sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer w-23 h-30"
                onClick={() => {
                  setImage(item);
                }}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] ">
            <img src={image} alt="" className="w-130 h-150" />
          </div>
        </div>
        {/* Product info  */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2 ">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p className="text-xl font-medium">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSize(item);
                    console.log(size);
                  }}
                  className={`py-2 px-4 bg-gray-100 ${
                    item === size ? "border-2 border-gray-700" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button className="pt-2 pb-2 pr-3 pl-3 bg-black text-white active:bg-gray-500"
          onClick={()=>addToCart({_id:productData._id,size})}>
            Add To Cart
          </button>
          <hr className="mt-8 sm:w-4/5 border-gray-300" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1 ">
            <p>100% Original Product</p>
            <p>Cash On Delivery is available on this product.</p>
            <p>Easy Return and Exchange policy within 7days.</p>
          </div>
        </div>
      </div>
      {/* Description and Review Section */}
      <div className="mt-20 ml-37 mr-20">
        <div className="flex">
          <b className="border-2 px-5 py-3 text-sm">Description</b>
          <p className="border-2 px-5 py-3 text-sm"> Reviews(122)</p>
        </div>
        <div className="flex flex-col border gap-4 px-6 py-6 text-sm text-gray-500">
          <p>
            Welcome to Stylish Threads – your one-stop online store for the
            latest trends in fashion! Whether you're looking for casual wear,
            formal outfits, or seasonal essentials, we bring you a handpicked
            collection of high-quality clothing for men, women, and kids – all
            from the comfort of your home.
          </p>
          <p>
            ✅ Trendy & Timeless Styles From everyday basics to standout pieces,
            our catalog offers something for every taste and occasion.
          </p>

          <p>
            ✅ Affordable Fashion Enjoy stylish clothing at prices that won’t
            break the bank. We believe looking good shouldn’t cost a fortune.
          </p>

          <p>
            ✅ Easy Shopping Experience. With smooth navigation, secure
            checkout, and fast delivery, shopping with us is quick, easy, and
            safe.
          </p>
          <p>
            ✅ Size-Inclusive Options. We embrace all body types, offering sizes
            and fits to make everyone feel confident and comfortable.
          </p>

          <p>
            ✅ New Arrivals Weekly. Stay ahead of fashion with fresh arrivals
            and exclusive drops every week!
          </p>
        </div>
      </div>
      {/* Display relatd Products */}
      <div className="mt-20 mb-20">
        <div className="text-center py-8 text-3xl">
          <Title text1="LATEST " text2="COLLECTIONS" />
        </div>
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
          _id={productData._id}
        ></RelatedProduct>
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
