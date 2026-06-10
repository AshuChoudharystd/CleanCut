import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { api } from "../lib/api";

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  bestseller: boolean;
  status?: string;
  createdAt?: string;
  date?: string;
}

interface AdminContextType {
  products: Product[];
  refreshProducts: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultValues: AdminContextType = {
  products: [],
  refreshProducts: async () => {},
  isAuthenticated: false,
  checkAuth: async () => {},
  logout: async () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const adminContext = createContext<AdminContextType>(defaultValues);

export default function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      await api.get("/admin/me");
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get("/admin/getProducts");
      setProducts(res.data.products);
    } catch {
      toast.error("Failed to load products!");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshProducts();
    }
  }, [isAuthenticated, refreshProducts]);

  const logout = async () => {
    try {
      await api.post("/admin/logout");
    } catch {
      // still clear local session
    }
    setIsAuthenticated(false);
    setProducts([]);
  };

  const value: AdminContextType = { products, refreshProducts, isAuthenticated, checkAuth, logout };

  return (
    <adminContext.Provider value={value}>
      {children}
    </adminContext.Provider>
  );
}
