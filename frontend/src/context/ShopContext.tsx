import { createContext, type ReactNode, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

interface Order {
  cartData: CartStructure;
  item_id: string;
  date: Date;
  address: string;
  payment_mode: string;
  totalCost: number;
  status: string;
}

interface AddCart {
  _id: string;
  size: string;
}

interface CartStructure {
  [key: string]: { [key2: string]: number };
}

interface ShopContextType {
  products: typeof products;
  currency: string;
  deliveryFee: number;
  cartItems: CartStructure;
  addToCart: ({ _id, size }: AddCart) => void;
  getCartCount: () => number;
  updateQuantity: ({ _id, size }: AddCart, quantity: number) => void;
  totalCost: number;
  addToOrder: ({ payment, tCost }: { payment: string; tCost: number }) => void;
  ordered: Order[];
  isLogin?: boolean;
  toggleLogin?: () => void;
}

const defaultContext: ShopContextType = {
  products,
  currency: "₹",
  deliveryFee: 100,
  cartItems: {},
  addToCart: () => {},
  getCartCount: () => 0,
  updateQuantity: () => {},
  totalCost: 0,
  addToOrder: () => {},
  ordered: [],
  isLogin: false,
  toggleLogin: () => {},
};

export const ShopContext = createContext<ShopContextType>(defaultContext);

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContextProvider = ({ children }: ShopContextProviderProps) => {
  const currency = "₹";
  const deliveryFee = 100;
  const [cartItems, setCartItems] = useState<CartStructure>({});
  const [totalCost, setTotalCost] = useState(0);
  const [ordered, setOrdered] = useState<Order[]>([]);
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  useEffect(() => {
    console.log("Login status changed:", isLogin);
  }, [isLogin]);

  const addToCart = ({ _id, size }: AddCart) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (!updatedCart[_id]) {
        updatedCart[_id] = {};
      }
      updatedCart[_id][size] = (updatedCart[_id][size] || 0) + 1;
      return updatedCart;
    });
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        try {
          totalCount += cartItems[itemId][size];
        } catch {
          toast.error("Failed to load the cart data!");
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = ({ _id, size }: AddCart, quantity: number) => {
    const cartData = structuredClone(cartItems);
    if (cartData[_id]) {
      cartData[_id][size] = quantity;
    }
    setCartItems(cartData);
  };

  const calculateTotalCost = () => {
    let total = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const product = products.find((p) => p._id === itemId);
        if (product) {
          total += product.price * cartItems[itemId][size];
        }
      }
    }
    setTotalCost(total);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [cartItems]);

  const addToOrder = ({ payment, tCost }: { payment: string; tCost: number }) => {
    const newOrder: Order = {
      cartData: cartItems,
      item_id: `order_${Date.now()}`,
      date: new Date(),
      address: "Meerut, Uttar Pradesh, 250001",
      payment_mode: payment,
      totalCost: tCost,
      status: "processing",
    };

    setOrdered((prev) => [...prev, newOrder]);
    setCartItems({});
    toast.success("Order placed!");
    console.log("Order placed:", ordered);
  };

  const value: ShopContextType = {
    products,
    currency,
    deliveryFee,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    totalCost,
    addToOrder,
    ordered,
    isLogin,
    toggleLogin
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;