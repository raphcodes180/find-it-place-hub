
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ProductCategory = 'crops' | 'livestock' | 'dairy' | 'poultry' | 'aquaculture' | 'horticulture' | 'cereals' | 'legumes' | 'fruits' | 'vegetables' | 'farm_equipment' | 'seeds' | 'fertilizers' | 'pesticides';

const categories = [
  'crops', 'livestock', 'dairy', 'poultry', 'aquaculture',
  'horticulture', 'cereals', 'legumes', 'fruits', 'vegetables',
  'farm_equipment', 'seeds', 'fertilizers', 'pesticides'
];

interface Filters {
  search: string;
  category: string;
  county: string;
  priceRange: { min: number; max: number };
}

const ITEMS_PER_PAGE = 12;

export const ProductList = () => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    county: 'all',
    priceRange: { min: 0, max: Infinity }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [localCategory, setLocalCategory] = useState('all');
  const [localCounty, setLocalCounty] = useState('all');
  const [localMinPrice, setLocalMinPrice] = useState('');
  const [localMaxPrice, setLocalMaxPrice] = useState('');

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

  // Fetch total count of products
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['products-count', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category as ProductCategory);
      }
      
      if (filters.county && filters.county !== 'all') {
        query = query.eq('county_id', parseInt(filters.county));
      }
      
      if (filters.priceRange.min > 0) {
        query = query.gte('price', filters.priceRange.min);
      }
      
      if (filters.priceRange.max < Infinity) {
        query = query.lte('price', filters.priceRange.max);
      }

      const { count, error } = await query;
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch products with pagination
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', filters, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

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
        .eq('is_active', true)
        .range(from, to);

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category as ProductCategory);
      }
      
      if (filters.county && filters.county !== 'all') {
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

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleApplyFilters = () => {
    setFilters({
      search: localSearch,
      category: localCategory,
      county: localCounty,
      priceRange: {
        min: localMinPrice ? parseInt(localMinPrice) : 0,
        max: localMaxPrice ? parseInt(localMaxPrice) : Infinity
      }
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    setLocalCategory('all');
    setLocalCounty('all');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setFilters({
      search: '',
      category: 'all',
      county: 'all',
      priceRange: { min: 0, max: Infinity }
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10 h-12 text-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
        />
      </div>

      {/* Collapsible Filters */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </div>
            {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={localCategory} onValueChange={setLocalCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="county">County</Label>
              <Select value={localCounty} onValueChange={setLocalCounty}>
                <SelectTrigger>
                  <SelectValue placeholder="All counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All counties</SelectItem>
                  {counties.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Min Price (KSh)</Label>
              <Input
                placeholder="Min price"
                type="number"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
              />
            </div>

            <div>
              <Label>Max Price (KSh)</Label>
              <Input
                placeholder="Max price"
                type="number"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleApplyFilters} className="flex-1 bg-green-600 hover:bg-green-700">
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {products.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} products
        </span>
        {totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {currentPage > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 4 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}

              {generatePageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
