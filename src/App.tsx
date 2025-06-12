
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';

// Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import StoresPage from './pages/StoresPage';
import StoreDetailPage from './pages/StoreDetailPage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import MyStorePage from './pages/MyStorePage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import CreateStorePage from './pages/CreateStorePage';
import CreateProductPage from './pages/CreateProductPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/stores/:id" element={<StoreDetailPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/my-store" element={<MyStorePage />} />
              <Route path="/create-store" element={<CreateStorePage />} />
              <Route path="/create-product" element={<CreateProductPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
