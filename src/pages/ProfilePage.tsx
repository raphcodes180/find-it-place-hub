
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Phone, Mail, MapPin, Settings, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    county_id: '',
    sub_county_id: '',
    show_phone_number: false,
    notifications_enabled: true,
    user_type: 'buyer'
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
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

  // Fetch sub-counties based on selected county
  const { data: subCounties = [] } = useQuery({
    queryKey: ['sub-counties', formData.county_id],
    queryFn: async () => {
      if (!formData.county_id) return [];
      
      const { data, error } = await supabase
        .from('sub_counties')
        .select('id, name')
        .eq('county_id', parseInt(formData.county_id))
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!formData.county_id
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        county_id: profile.county_id?.toString() || '',
        sub_county_id: profile.sub_county_id?.toString() || '',
        show_phone_number: profile.show_phone_number || false,
        notifications_enabled: profile.notifications_enabled !== false,
        user_type: profile.user_type || 'buyer'
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData = {
      ...formData,
      county_id: formData.county_id ? parseInt(formData.county_id) : null,
      sub_county_id: formData.sub_county_id ? parseInt(formData.sub_county_id) : null,
    };

    updateProfileMutation.mutate(updateData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset sub-county when county changes
    if (field === 'county_id') {
      setFormData(prev => ({
        ...prev,
        sub_county_id: ''
      }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to view your profile.
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="user_type">Account Type</Label>
                    <Select 
                      value={formData.user_type} 
                      onValueChange={(value) => handleInputChange('user_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="both">Both Buyer & Seller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="county">County</Label>
                      <Select 
                        value={formData.county_id} 
                        onValueChange={(value) => handleInputChange('county_id', value)}
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
                      <Label htmlFor="sub_county">Sub-County</Label>
                      <Select 
                        value={formData.sub_county_id} 
                        onValueChange={(value) => handleInputChange('sub_county_id', value)}
                        disabled={!formData.county_id}
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Phone Number</Label>
                        <p className="text-sm text-gray-500">
                          Allow other users to see your phone number
                        </p>
                      </div>
                      <Switch
                        checked={formData.show_phone_number}
                        onCheckedChange={(checked) => handleInputChange('show_phone_number', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications about messages and updates
                        </p>
                      </div>
                      <Switch
                        checked={formData.notifications_enabled}
                        onCheckedChange={(checked) => handleInputChange('notifications_enabled', checked)}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
