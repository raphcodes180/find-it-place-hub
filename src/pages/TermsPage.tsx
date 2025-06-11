
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-600">
          <p>
            Welcome to Jikagri. By using our platform, you agree to these terms and conditions.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">1. Platform Usage</h3>
          <p>
            Jikagri is a marketplace connecting agricultural buyers and sellers in Kenya. Users must provide accurate information and use the platform responsibly.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">2. Account Responsibility</h3>
          <p>
            Users are responsible for maintaining the security of their accounts and all activities that occur under their account.
          </p>
          <h3 className="text-lg font-semibold text-gray-900">3. Product Listings</h3>
          <p>
            Sellers are responsible for the accuracy of their product listings and fulfillment of orders.
          </p>
          <p className="text-sm text-gray-500 mt-8">
            Last updated: December 2024
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
