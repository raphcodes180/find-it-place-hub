
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

const categories = [
  { value: 'crops', label: 'Crops' },
  { value: 'livestock', label: 'Livestock' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'poultry', label: 'Poultry' },
  { value: 'aquaculture', label: 'Aquaculture' },
  { value: 'horticulture', label: 'Horticulture' },
  { value: 'cereals', label: 'Cereals' },
  { value: 'legumes', label: 'Legumes' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'farm_equipment', label: 'Farm Equipment' },
  { value: 'seeds', label: 'Seeds' },
  { value: 'fertilizers', label: 'Fertilizers' },
  { value: 'pesticides', label: 'Pesticides' },
];

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCounty: string;
  onCountyChange: (county: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export const ProductFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedCounty,
  onCountyChange,
  priceRange,
  onPriceRangeChange,
}: ProductFiltersProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch counties
  const { data: counties } = useQuery({
    queryKey: ['counties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('counties')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const clearFilters = () => {
    onCategoryChange('');
    onCountyChange('');
    onPriceRangeChange([0, 10000]);
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Filters</span>
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </CardTitle>
      </CardHeader>

      <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
        <CollapsibleContent className="lg:block">
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* County Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">County</label>
              <Select value={selectedCounty} onValueChange={onCountyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All counties</SelectItem>
                  {counties?.map((county) => (
                    <SelectItem key={county.id} value={county.id.toString()}>
                      {county.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Price Range (KES)</label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                  max={10000}
                  min={0}
                  step={100}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>KES {priceRange[0].toLocaleString()}</span>
                <span>KES {priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
