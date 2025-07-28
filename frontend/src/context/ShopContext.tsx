import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { body, head } from "framer-motion/client";
const backendURL = import.meta.env.VITE_BACKEND_URL;

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
  products: any[];
  currency: string;
  deliveryFee: number;
  cartItems: CartStructure;
  addToCart: ({ _id, size }: AddCart) => void;
  removeFromCart?: ({ _id, size }: AddCart) => void;
  getCartCount: () => number;
  totalCost: number;
  addToOrder: ({ payment, tCost }: { payment: string; tCost: number }) => void;
  ordered: Order[];
  isLogin?: boolean;
  toggleLogin?: () => void;
  toggleLogout?: () => void;
}

const defaultContext: ShopContextType = {
  products: [],
  currency: "₹",
  deliveryFee: 100,
  cartItems: {},
  addToCart: () => {},
  removeFromCart: () => {},
  getCartCount: () => 0,
  totalCost: 0,
  addToOrder: () => {},
  ordered: [],
  isLogin: false,
  toggleLogin: () => {},
  toggleLogout: () => {},
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
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    await axios.get(`${backendURL}`).then((res) => {
      setProducts(res.data.products);
      toast.success("Resource Loaded Successfully!!");
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const toggleLogin = () => {
    console.log("Token",localStorage.getItem("token"));
    if (localStorage.getItem("token")) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  };

  useEffect(() => {
    toggleLogin();
  }, []);

  const toggleLogout =()=>{
    localStorage.removeItem("token");
    setIsLogin(false);
    navigate("/");
    toast.success("Logged out successfully!");
  }

  const addToCart = async ({ _id, size }: AddCart) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // setCartItems((prev) => {
    //   const updatedCart = { ...prev };
    //   if (!updatedCart[_id]) {
    //     updatedCart[_id] = {};
    //   }
    //   updatedCart[_id][size] = (updatedCart[_id][size] || 0) + 1;
    //   return updatedCart;
    // });

    await axios
      .post(`${backendURL}/user/cart/add-to-cart`, {
        header: {
          Authorization: localStorage.getItem("token"),
        },
        body: {
          productId: _id,
          size: size,
        },
      })
      .then(() => {
        toast.success("Product added to cart");
      });
  };

  const removeFromCart = async ({ _id, size }: AddCart) => {
    await axios
      .delete(`${backendURL}/user/cart/remove-from-cart`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: {
          productId: _id,
          size: size,
        },
      })
      .then(() => {
        toast.success("Product removed from cart");
      });
  };

  const getCartItems = async () => {
    console.log("Token Cart:", localStorage.getItem("token"));
    try {
      const response = await axios.get(`${backendURL}/user/cart/get-cart`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      });
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items");
    }
  };

  useEffect(() => {
    getCartItems();
  }, [cartItems]);

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

  const addToOrder = ({
    payment,
    tCost,
  }: {
    payment: string;
    tCost: number;
  }) => {
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
    removeFromCart,
    getCartCount,
    totalCost,
    addToOrder,
    ordered,
    isLogin,
    toggleLogin,
    toggleLogout,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
