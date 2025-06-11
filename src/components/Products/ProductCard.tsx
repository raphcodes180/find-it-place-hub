
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subcategory?: string;
  images: { image_url: string; is_primary: boolean }[];
  store: {
    name: string;
    county: string;
  };
  location: {
    county: string;
    sub_county?: string;
  };
}

export const ProductCard = ({ 
  id, 
  title, 
  description, 
  price, 
  unit, 
  category, 
  subcategory, 
  images, 
  store, 
  location 
}: ProductCardProps) => {
  const primaryImage = images.find(img => img.is_primary)?.image_url || 
                      images[0]?.image_url || 
                      '/placeholder.svg';

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={primaryImage}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-green-100 text-green-800"
        >
          {category}
        </Badge>
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">
              KSh {price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">per {unit}</p>
          </div>
        </div>
        
        {subcategory && (
          <Badge variant="outline" className="mb-2 text-xs">
            {subcategory}
          </Badge>
        )}
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location.county}</span>
            {location.sub_county && <span>, {location.sub_county}</span>}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Star className="h-4 w-4 mr-1" />
            <span>By {store.name}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-x-2">
        <Link to={`/products/${id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <MessageCircle className="h-4 w-4 mr-1" />
          Chat
        </Button>
      </CardFooter>
    </Card>
  );
};
