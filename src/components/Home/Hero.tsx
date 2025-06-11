
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Store, Users, MessageCircle } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-green-50 to-green-100 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Kenya's Premier <span className="text-green-600">Agricultural</span> Marketplace
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect directly with farmers and agricultural suppliers across Kenya. 
            Fresh produce, quality livestock, and farm equipment at competitive prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Store className="mr-2 h-5 w-5" />
                Start Selling
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Network</h3>
              <p className="text-gray-600">Connect with verified farmers and buyers across all 47 counties in Kenya</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600">Chat directly with sellers, negotiate prices, and arrange delivery</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Store className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Store Setup</h3>
              <p className="text-gray-600">Create your agricultural store in minutes and start reaching customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
