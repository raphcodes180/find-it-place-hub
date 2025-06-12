
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  // Handle category change to convert "all" back to empty string
  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === 'all' ? '' : value);
  };

  // Handle county change to convert "all" back to empty string
  const handleCountyChange = (value: string) => {
    onCountyChange(value === 'all' ? '' : value);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Category</label>
            <Select value={selectedCategory || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-white text-gray-900">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
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
            <label className="text-sm font-medium text-white">County</label>
            <Select value={selectedCounty || 'all'} onValueChange={handleCountyChange}>
              <SelectTrigger className="bg-white text-gray-900">
                <SelectValue placeholder="All counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All counties</SelectItem>
                {counties?.map((county) => (
                  <SelectItem key={county.id} value={county.id.toString()}>
                    {county.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              Price Range: KES {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
            </label>
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
          </div>

          {/* Clear Filters */}
          <div className="space-y-2">
            <div className="h-5"></div>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
