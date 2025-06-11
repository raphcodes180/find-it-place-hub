
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Package, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subcategory?: string;
  images: Array<{ image_url: string; is_primary: boolean }>;
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
  location,
}: ProductCardProps) => {
  const navigate = useNavigate();
  
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

  const primaryImage = images.find(img => img.is_primary) || images[0];

  const handleViewDetails = () => {
    navigate(`/products/${id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div onClick={handleViewDetails} className="cursor-pointer">
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-12 w-12" />
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-green-600 transition-colors">
              {title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {formatCategory(category)}
            </Badge>
            {subcategory && (
              <Badge variant="outline" className="text-xs">
                {subcategory}
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {description || 'No description available'}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">
                {location.county}
                {location.sub_county && `, ${location.sub_county}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-green-600">
                {formatPrice(price)}
                {unit && <span className="text-sm text-gray-500">/{unit}</span>}
              </div>
              <div className="text-xs text-gray-500">
                by {store.name}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-green-600 hover:bg-green-700"
          size="sm"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
