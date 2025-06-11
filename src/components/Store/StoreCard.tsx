
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Store, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StoreCardProps {
  id: string;
  name: string;
  description?: string;
  location: {
    county: string;
    sub_county?: string;
  };
  contact: {
    phone?: string;
    email?: string;
  };
  productCount: number;
  image?: string;
  isActive: boolean;
}

export const StoreCard = ({
  id,
  name,
  description,
  location,
  contact,
  productCount,
  image,
  isActive,
}: StoreCardProps) => {
  const navigate = useNavigate();

  const handleViewStore = () => {
    navigate(`/stores/${id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Store className="h-12 w-12" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <Badge variant={isActive ? "secondary" : "outline"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">
              {location.county}
              {location.sub_county && `, ${location.sub_county}`}
            </span>
          </div>
          
          {contact.phone && (
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="h-3 w-3 mr-1" />
              <span>{contact.phone}</span>
            </div>
          )}
          
          {contact.email && (
            <div className="flex items-center text-sm text-gray-500">
              <Mail className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{contact.email}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {productCount} product{productCount !== 1 ? 's' : ''}
          </span>
          <Button 
            onClick={handleViewStore}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            View Store
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
