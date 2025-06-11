
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle, 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Store, 
  Tag,
  Calendar,
  Package,
  MessageCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product details
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
            counties!inner (name),
            profiles!inner (full_name, phone_number, show_phone_number)
          ),
          counties!inner (name),
          sub_counties (name),
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

  const handleContactSeller = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact the seller.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!product) return;

    try {
      // Create or find existing chat
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', product.stores.profiles.id)
        .eq('product_id', product.id)
        .single();

      let chatId = existingChat?.id;

      if (!chatId) {
        const { data: newChat, error } = await supabase
          .from('chats')
          .insert({
            buyer_id: user.id,
            seller_id: product.stores.profiles.id,
            product_id: product.id
          })
          .select('id')
          .single();

        if (error) throw error;
        chatId = newChat.id;
      }

      // Send initial message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: `Hi! I'm interested in your product: ${product.title}`
        });

      if (messageError) throw messageError;

      toast({
        title: "Message sent!",
        description: "Your inquiry has been sent to the seller.",
      });

      navigate('/chat');
    } catch (error) {
      console.error('Error contacting seller:', error);
      toast({
        title: "Error",
        description: "Failed to contact seller. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message === 'No rows returned' 
              ? 'Product not found or no longer available.'
              : 'Failed to load product details. Please try again later.'
            }
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => navigate('/products')}
          className="mt-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-16" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.product_images || [];
  const primaryImage = images.find(img => img.is_primary) || images[0];
  const displayImages = primaryImage ? [primaryImage, ...images.filter(img => !img.is_primary)] : images;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {displayImages.length > 0 ? (
              <img
                src={displayImages[selectedImageIndex]?.image_url}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Package className="h-16 w-16" />
              </div>
            )}
          </div>
          
          {displayImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                    selectedImageIndex === index ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {formatCategory(product.category)}
              </Badge>
              {product.subcategory && (
                <Badge variant="outline">{product.subcategory}</Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)} 
              {product.unit && <span className="text-lg text-gray-500">/{product.unit}</span>}
            </p>
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.quantity_available && (
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2 text-gray-500" />
                <span>{product.quantity_available} available</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>Listed {new Date(product.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>
              {product.counties.name}
              {product.sub_counties && `, ${product.sub_counties.name}`}
            </span>
          </div>

          <Button 
            onClick={handleContactSeller}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Contact Seller
          </Button>
        </div>
      </div>

      {/* Seller Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Seller Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">{product.stores.name}</h4>
              {product.stores.description && (
                <p className="text-gray-600 mb-4">{product.stores.description}</p>
              )}
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{product.stores.counties.name}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {product.stores.profiles.show_phone_number && product.stores.profiles.phone_number && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{product.stores.profiles.phone_number}</span>
                </div>
              )}
              {product.stores.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{product.stores.email}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
