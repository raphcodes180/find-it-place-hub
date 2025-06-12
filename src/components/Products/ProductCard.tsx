
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Package } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  unit?: string;
  category: string;
  subcategory?: string;
  images: Array<{ image_url: string; is_primary?: boolean }>;
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
  const primaryImage = images?.find(img => img.is_primary)?.image_url || images?.[0]?.image_url;

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

  return (
    <Link to={`/products/${id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        {/* Image */}
        <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Package className="h-12 w-12" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {formatCategory(category)}
            </Badge>
            {subcategory && (
              <Badge variant="outline" className="text-xs">
                {subcategory}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="mb-3">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(price)}
            </span>
            {unit && (
              <span className="text-gray-500 text-sm ml-1">
                /{unit}
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {location.county}
              {location.sub_county && `, ${location.sub_county}`}
            </span>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0">
          {/* Store Info */}
          <div className="w-full">
            <p className="text-sm text-gray-600">
              Sold by <span className="font-medium">{store.name}</span>
            </p>
            <p className="text-xs text-gray-500">{store.county}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
