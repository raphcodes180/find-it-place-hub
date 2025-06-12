
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductCard } from '@/components/Products/ProductCard';
import { Store, Package, MapPin, Phone, Mail, AlertCircle, Edit, Plus } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

const MyStorePage = () => {
  const { user, loading: authLoading } = useAuth();

  // Fetch user's store
  const { data: store, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['my-store', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          counties(name),
          sub_counties(name),
          wards(name)
        `)
        .eq('owner_id', user.id)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch store products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['my-store-products', store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url, is_primary),
          counties(name),
          sub_counties(name),
          wards(name)
        `)
        .eq('store_id', store.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!store?.id
  });

  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (storeError || !store) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have a store yet. Create one to start selling your products.
              </AlertDescription>
            </Alert>
            <Link to="/create-store" className="mt-4 inline-block">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Store
              </Button>
            </Link>
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
                  {store.store_image_url ? (
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
                    <CardTitle className="text-2xl">{store.name}</CardTitle>
                    <p className="text-gray-600 mt-1">Your Store</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {store.wards?.name}, {store.sub_counties?.name}, {store.counties?.name}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Active Store
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/stores/${store.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Store
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {store.description && (
              <CardContent>
                <p className="text-gray-700">{store.description}</p>
              </CardContent>
            )}
          </Card>

          {/* Store Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{products.length}</p>
                    <p className="text-gray-600">Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Store className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">Active</p>
                    <p className="text-gray-600">Store Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <Link to="/create-product" className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.phone_number && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{store.phone_number}</span>
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{store.email}</span>
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
                My Products ({products.length})
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
                  <p className="text-gray-500 mb-4">
                    Start by adding your first product to your store.
                  </p>
                  <Link to="/create-product">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </Link>
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
                      name: store.name,
                      county: store.counties?.name || ''
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

export default MyStorePage;
