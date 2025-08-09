import { useContext, useState } from 'react';
import { ShoppingCart, User, ChevronDown, Menu, X } from 'lucide-react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const NavBar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink,setActiveLink] = useState('');
  const {getCartCount,toggleLogout,} = useContext(ShopContext);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white fixed w-full top-0 z-50">
      <div className="sm:px-6">
        <div className="flex justify-between items-center h-25">
          {/* Logo */}
          <div className="">
            <a onClick={(()=>{
              navigate('/')
            })}>
              <img src={assets.logo} className='w-70 h-15' />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              onClick={() => {setActiveLink('home');
                navigate('/')}
              }
              className={`text-gray-800 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 rounded-md ${
                activeLink === 'home' ? 'border-b-2 border-black' : ''
              }`}
            >
              Home
            </a>
            <a 
              onClick={() => {setActiveLink('collection')
                navigate('/collection')
              }}
              className={`text-gray-800 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 rounded-md ${
                activeLink === 'collection' ? 'border-b-2 border-black' : ''
              }`}
            >
              Collection
            </a>
            <a 
              onClick={() => {setActiveLink('about');
                navigate('/about'); 
              }}
              className={`text-gray-800 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 rounded-md ${
                activeLink === 'about' ? 'border-b-2 border-black' : ''
              }`}
            >
              About
            </a>
            <a 
              onClick={() => {setActiveLink('contact');
                navigate('/contact');
              }}
              className={`text-gray-800 hover:text-black px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-100 rounded-md ${
                activeLink === 'contact' ? 'border-b-2 border-black' : ''
              }`}
            >
              Contact
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Login Button */}
            {!localStorage.getItem("token")?(
              <button 
                className="hidden md:block px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            ):(
              <div 
                className="hidden md:block px-4 py-2 bg-white text-white font-medium rounded-md"
              >
              </div>
            )}

            {/* Cart Button */}
            <button className="relative p-2 text-gray-600 hover:text-black transition-colors duration-200 hover:bg-gray-100 rounded-md" onClick={()=>navigate('/cart')}>
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()} 
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-1 p-2 text-gray-600 hover:text-black transition-colors duration-200 hover:bg-gray-100 rounded-md"
              >
                <User className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50" onClick={()=>{
                    setIsDropdownOpen(false);
                  }}>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={()=>navigate('/profile')}>
                    Profile
                  </a>
                  <a onClick={()=>{navigate("/orders");
                    setIsDropdownOpen(false);
                  }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Orders
                  </a>
                  <hr className="my-1" />
                  <div onClick={toggleLogout} className="cursor-pointer">
                    <a  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </a>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-black hover:bg-gray-100 rounded-md">
                Collection
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-black hover:bg-gray-100 rounded-md">
                About
              </a>
              <a href="#" className="block px-3 py-2 text-base font-medium text-gray-800 hover:text-black hover:bg-gray-100 rounded-md">
                Contact
              </a>
              <button className="w-full text-left px-3 py-2 text-base font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
              onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;