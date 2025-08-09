import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState<typeof products>([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>{
            return item.bestseller;
        });
        setBestSeller(bestProduct.slice(0,5));
    },[products]);

  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'} text2={"SELLERS"}></Title>
            <p className='w-3/4 m-auto text-xs sm:text:sm md:text-base text-gray-600'>
            Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
            </p>
        </div>
       <div className="mr-10 ml-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((product:any,index) => (
          <ProductItem
            key={index}
            id={product._id}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        ))}
      </div>
    </div>
  )
}

export default BestSeller
