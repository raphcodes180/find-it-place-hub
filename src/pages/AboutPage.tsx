
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Users, Target, Award, Leaf, MapPin, Phone, Mail } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                About <span className="text-green-600">Jikagri</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Connecting farmers and buyers across Kenya through a modern, efficient digital marketplace 
                that promotes sustainable agriculture and fair trade practices.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="text-center lg:text-left">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Target className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To revolutionize agriculture in Kenya by providing farmers with direct access to markets, 
                  eliminating middlemen, and ensuring fair prices for both producers and consumers. We aim 
                  to strengthen food security and promote sustainable farming practices across the nation.
                </p>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To become the leading agricultural marketplace in East Africa, empowering millions of 
                  farmers with technology, knowledge, and market access. We envision a future where every 
                  farmer can thrive and contribute to sustainable food systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Jikagri provides a comprehensive platform that connects agricultural stakeholders 
                and facilitates transparent, efficient trade relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Leaf className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Direct Market Access</h3>
                <p className="text-gray-600">
                  Connect farmers directly with buyers, retailers, and consumers across Kenya
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Building</h3>
                <p className="text-gray-600">
                  Foster relationships between agricultural communities and urban markets
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <MapPin className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Nationwide Coverage</h3>
                <p className="text-gray-600">
                  Serving all 47 counties in Kenya with local language support
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
                <p className="text-gray-600">
                  Verified sellers and quality products with transparent pricing
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Building a stronger agricultural economy for Kenya, one connection at a time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">47</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">Counties Served</div>
                <p className="text-gray-600">Nationwide coverage across all Kenyan counties</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">Registered Farmers</div>
                <p className="text-gray-600">Active farmers selling their produce</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">15+</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">Product Categories</div>
                <p className="text-gray-600">From crops to livestock and farm equipment</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-gray-600 text-lg">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">+254 700 123 456</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-600">hello@jikagri.co.ke</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-gray-600">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
