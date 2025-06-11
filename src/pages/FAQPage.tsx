
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">How do I create a store?</h3>
            <p className="text-gray-600">Once you sign up and verify your account, you can create a store by going to your profile and selecting "Become a Seller".</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">How do I contact sellers?</h3>
            <p className="text-gray-600">You can chat directly with sellers through our messaging system once you're logged in.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Is Jikagri available nationwide?</h3>
            <p className="text-gray-600">Yes, Jikagri operates across all 47 counties in Kenya.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
