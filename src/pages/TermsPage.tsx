
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Jikagri, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily use Jikagri for personal, commercial purposes related to agricultural trade. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose other than legitimate agricultural trade</li>
                <li>attempt to decompile or reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                You are responsible for safeguarding the password and for maintaining the security of your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Product Listings</h2>
              <p className="text-gray-600 mb-4">
                Sellers are responsible for the accuracy of their product listings, including descriptions, prices, and availability. 
                Jikagri does not guarantee the quality, safety, or legality of products listed on the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Transactions</h2>
              <p className="text-gray-600 mb-4">
                All transactions are conducted directly between buyers and sellers. Jikagri facilitates communication but is not 
                party to any agreements, contracts, or transactions between users. Payment arrangements are the sole responsibility 
                of the transacting parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h2>
              <p className="text-gray-600 mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>For any unlawful purpose or to solicit others to perform or participate in unlawful acts</li>
                <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, 
                this Company excludes all representations, warranties, conditions and terms related to our website and the use of this website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitations</h2>
              <p className="text-gray-600 mb-4">
                In no event shall Jikagri or its suppliers be liable for any damages (including, without limitation, damages for 
                loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials 
                on Jikagri's website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                Your privacy is important to us. We collect and use your information in accordance with our Privacy Policy, 
                which forms part of these Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms of service at any time. Changes will be effective immediately upon posting. 
                Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  Email: support@jikagri.co.ke<br />
                  Address: Nairobi, Kenya
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
