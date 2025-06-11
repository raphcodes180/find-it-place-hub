
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type ProductCategory = 'crops' | 'livestock' | 'dairy' | 'poultry' | 'aquaculture' | 'horticulture' | 'cereals' | 'legumes' | 'fruits' | 'vegetables' | 'farm_equipment' | 'seeds' | 'fertilizers' | 'pesticides';

interface Filters {
  search: string;
  category: string;
  county: string;
  priceRange: { min: number; max: number };
}

export const ProductList = () => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    county: '',
    priceRange: { min: 0, max: Infinity }
  });

  // Fetch counties for filter dropdown
  const { data: counties = [] } = useQuery({
    queryKey: ['counties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('counties')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch products with filters
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`
          *,
          stores!inner (
            name,
            counties!inner (name)
          ),
          counties!inner (name),
          sub_counties (name),
          product_images (image_url, is_primary)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category as ProductCategory);
      }
      
      if (filters.county) {
        query = query.eq('county_id', parseInt(filters.county));
      }
      
      if (filters.priceRange.min > 0) {
        query = query.gte('price', filters.priceRange.min);
      }
      
      if (filters.priceRange.max < Infinity) {
        query = query.lte('price', filters.priceRange.max);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <ProductFilters 
          onFiltersChange={setFilters}
          counties={counties}
        />
      </div>
      
      <div className="lg:col-span-3">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description || ''}
                price={product.price || 0}
                unit={product.unit || 'piece'}
                category={product.category}
                subcategory={product.subcategory}
                images={product.product_images || []}
                store={{
                  name: product.stores.name,
                  county: product.stores.counties.name
                }}
                location={{
                  county: product.counties.name,
                  sub_county: product.sub_counties?.name
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
