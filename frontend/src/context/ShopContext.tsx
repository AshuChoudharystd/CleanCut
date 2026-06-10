import { createContext, type ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

interface Order {
  items: CartStructure;
  _id: string;
  date: Date;
  address: string;
  payment_mode: string;
  amount: number;
  status: string;
}

interface AddCart {
  _id: string;
  size: string;
}

interface CartStructure {
  [key: string]: { [key2: string]: number };
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
  description: string;
  date?: string | Date;
}

interface ShopContextType {
  products: Product[];
  currency: string;
  deliveryFee: number;
  cartItems: CartStructure;
  addToCart: ({ _id, size }: AddCart) => void;
  removeFromCart: ({ _id, size }: AddCart) => void;
  getCartCount: () => number;
  totalCost: number;
  addToOrder: ({ payment, address }: { payment: string; address: string }) => Promise<void>;
  ordered: Order[];
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  toggleLogout: () => void;
  getCartItems: () => Promise<void>;
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
  addToOrder: async () => {},
  ordered: [],
  isLogin: false,
  setIsLogin: () => {},
  toggleLogout: () => {},
  getCartItems: async () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
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
  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  const getProducts = useCallback(async () => {
    try {
      const res = await api.get("/");
      if (res.data.products) {
        setProducts(res.data.products);
      }
    } catch {
      toast.error("Failed to load products.");
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      await api.get("/user/me");
      setIsLogin(true);
      return;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          await api.post("/user/refresh");
          await api.get("/user/me");
          setIsLogin(true);
          return;
        } catch {
          // refresh failed — fall through to logged out
        }
      }
      setIsLogin(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const toggleLogout = async () => {
    try {
      await api.post("/user/logout");
    } catch {
      // still clear local session state
    }
    setIsLogin(false);
    setCartItems({});
    navigate("/");
    toast.success("Logged out successfully!");
  };

  const getCartItems = useCallback(async () => {
    if (!isLogin) return;

    try {
      const response = await api.get("/user/get-cart");
      if (response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setIsLogin(false);
      } else {
        toast.error("Failed to load cart items");
      }
    }
  }, [isLogin]);

  useEffect(() => {
    if (isLogin) {
      getCartItems();
    }
  }, [isLogin, getCartItems]);

  const addToCart = async ({ _id, size }: AddCart) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    try {
      await api.post("/user/add-to-cart", { productId: _id, size });
      toast.success("Product added to cart");
      await getCartItems();
    } catch {
      toast.error("Failed to add product to cart.");
    }
  };

  const removeFromCart = async ({ _id, size }: AddCart) => {
    try {
      await api.delete("/user/remove-from-cart", {
        data: { productId: _id, size },
      });
      toast.success("Product removed from cart");
      await getCartItems();
    } catch {
      toast.error("Failed to remove product from cart.");
    }
  };

  useEffect(() => {
    let total = 0;
    if (products.length > 0) {
      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          const product = products.find((p) => p._id === itemId);
          if (product) {
            total += product.price * cartItems[itemId][size];
          }
        }
      }
    }
    setTotalCost(total);
  }, [cartItems, products]);

  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }
    return totalCount;
  };

  const addToOrder = async ({ payment, address }: { payment: string; address: string }) => {
    try {
      await api.post("/orders/", { address, payment_mode: payment });
      setCartItems({});
      await getOrder();
      toast.success("Order placed!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to place order.");
      }
    }
  };

  const getOrder = useCallback(async () => {
    if (!isLogin) return;
    try {
      const response = await api.get("/orders/all");
      if (response.data.orders) {
        setOrdered(response.data.orders);
      }
    } catch {
      toast.error("Failed to load orders.");
    }
  }, [isLogin]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (isLogin) {
      getOrder();
    }
  }, [isLogin, getOrder]);

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
    setIsLogin,
    toggleLogout,
    getCartItems,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
