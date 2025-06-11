
import { Hero } from '@/components/Home/Hero';
import { FeaturedProducts } from '@/components/Home/FeaturedProducts';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
