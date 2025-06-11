
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const ProductsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Agricultural Products</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Product listings coming soon...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
