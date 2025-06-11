
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ProductList } from '@/components/Products/ProductList';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Jikagri</h1>
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

export default HomePage;
