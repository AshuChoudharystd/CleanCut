import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from "./components/ScrollToTop";
import { AnimatePresence } from "framer-motion";
import Signup from "./pages/Signup";
import Profile from "./components/Profile";

export default function App(){
  return (
    <div className="">
      <ToastContainer></ToastContainer>
      <ScrollToTop />
      <NavBar></NavBar>
      <AnimatePresence mode='wait'>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path="/collection" element={<Collection/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/contact" element={<Contact/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/product/:productId" element={<Product/>}></Route>
        <Route path="/place-order" element={<PlaceOrder/>}></Route>
        <Route path="/orders" element={<Orders/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
      </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  )
}