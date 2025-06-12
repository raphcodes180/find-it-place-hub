
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { User, Edit, Mail, Phone, MapPin } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    user_type: 'buyer' as 'buyer' | 'seller',
    county_id: '',
    sub_county_id: '',
    ward_id: '',
    show_phone_number: false,
    notifications_enabled: true,
  });

  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          counties(name),
          sub_counties(name),
          wards(name)
        `)
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch counties for dropdown
  const { data: counties = [] } = useQuery({
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

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        user_type: profile.user_type || 'buyer',
        county_id: profile.county_id?.toString() || '',
        sub_county_id: profile.sub_county_id?.toString() || '',
        ward_id: profile.ward_id?.toString() || '',
        show_phone_number: profile.show_phone_number || false,
        notifications_enabled: profile.notifications_enabled ?? true,
      });
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!user?.id) throw new Error('No user');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.profile_picture_url} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              Profile
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_type">Account Type</Label>
                  <Select 
                    value={formData.user_type} 
                    onValueChange={(value: 'buyer' | 'seller') => 
                      setFormData({ ...formData, user_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buyer</SelectItem>
                      <SelectItem value="seller">Seller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
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

                <div className="flex items-center justify-between">
                  <Label htmlFor="show_phone">Show phone number publicly</Label>
                  <Switch
                    id="show_phone"
                    checked={formData.show_phone_number}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, show_phone_number: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable notifications</Label>
                  <Switch
                    id="notifications"
                    checked={formData.notifications_enabled}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, notifications_enabled: checked })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">Full Name</Label>
                    <p className="text-lg font-medium">{profile?.full_name || 'Not set'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label className="text-sm text-gray-500">Email (cannot be changed)</Label>
                      <p className="text-lg">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label className="text-sm text-gray-500">Phone (cannot be changed)</Label>
                      <p className="text-lg">{profile?.phone_number || 'Not set'}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Account Type</Label>
                    <p className="text-lg capitalize">{profile?.user_type || 'buyer'}</p>
                  </div>

                  {profile?.counties && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <Label className="text-sm text-gray-500">Location</Label>
                        <p className="text-lg">{profile.counties.name}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm text-gray-500">Phone Visibility</Label>
                    <p className="text-lg">{profile?.show_phone_number ? 'Public' : 'Private'}</p>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">Notifications</Label>
                    <p className="text-lg">{profile?.notifications_enabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
