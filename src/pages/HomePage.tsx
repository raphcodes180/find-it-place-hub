
import { Hero } from '@/components/Home/Hero';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {/* Featured Products and Stores can be added here later */}
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
