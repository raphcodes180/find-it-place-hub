
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, MapPin, Store, Phone, Mail, MessageCircle, AlertCircle } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          stores!inner (
            id,
            name,
            description,
            phone_number,
            email,
            store_image_url,
            counties!inner (name)
          ),
          counties!inner (name),
          sub_counties (name),
          wards (name),
          product_images (image_url, is_primary)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Product not found or failed to load. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || 
                      product.product_images?.[0]?.image_url || 
                      '/placeholder.svg';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.product_images && product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.product_images.slice(0, 4).map((image: any, index: number) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {product.category}
                </Badge>
                {product.subcategory && (
                  <Badge variant="outline">{product.subcategory}</Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-green-600 mb-4">
                KSh {product.price?.toLocaleString()} 
                <span className="text-lg text-gray-500 ml-2">per {product.unit}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Location</h3>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>
                  {product.wards?.name && `${product.wards.name}, `}
                  {product.sub_counties?.name && `${product.sub_counties.name}, `}
                  {product.counties.name}
                </span>
              </div>
            </div>

            {product.quantity_available && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Availability</h3>
                <p className="text-gray-600">{product.quantity_available} {product.unit}s available</p>
              </div>
            )}

            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Seller
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-xl mb-4 flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Store Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                {product.stores.store_image_url ? (
                  <img
                    src={product.stores.store_image_url}
                    alt={product.stores.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Store className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-lg">{product.stores.name}</h4>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.stores.counties.name}
                  </p>
                  {product.stores.description && (
                    <p className="text-gray-600 mt-2 text-sm">{product.stores.description}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {product.stores.phone_number && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{product.stores.phone_number}</span>
                  </div>
                )}
                {product.stores.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{product.stores.email}</span>
                  </div>
                )}
                <Link to={`/stores/${product.stores.id}`}>
                  <Button variant="outline" className="mt-4">
                    View Store Profile
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
