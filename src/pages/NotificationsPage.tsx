
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, BellOff, MessageCircle, Store, Package, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NotificationsPage = () => {
  const { user } = useAuth();

  const { data: notifications = [], isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      toast({
        title: "Notification marked as read",
      });
      
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      if (error) throw error;
      
      toast({
        title: "All notifications marked as read",
      });
      
      refetch();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'store':
        return <Store className="h-5 w-5 text-green-500" />;
      case 'product':
        return <Package className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
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
              Please sign in to view your notifications.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load notifications. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'You\'re all caught up!'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <BellOff className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications yet</h3>
              <p className="text-gray-500">When you receive notifications, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50 border-blue-200' : 'hover:shadow-md'
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {!notification.is_read && (
                              <Badge variant="default" className="bg-blue-500">
                                New
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {notification.message && (
                          <p className="text-gray-600 mb-3">
                            {notification.message}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {notification.type}
                          </Badge>
                          
                          {!notification.is_read && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;
