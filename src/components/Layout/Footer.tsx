
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <span className="font-bold text-xl">AgriMarket</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting farmers and buyers across Kenya. Fresh produce, fair prices, direct from farm to table.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white text-sm">
                Home
              </Link>
              <Link to="/stores" className="block text-gray-400 hover:text-white text-sm">
                Browse Stores
              </Link>
              <Link to="/auth" className="block text-gray-400 hover:text-white text-sm">
                Sign Up
              </Link>
            </div>
          </div>

          {/* For Sellers */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">For Sellers</h3>
            <div className="space-y-2">
              <Link to="/create-store" className="block text-gray-400 hover:text-white text-sm">
                Create Store
              </Link>
              <Link to="/my-store" className="block text-gray-400 hover:text-white text-sm">
                Manage Store
              </Link>
              <Link to="/create-product" className="block text-gray-400 hover:text-white text-sm">
                Add Products
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="space-y-2">
              <Link to="/faq" className="block text-gray-400 hover:text-white text-sm">
                FAQ
              </Link>
              <Link to="/terms" className="block text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <a href="mailto:support@agrimarket.co.ke" className="block text-gray-400 hover:text-white text-sm">
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AgriMarket Kenya. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
