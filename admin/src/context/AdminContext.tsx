import axios from "axios";
import {createContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AdminContextType {
  products: any[];
}

const defaultValues: AdminContextType = {
  products: [],
};

export const adminContext = createContext<AdminContextType>(defaultValues);

const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<any[]>([]);

  const getProducts = async () => {
    try {
      await axios
        .get(`${backendUrl}/admin/getProducts`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setProducts(res.data.products);
        });
        toast.success("Resources loaded successfully!")
    } catch (error) {
      toast.error("Failed to load resources!")
      console.error(error);
    }
  };

  useEffect(()=>{
    getProducts();
  },[]);



  const value: AdminContextType = {
    products,
  };

  return (
    <adminContext.Provider value={value}>
      {children}
    </adminContext.Provider>
  );
};

export default AdminProvider;
