
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ProductList } from '@/components/Products/ProductList';

const ProductsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agricultural Products</h1>
          <p className="text-gray-600">
            Discover fresh produce, livestock, and farm equipment from verified sellers across Kenya
          </p>
        </div>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
