
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { User, Edit, Mail, Phone, MapPin, Upload, Save, X } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: 'Profile picture updated',
        description: 'Your profile picture has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    }
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
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.profile_picture_url} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700">
                  <Upload className="h-3 w-3" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
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
                {/* Non-editable display fields */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm text-gray-500">Full Name</Label>
                    <p className="text-lg font-medium">{profile?.full_name || 'Not set'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label className="text-sm text-gray-500">Email</Label>
                      <p className="text-lg">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label className="text-sm text-gray-500">Phone Number</Label>
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
                </div>

                {/* Editable fields */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="show_phone">Show phone number publicly</Label>
                    <Switch
                      id="show_phone"
                      checked={formData.show_phone_number}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, show_phone_number: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="notifications">Enable notifications</Label>
                    <Switch
                      id="notifications"
                      checked={formData.notifications_enabled}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, notifications_enabled: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    <Save className="h-4 w-4 mr-1" />
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4 mr-1" />
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
                      <Label className="text-sm text-gray-500">Email</Label>
                      <p className="text-lg">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <Label className="text-sm text-gray-500">Phone Number</Label>
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
