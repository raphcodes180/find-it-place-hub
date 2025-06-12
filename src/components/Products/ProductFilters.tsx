
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
    onPriceRangeChange([0, 50000]);
  };

  // Handle category change to convert "all" back to empty string
  const handleCategoryChange = (value: string) => {
    onCategoryChange(value === 'all' ? '' : value);
  };

  // Handle county change to convert "all" back to empty string
  const handleCountyChange = (value: string) => {
    onCountyChange(value === 'all' ? '' : value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;
    onPriceRangeChange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 50000;
    onPriceRangeChange([priceRange[0], value]);
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Category</Label>
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
            <Label className="text-sm font-medium text-white">County</Label>
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

          {/* Min Price Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Min Price (KES)</Label>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              placeholder="0"
              className="bg-white text-gray-900"
            />
          </div>

          {/* Max Price Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Max Price (KES)</Label>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              placeholder="50000"
              className="bg-white text-gray-900"
            />
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
