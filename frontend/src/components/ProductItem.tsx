import  { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';


interface Card{
    id:string;
    name:string;
    image:string[];
    price:number;
}

const   ProductItem = ({id,name,image,price}:Card) => {

    const {currency} = useContext(ShopContext);

  return (
    <div>
      <Link to={`/product/${id}`} className='text-gray-700 not-last:'>
      <div className='overflow-hidden '>
        <img src={image[0]} alt="" className='hover:scale-110 transition ease-in-out' />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency}{price}</p>
    </Link>
    </div>
  )
}

export default ProductItem
