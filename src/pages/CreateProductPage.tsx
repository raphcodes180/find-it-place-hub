import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

const CreateProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    unit: '',
    quantity_available: '',
    store_id: '',
    county_id: '',
    sub_county_id: '',
    ward_id: '',
    image_url: '',
  });

  const categories = [
    'crops', 'livestock', 'dairy', 'poultry', 'aquaculture', 
    'horticulture', 'cereals', 'legumes', 'fruits', 'vegetables',
    'farm_equipment', 'seeds', 'fertilizers', 'pesticides'
  ];

  // Fetch user's stores
  const { data: stores = [] } = useQuery({
    queryKey: ['user-stores', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch counties
  const { data: counties = [] } = useQuery({
    queryKey: ['counties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('counties')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          store_id: formData.store_id,
          title: formData.title,
          description: formData.description,
          category: formData.category as any,
          subcategory: formData.subcategory,
          price: parseFloat(formData.price),
          unit: formData.unit,
          quantity_available: parseInt(formData.quantity_available),
          county_id: parseInt(formData.county_id),
          sub_county_id: formData.sub_county_id ? parseInt(formData.sub_county_id) : null,
          ward_id: formData.ward_id ? parseInt(formData.ward_id) : null,
        })
        .select()
        .single();

      if (productError) throw productError;

      // If there's an image, save it to product_images table
      if (formData.image_url && product) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            image_url: formData.image_url,
            is_primary: true,
          });

        if (imageError) console.error('Error saving product image:', imageError);
      }

      toast({
        title: "Product Created Successfully!",
        description: "Your product has been added to your store.",
      });

      navigate('/my-store');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
            <p className="text-muted-foreground">You need to be logged in to create products.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Store Found</h1>
            <p className="text-muted-foreground mb-4">You need to create a store before adding products.</p>
            <Button onClick={() => navigate('/create-store')}>
              Create Store
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="store">Store *</Label>
                  <Select
                    value={formData.store_id}
                    onValueChange={(value) => setFormData({ ...formData, store_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ImageUpload
                  bucket="product-images"
                  label="Product Image"
                  currentImage={formData.image_url}
                  onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                />

                <div>
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      placeholder="kg, piece, liter"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity Available</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity_available}
                      onChange={(e) => setFormData({ ...formData, quantity_available: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="county">County *</Label>
                  <Select
                    value={formData.county_id}
                    onValueChange={(value) => setFormData({ ...formData, county_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map((county) => (
                        <SelectItem key={county.id} value={county.id.toString()}>
                          {county.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateProductPage;
