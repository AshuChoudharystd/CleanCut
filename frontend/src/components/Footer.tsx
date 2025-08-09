import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, CreditCard, Shield, Truck } from 'lucide-react';
import { assets } from '../assets/assets';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-black border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Logo and Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img src={assets.logo} alt="" className='w-80 h-20'/>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed max-w-md">
              Your premium destination for fashion and style. Discover the latest trends with unmatched quality and service.
            </p>
            <div className="flex space-x-3">
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 cursor-pointer group">
                <Facebook className="w-4 h-4 text-gray-600 group-hover:text-black" />
              </div>
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 cursor-pointer group">
                <Instagram className="w-4 h-4 text-gray-600 group-hover:text-black" />
              </div>
              <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 cursor-pointer group">
                <Twitter className="w-4 h-4 text-gray-600 group-hover:text-black" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Shop</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">New Arrivals</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">Men's</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">Women's</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">Sale</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">Size Guide</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">Returns</a></li>
              <li><a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">123 Fashion St, Style City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">support@jaatsaab.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 text-xs font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-700 text-xs font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700 text-xs font-medium">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-600 text-xs">
              © {currentYear} JaatSaab. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black transition-colors text-xs">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors text-xs">Terms</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors text-xs">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
