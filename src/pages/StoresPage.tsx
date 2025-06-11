
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { StoreList } from '@/components/Store/StoreList';

const StoresPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agricultural Stores</h1>
          <p className="text-gray-600">
            Discover trusted agricultural stores and suppliers across Kenya
          </p>
        </div>
        <StoreList />
      </main>
      <Footer />
    </div>
  );
};

export default StoresPage;
