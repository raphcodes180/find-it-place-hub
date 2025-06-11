
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ProductDetail } from '@/components/Products/ProductDetail';

const ProductDetailPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductDetail />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
