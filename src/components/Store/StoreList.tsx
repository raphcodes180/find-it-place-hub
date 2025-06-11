
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StoreCard } from './StoreCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search } from 'lucide-react';

export const StoreList = () => {
  const [search, setSearch] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('all');

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

  // Fetch stores with product count
  const { data: stores = [], isLoading, error } = useQuery({
    queryKey: ['stores', search, selectedCounty],
    queryFn: async () => {
      let query = supabase
        .from('stores')
        .select(`
          *,
          counties!inner (name),
          sub_counties (name),
          products (id)
        `)
        .eq('is_active', true);

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      if (selectedCounty && selectedCounty !== 'all') {
        query = query.eq('county_id', parseInt(selectedCounty));
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
          Failed to load stores. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="search">Search Stores</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="county">County</Label>
          <Select value={selectedCounty} onValueChange={setSelectedCounty}>
            <SelectTrigger>
              <SelectValue placeholder="All counties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All counties</SelectItem>
              {counties.map((county) => (
                <SelectItem key={county.id} value={county.id.toString()}>
                  {county.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stores Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No stores found matching your criteria.</p>
          <p className="text-gray-400 mt-2">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store: any) => (
            <StoreCard
              key={store.id}
              id={store.id}
              name={store.name}
              description={store.description}
              location={{
                county: store.counties.name,
                sub_county: store.sub_counties?.name
              }}
              contact={{
                phone: store.phone_number,
                email: store.email
              }}
              productCount={store.products?.length || 0}
              image={store.store_image_url}
              isActive={store.is_active}
            />
          ))}
        </div>
      )}
    </div>
  );
};
