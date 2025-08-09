import { createContext, type ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  removeFromCart: ({ _id, size }: AddCart) => void;
  getCartCount: () => number;
  totalCost: number;
  addToOrder: ({ payment, tCost }: { payment: string; tCost: number }) => void;
  ordered: Order[];
  isLogin: boolean;
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
  addToOrder: () => {},
  ordered: [],
  isLogin: false,
  toggleLogout: () => {},
  getCartItems: async () => {},
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
  const [isLogin, setIsLogin] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const res = await axios.get(`${backendURL}/`);
      if (res.data.products) {
        setProducts(res.data.products);
        toast.success("Products loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products.");
    }
  };

  // --- Login and Auth Logic ---
  useEffect(() => {
    // This effect runs only once on initial load to check for an existing token
    if (localStorage.getItem("token")) {
      setIsLogin(true);
    }
  }, []);

  const toggleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    setCartItems({}); // Clear cart on logout
    navigate("/");
    toast.success("Logged out successfully!");
  };

  // --- Cart Logic ---
  const getCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return; // Don't try to fetch if there's no token
    }

    try {
      const response = await axios.get(`${backendURL}/user/get-cart`, {
        headers: { Authorization: token },
      });
      if (response.data.cartData) {
        console.log("Cart items fetched:", response.data.cartData);
        setCartItems(response.data.cartData);
        toast.success("Cart items loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load cart items.");
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        toast.error("Failed to load cart items");
      }
    }
  };

  // This effect syncs the cart whenever the login status changes.
  useEffect(() => {
    if (isLogin) {
      getCartItems();
    }
  }, [isLogin]);

  const addToCart = async ({ _id, size }: AddCart) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    try {
      await axios.post(
        `${backendURL}/user/add-to-cart`,
        { productId: _id, size: size }, // Data payload
        { headers: { Authorization: localStorage.getItem("token") } } // Config
      );
      toast.success("Product added to cart");
      await getCartItems(); // Re-fetch the cart to get the latest state
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  const removeFromCart = async ({ _id, size }: AddCart) => {
    try {
      await axios.delete(`${backendURL}/user/remove-from-cart`, {
        headers: { Authorization: localStorage.getItem("token") },
        data: { productId: _id, size: size },
      });
      toast.success("Product removed from cart");
      await getCartItems(); // Re-fetch the cart to get the latest state
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove product from cart.");
    }
  };

  // This effect for calculating total cost will now work correctly.
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

    axios.post(`${backendURL}/orders/`, newOrder, {
      headers: { Authorization: localStorage.getItem("token") },
    });

    setCartItems({});
    toast.success("Order placed!");
  };

  const getOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return; // Don't try to fetch if there's no token
    }
    try {
      const response = await axios.get(`${backendURL}/orders/all`, {
        headers: { Authorization: token },
      });
      if (response.data.orders) {
        setOrdered(response.data.orders);
        console.log("Orders fetched:", response.data.orders);
        toast.success("Orders loaded successfully!");
      }
      console.log("Order placed:", ordered);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.");
    }
  };

  // Fetch products on initial load
  useEffect(() => {
    getProducts();
  },[]);

  useEffect(() => {
      getOrder();
  },[]);

  useEffect(() => {
    console.log("Ordered items updated:", ordered);
  }, [ordered]);

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
    toggleLogout,
    getCartItems,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
