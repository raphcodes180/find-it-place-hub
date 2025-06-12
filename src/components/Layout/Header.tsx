
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Bell, 
  MessageCircle, 
  Store, 
  Menu, 
  X, 
  Plus,
  Home,
  ShoppingBag
} from 'lucide-react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AM</span>
            </div>
            <span className="font-bold text-xl text-gray-900">AgriMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/stores" className="flex items-center space-x-1 text-gray-700 hover:text-green-600">
              <Store className="h-4 w-4" />
              <span>Stores</span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/notifications')}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                </Button>

                {/* Messages */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/chat')}
                  className="relative"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span className="hidden md:block">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-store')}>
                      <Store className="h-4 w-4 mr-2" />
                      My Store
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/create-store')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Store
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/create-product')}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add Product
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link 
                to="/stores" 
                className="flex items-center space-x-2 px-2 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Store className="h-4 w-4" />
                <span>Stores</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
