
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ProductCard } from '@/components/Products/ProductCard';
import { ProductFilters } from '@/components/Products/ProductFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

type ProductCategory = 'crops' | 'livestock' | 'dairy' | 'poultry' | 'aquaculture' | 'horticulture' | 'cereals' | 'legumes' | 'fruits' | 'vegetables' | 'farm_equipment' | 'seeds' | 'fertilizers' | 'pesticides';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [selectedCounty, setSelectedCounty] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  
  const itemsPerPage = 12;

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', searchTerm, selectedCategory, selectedCounty, currentPage, priceRange],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          stores!inner(name, counties!inner(name)),
          product_images(image_url, is_primary),
          counties(name),
          sub_counties(name)
        `)
        .eq('is_active', true)
        .gte('price', priceRange[0])
        .lte('price', priceRange[1]);

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedCounty) {
        query = query.eq('county_id', selectedCounty);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;

      return { products: data || [], total: count || 0 };
    },
  });

  const totalPages = Math.ceil((productsData?.total || 0) / itemsPerPage);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as ProductCategory | '');
    setCurrentPage(1);
  };

  const handleCountyChange = (county: string) => {
    setSelectedCounty(county ? parseInt(county) : null);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fresh Produce, Direct from Farms
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Connect with local farmers and get the freshest produce at the best prices
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-1/4">
                <ProductFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  selectedCounty={selectedCounty ? selectedCounty.toString() : ''}
                  onCountyChange={handleCountyChange}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                />
              </div>

              {/* Products Grid */}
              <div className="lg:w-3/4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Products ({productsData?.total || 0})
                  </h2>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productsData?.products?.map((product: any) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          title={product.title}
                          description={product.description}
                          price={product.price}
                          unit={product.unit}
                          category={product.category}
                          subcategory={product.subcategory}
                          images={product.product_images || []}
                          store={{
                            name: product.stores?.name || '',
                            county: product.stores?.counties?.name || ''
                          }}
                          location={{
                            county: product.counties?.name || '',
                            sub_county: product.sub_counties?.name
                          }}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 mt-8">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        
                        <div className="flex space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                onClick={() => setCurrentPage(page)}
                                className="w-10"
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>

                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
