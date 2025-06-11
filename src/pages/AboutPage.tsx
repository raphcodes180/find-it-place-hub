
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Heart, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                About <span className="text-green-600">Jikagri</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Empowering Kenya's agricultural sector by connecting farmers, suppliers, and buyers 
                through innovative digital solutions that promote food security and economic growth.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To revolutionize Kenya's agricultural marketplace by providing a digital platform 
                  that connects farmers directly with buyers, eliminates middlemen, ensures fair prices, 
                  and promotes sustainable agricultural practices across all 47 counties.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Heart className="h-8 w-8 text-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become East Africa's leading agricultural marketplace, fostering food security, 
                  economic empowerment for farmers, and sustainable agricultural development while 
                  leveraging technology to transform rural livelihoods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                The principles that guide our mission to transform agriculture in Kenya
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-gray-600">
                    Building strong relationships between farmers, suppliers, and buyers across Kenya
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Quality</h3>
                  <p className="text-gray-600">
                    Ensuring only the finest agricultural products reach our marketplace
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                  <p className="text-gray-600">
                    Fair pricing and honest communication throughout all transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                  <p className="text-gray-600">
                    Promoting environmentally responsible farming and business practices
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Making a difference in Kenya's agricultural sector
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">47</div>
                <div className="text-gray-600">Counties Served</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-600">Farmers Connected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Product Categories</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 bg-green-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Our Community?</h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a farmer looking to sell your produce or a buyer seeking quality agricultural products, 
              Jikagri is here to connect you with the right people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth" 
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Today
              </a>
              <a 
                href="mailto:support@jikagri.co.ke" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
