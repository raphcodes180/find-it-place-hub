
import { useState, useEffect } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Package, 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  AlertCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MyStorePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [storeFormData, setStoreFormData] = useState({
    name: '',
    description: '',
    phone_number: '',
    email: '',
    county_id: '',
    sub_county_id: '',
  });

  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    unit: '',
    quantity_available: '',
  });

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Fetch user's store
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['my-store', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          counties (name),
          sub_counties (name)
        `)
        .eq('owner_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch store products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['my-products', store?.id],
    queryFn: async () => {
      if (!store) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (image_url, is_primary)
        `)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!store
  });

  // Fetch counties
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

  // Fetch sub-counties
  const { data: subCounties = [] } = useQuery({
    queryKey: ['sub-counties', storeFormData.county_id],
    queryFn: async () => {
      if (!storeFormData.county_id) return [];
      
      const { data, error } = await supabase
        .from('sub_counties')
        .select('id, name')
        .eq('county_id', parseInt(storeFormData.county_id))
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!storeFormData.county_id
  });

  // Create/Update store mutation
  const storeUpsertMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('User not authenticated');
      
      const storeData = {
        ...data,
        owner_id: user.id,
        county_id: parseInt(data.county_id),
        sub_county_id: data.sub_county_id ? parseInt(data.sub_county_id) : null,
      };

      if (store) {
        const { error } = await supabase
          .from('stores')
          .update(storeData)
          .eq('id', store.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('stores')
          .insert(storeData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: store ? "Store updated successfully" : "Store created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['my-store', user?.id] });
    },
    onError: (error) => {
      console.error('Error saving store:', error);
      toast({
        title: "Error",
        description: "Failed to save store. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Create/Update product mutation
  const productUpsertMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!store) throw new Error('Store not found');
      
      const productData = {
        ...data,
        store_id: store.id,
        county_id: store.county_id,
        sub_county_id: store.sub_county_id,
        price: parseFloat(data.price),
        quantity_available: data.quantity_available ? parseInt(data.quantity_available) : null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: editingProduct ? "Product updated successfully" : "Product added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['my-products', store?.id] });
      setShowProductForm(false);
      setEditingProduct(null);
      setProductFormData({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        price: '',
        unit: '',
        quantity_available: '',
      });
    },
    onError: (error) => {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Toggle product status mutation
  const toggleProductMutation = useMutation({
    mutationFn: async ({ productId, isActive }: { productId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !isActive })
        .eq('id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products', store?.id] });
    },
    onError: (error) => {
      console.error('Error toggling product status:', error);
      toast({
        title: "Error",
        description: "Failed to update product status.",
        variant: "destructive",
      });
    }
  });

  // Initialize store form data
  useEffect(() => {
    if (store) {
      setStoreFormData({
        name: store.name || '',
        description: store.description || '',
        phone_number: store.phone_number || '',
        email: store.email || '',
        county_id: store.county_id?.toString() || '',
        sub_county_id: store.sub_county_id?.toString() || '',
      });
    }
  }, [store]);

  const categories = [
    'crops', 'livestock', 'dairy', 'poultry', 'aquaculture',
    'horticulture', 'cereals', 'legumes', 'fruits', 'vegetables',
    'farm_equipment', 'seeds', 'fertilizers', 'pesticides'
  ];

  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storeUpsertMutation.mutate(storeFormData);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    productUpsertMutation.mutate(productFormData);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      price: product.price?.toString() || '',
      unit: product.unit || '',
      quantity_available: product.quantity_available?.toString() || '',
    });
    setShowProductForm(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to manage your store.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Store</h1>
            <p className="text-gray-600">
              Manage your agricultural store and products
            </p>
          </div>

          <Tabs defaultValue="store" className="space-y-6">
            <TabsList>
              <TabsTrigger value="store">Store Settings</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="store">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    {store ? 'Update Store' : 'Create Store'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {storeLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <form onSubmit={handleStoreSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="store_name">Store Name *</Label>
                          <Input
                            id="store_name"
                            value={storeFormData.name}
                            onChange={(e) => setStoreFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter store name"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="store_email">Email</Label>
                          <Input
                            id="store_email"
                            type="email"
                            value={storeFormData.email}
                            onChange={(e) => setStoreFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Store email"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="store_phone">Phone Number</Label>
                        <Input
                          id="store_phone"
                          value={storeFormData.phone_number}
                          onChange={(e) => setStoreFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                          placeholder="Store phone number"
                        />
                      </div>

                      <div>
                        <Label htmlFor="store_description">Description</Label>
                        <Textarea
                          id="store_description"
                          value={storeFormData.description}
                          onChange={(e) => setStoreFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your store and what you sell"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="store_county">County *</Label>
                          <Select 
                            value={storeFormData.county_id} 
                            onValueChange={(value) => setStoreFormData(prev => ({ 
                              ...prev, 
                              county_id: value,
                              sub_county_id: '' 
                            }))}
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

                        <div>
                          <Label htmlFor="store_sub_county">Sub-County</Label>
                          <Select 
                            value={storeFormData.sub_county_id} 
                            onValueChange={(value) => setStoreFormData(prev => ({ ...prev, sub_county_id: value }))}
                            disabled={!storeFormData.county_id}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sub-county" />
                            </SelectTrigger>
                            <SelectContent>
                              {subCounties.map((subCounty) => (
                                <SelectItem key={subCounty.id} value={subCounty.id.toString()}>
                                  {subCounty.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={storeUpsertMutation.isPending}
                      >
                        {storeUpsertMutation.isPending 
                          ? 'Saving...' 
                          : store ? 'Update Store' : 'Create Store'
                        }
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                  {store && (
                    <Button 
                      onClick={() => setShowProductForm(!showProductForm)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                </div>

                {!store ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please create your store first before adding products.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {/* Add/Edit Product Form */}
                    {showProductForm && (
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="product_title">Product Title *</Label>
                                <Input
                                  id="product_title"
                                  value={productFormData.title}
                                  onChange={(e) => setProductFormData(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Product name"
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="product_category">Category *</Label>
                                <Select 
                                  value={productFormData.category} 
                                  onValueChange={(value) => setProductFormData(prev => ({ ...prev, category: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map((cat) => (
                                      <SelectItem key={cat} value={cat}>
                                        {formatCategory(cat)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="product_description">Description</Label>
                              <Textarea
                                id="product_description"
                                value={productFormData.description}
                                onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Product description"
                                rows={3}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="product_price">Price (KSh) *</Label>
                                <Input
                                  id="product_price"
                                  type="number"
                                  step="0.01"
                                  value={productFormData.price}
                                  onChange={(e) => setProductFormData(prev => ({ ...prev, price: e.target.value }))}
                                  placeholder="0.00"
                                  required
                                />
                              </div>

                              <div>
                                <Label htmlFor="product_unit">Unit</Label>
                                <Input
                                  id="product_unit"
                                  value={productFormData.unit}
                                  onChange={(e) => setProductFormData(prev => ({ ...prev, unit: e.target.value }))}
                                  placeholder="kg, piece, liter"
                                />
                              </div>

                              <div>
                                <Label htmlFor="product_quantity">Quantity Available</Label>
                                <Input
                                  id="product_quantity"
                                  type="number"
                                  value={productFormData.quantity_available}
                                  onChange={(e) => setProductFormData(prev => ({ ...prev, quantity_available: e.target.value }))}
                                  placeholder="Optional"
                                />
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button 
                                type="submit" 
                                className="bg-green-600 hover:bg-green-700"
                                disabled={productUpsertMutation.isPending}
                              >
                                {productUpsertMutation.isPending 
                                  ? 'Saving...' 
                                  : editingProduct ? 'Update Product' : 'Add Product'
                                }
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => {
                                  setShowProductForm(false);
                                  setEditingProduct(null);
                                  setProductFormData({
                                    title: '',
                                    description: '',
                                    category: '',
                                    subcategory: '',
                                    price: '',
                                    unit: '',
                                    quantity_available: '',
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    )}

                    {/* Products List */}
                    {productsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <Card key={i}>
                            <CardContent className="p-6">
                              <Skeleton className="h-32 w-full mb-4" />
                              <Skeleton className="h-4 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
                        <p className="text-gray-500">Add your first product to start selling.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                          <Card key={product.id}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="secondary">
                                      {formatCategory(product.category)}
                                    </Badge>
                                    <Badge variant={product.is_active ? "default" : "secondary"}>
                                      {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                  <p className="text-2xl font-bold text-green-600 mb-2">
                                    {formatPrice(product.price)}
                                    {product.unit && (
                                      <span className="text-sm text-gray-500">/{product.unit}</span>
                                    )}
                                  </p>
                                  {product.quantity_available && (
                                    <p className="text-sm text-gray-500 mb-4">
                                      {product.quantity_available} available
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleProductMutation.mutate({
                                    productId: product.id,
                                    isActive: product.is_active
                                  })}
                                >
                                  {product.is_active ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyStorePage;
