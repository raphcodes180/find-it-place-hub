
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <span className="text-xl font-bold text-green-600">Jikagri</span>
            </div>
            <p className="text-gray-600 text-sm">
              Connecting farmers and buyers across Kenya. Quality agricultural products at your fingertips.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-gray-600 hover:text-green-600">Products</Link></li>
              <li><Link to="/stores" className="text-gray-600 hover:text-green-600">Stores</Link></li>
              <li><Link to="/auth" className="text-gray-600 hover:text-green-600">Sign Up</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-gray-600 hover:text-green-600">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-green-600">Terms of Service</Link></li>
              <li><a href="mailto:support@jikagri.co.ke" className="text-gray-600 hover:text-green-600">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
            <p className="text-gray-600 text-sm">
              Nairobi, Kenya<br />
              East Africa
            </p>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Jikagri. All rights reserved. Made with ❤️ in Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
};
