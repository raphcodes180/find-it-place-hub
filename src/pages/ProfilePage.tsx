import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, updateUserType } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    user_type: 'buyer' as 'buyer' | 'seller',
    show_phone_number: false,
    notifications_enabled: true,
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        full_name: data?.full_name || '',
        phone_number: data?.phone_number || '',
        user_type: data?.user_type || 'buyer',
        show_phone_number: data?.show_phone_number || false,
        notifications_enabled: data?.notifications_enabled || true,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          user_type: formData.user_type,
          show_phone_number: formData.show_phone_number,
          notifications_enabled: formData.notifications_enabled,
        })
        .eq('id', user.id);

      if (error) throw error;

      // If user type changed, call the auth context update
      if (profile?.user_type !== formData.user_type) {
        await updateUserType(formData.user_type);
      }

      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      });
      
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <p>Please sign in to view your profile.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <p>Loading profile...</p>
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
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                {isEditing ? 'Edit Profile' : 'Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="user_type">Account Type</Label>
                    <Select value={formData.user_type} onValueChange={(value: 'buyer' | 'seller') => setFormData(prev => ({ ...prev, user_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show_phone_number">Show Phone Number</Label>
                    <Switch
                      id="show_phone_number"
                      checked={formData.show_phone_number}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_phone_number: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications_enabled">Notifications Enabled</Label>
                    <Switch
                      id="notifications_enabled"
                      checked={formData.notifications_enabled}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications_enabled: checked }))}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button className="ml-2" onClick={handleSave}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-gray-600">{profile?.full_name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-gray-600">{profile?.email}</p>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <p className="text-gray-600">{profile?.phone_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <p className="text-gray-600">{profile?.user_type}</p>
                  </div>
                  <div>
                    <Label>Show Phone Number</Label>
                    <p className="text-gray-600">{profile?.show_phone_number ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <Label>Notifications Enabled</Label>
                    <p className="text-gray-600">{profile?.notifications_enabled ? 'Yes' : 'No'}</p>
                  </div>
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
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
