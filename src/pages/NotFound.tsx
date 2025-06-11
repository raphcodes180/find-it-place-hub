
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-green-600">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 text-lg mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            
            <Link to="/" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
