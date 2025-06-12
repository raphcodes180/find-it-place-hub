import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient } from '@tanstack/react-query';

import StoreDetailPage from '@/pages/StoreDetailPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClient>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/stores/:id" element={<StoreDetailPage />} />
            </Routes>
          </div>
          <Toaster />
        </QueryClient>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
