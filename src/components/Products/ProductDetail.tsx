
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, MessageCircle, Phone, MapPin, Store, Star } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product details with store and profile information
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          stores!inner (
            id,
            name,
            description,
            phone_number,
            show_phone_number,
            profiles!inner (
              id,
              full_name,
              profile_picture_url
            )
          ),
          counties (name),
          sub_counties (name),
          product_images (image_url, is_primary)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleContactSeller = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to contact the seller.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // Create or find existing chat
    const { data: existingChat } = await supabase
      .from('chats')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('seller_id', product?.stores?.profiles?.id)
      .eq('product_id', id)
      .single();

    if (existingChat) {
      navigate(`/chat?chat_id=${existingChat.id}`);
    } else {
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({
          buyer_id: user.id,
          seller_id: product?.stores?.profiles?.id,
          product_id: id,
        })
        .select('id')
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to start chat. Please try again.",
          variant: "destructive",
        });
        return;
      }

      navigate(`/chat?chat_id=${newChat.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.product_images || [];
  const primaryImage = images.find(img => img.is_primary) || images[0];
  const displayImages = primaryImage ? [primaryImage, ...images.filter(img => !img.is_primary)] : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              {displayImages.length > 0 ? (
                <img
                  src={displayImages[selectedImageIndex]?.image_url || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.image_url || '/placeholder.svg'}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <Badge variant="secondary">{product.category}</Badge>
                {product.subcategory && (
                  <Badge variant="outline">{product.subcategory}</Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-green-600 mb-4">
                KES {product.price?.toLocaleString()} per {product.unit}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description || 'No description available'}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {product.counties?.name}
                  {product.sub_counties?.name && `, ${product.sub_counties.name}`}
                </span>
              </div>
            </div>

            <Separator />

            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Store Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={product.stores?.profiles?.profile_picture_url} />
                    <AvatarFallback>
                      {product.stores?.profiles?.full_name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{product.stores?.name}</h4>
                    <p className="text-sm text-gray-600">
                      Owner: {product.stores?.profiles?.full_name}
                    </p>
                  </div>
                </div>

                {product.stores?.description && (
                  <p className="text-sm text-gray-700">{product.stores.description}</p>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleContactSeller} className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>

                  {product.stores?.show_phone_number && product.stores?.phone_number && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${product.stores.phone_number}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
