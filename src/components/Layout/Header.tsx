
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Store, MessageCircle, Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              J
            </div>
            <span className="text-xl font-bold text-green-600">Jikagri</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-sm font-medium hover:text-green-600 transition-colors">
            Products
          </Link>
          <Link to="/stores" className="text-sm font-medium hover:text-green-600 transition-colors">
            Stores
          </Link>
          {user && (
            <>
              <Link to="/chat" className="text-sm font-medium hover:text-green-600 transition-colors flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>Chat</span>
              </Link>
              <Link to="/notifications" className="text-sm font-medium hover:text-green-600 transition-colors flex items-center space-x-1">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link to="/my-store">
                <Button variant="ghost" size="sm">
                  <Store className="h-4 w-4 mr-2" />
                  My Store
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link 
                to="/products" 
                className="text-lg font-medium hover:text-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/stores" 
                className="text-lg font-medium hover:text-green-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Stores
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/my-store" 
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    My Store
                  </Link>
                  <Link 
                    to="/chat" 
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Chat
                  </Link>
                  <Link 
                    to="/notifications" 
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Notifications
                  </Link>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }} 
                    variant="outline" 
                    className="justify-start"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
