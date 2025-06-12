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

const CreateStorePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    county_id: '',
    sub_county_id: '',
    ward_id: '',
    phone_number: '',
    email: '',
    store_image_url: '',
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

  // Fetch sub-counties based on selected county
  const { data: subCounties = [] } = useQuery({
    queryKey: ['sub-counties', formData.county_id],
    queryFn: async () => {
      if (!formData.county_id) return [];
      const { data, error } = await supabase
        .from('sub_counties')
        .select('*')
        .eq('county_id', parseInt(formData.county_id))
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!formData.county_id,
  });

  // Fetch wards based on selected sub-county
  const { data: wards = [] } = useQuery({
    queryKey: ['wards', formData.sub_county_id],
    queryFn: async () => {
      if (!formData.sub_county_id) return [];
      const { data, error } = await supabase
        .from('wards')
        .select('*')
        .eq('sub_county_id', parseInt(formData.sub_county_id))
        .order('name');
      if (error) throw error;
      return data;
    },
    enabled: !!formData.sub_county_id,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('stores')
        .insert({
          owner_id: user.id,
          name: formData.name,
          description: formData.description,
          county_id: parseInt(formData.county_id),
          sub_county_id: formData.sub_county_id ? parseInt(formData.sub_county_id) : null,
          ward_id: formData.ward_id ? parseInt(formData.ward_id) : null,
          phone_number: formData.phone_number,
          email: formData.email,
          store_image_url: formData.store_image_url,
        });

      if (error) throw error;

      toast({
        title: "Store Created Successfully!",
        description: "Your store has been created and is now active.",
      });

      navigate('/my-store');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create store",
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
            <p className="text-muted-foreground">You need to be logged in to create a store.</p>
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
              <CardTitle>Create Your Agricultural Store</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <ImageUpload
                  bucket="store-images"
                  label="Store Image"
                  currentImage={formData.store_image_url}
                  onImageUploaded={(url) => setFormData({ ...formData, store_image_url: url })}
                />

                <div>
                  <Label htmlFor="name">Store Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Select
                      value={formData.county_id}
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        county_id: value,
                        sub_county_id: '',
                        ward_id: ''
                      })}
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
                    <Label htmlFor="sub_county">Sub County</Label>
                    <Select
                      value={formData.sub_county_id}
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        sub_county_id: value,
                        ward_id: ''
                      })}
                      disabled={!formData.county_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub county" />
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

                  <div>
                    <Label htmlFor="ward">Ward</Label>
                    <Select
                      value={formData.ward_id}
                      onValueChange={(value) => setFormData({ ...formData, ward_id: value })}
                      disabled={!formData.sub_county_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ward" />
                      </SelectTrigger>
                      <SelectContent>
                        {wards.map((ward) => (
                          <SelectItem key={ward.id} value={ward.id.toString()}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Store...
                    </>
                  ) : (
                    'Create Store'
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

export default CreateStorePage;
