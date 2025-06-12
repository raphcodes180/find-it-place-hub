
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Store, Package, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { ProductCard } from '@/components/Products/ProductCard';

const StoreDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: store, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      if (!id) throw new Error('Store ID is required');
      
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          counties(name),
          sub_counties(name),
          wards(name)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;

      // Fetch profile separately if we have an owner_id
      if (data?.owner_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone_number, email')
          .eq('id', data.owner_id)
          .single();

        return {
          ...data,
          profiles: profileData
        };
      }

      return data;
    },
    enabled: !!id
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['store-products', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, is_primary),
          counties(name),
          sub_counties(name),
          wards(name)
        `)
        .eq('store_id', id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (!id) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Invalid store ID.</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  if (storeError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load store details. Store may not exist or is inactive.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  if (storeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Store Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {store?.store_image_url ? (
                    <img
                      src={store.store_image_url}
                      alt={store.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-2xl">{store?.name}</CardTitle>
                    <p className="text-gray-600 mt-1">
                      by {store?.profiles?.full_name || 'Unknown Owner'}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {store?.wards?.name}, {store?.sub_counties?.name}, {store?.counties?.name}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Active Store
                </Badge>
              </div>
            </CardHeader>
            
            {store?.description && (
              <CardContent>
                <p className="text-gray-700">{store.description}</p>
              </CardContent>
            )}
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(store?.phone_number || store?.profiles?.phone_number) && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{store?.phone_number || store?.profiles?.phone_number}</span>
                  </div>
                )}
                {(store?.email || store?.profiles?.email) && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{store?.email || store?.profiles?.email}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Package className="h-6 w-6 mr-2" />
                Products ({products.length})
              </h2>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500">
                    This store hasn't listed any products yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
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
                      name: store?.name || '',
                      county: store?.counties?.name || ''
                    }}
                    location={{
                      county: product.counties?.name || '',
                      sub_county: product.sub_counties?.name
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StoreDetailPage;
