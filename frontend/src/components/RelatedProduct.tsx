import { useContext, useEffect, useState } from 'react'
import ProductItem from './ProductItem';
import { ShopContext, type Product as ProductType } from '../context/ShopContext';

interface RelatedProductProps {
  category: string;
  subCategory: string;
  _id:string;
}

const RelatedProduct = ({ category, subCategory,_id }: RelatedProductProps) => {

    const {products} = useContext(ShopContext);

    const [related,setRelated] = useState<ProductType[]>([]);

    useEffect(()=>{
        if(products.length>0){
            const related_list = products.filter(
                (item) =>
                  (item.category === category || item.subCategory === subCategory) && item._id !== _id
              );
              setRelated(related_list.slice(0,5));
        }
    },[products, _id, category, subCategory]);

  return (
    <div>
      <div className="mr-10 ml-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {related.map((product, index) => (
              <ProductItem
                key={product._id || index}
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

export default RelatedProduct
