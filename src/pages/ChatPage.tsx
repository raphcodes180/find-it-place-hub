
import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Send, MessageCircle, AlertCircle, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat list
  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          products (title, price),
          profiles!seller_id (full_name),
          profiles!buyer_id (full_name)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch messages for selected chat
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedChatId],
    queryFn: async () => {
      if (!selectedChatId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!sender_id (full_name)
        `)
        .eq('chat_id', selectedChatId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedChatId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }: { chatId: string; content: string }) => {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user?.id,
          content: content.trim()
        });

      if (error) throw error;

      // Update chat's last_message_at
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', chatId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
      setNewMessage('');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Select first chat by default
  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  const handleSendMessage = () => {
    if (!selectedChatId || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      chatId: selectedChatId,
      content: newMessage
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (chat: any) => {
    if (chat.buyer_id === user?.id) {
      return chat.profiles; // seller profile
    } else {
      return chat.profiles; // buyer profile
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
              Please sign in to view your messages.
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {chatsLoading ? (
                <div className="space-y-4 p-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Start a conversation by contacting a seller
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {chats.map((chat) => {
                    const otherParticipant = getOtherParticipant(chat);
                    return (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedChatId === chat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {otherParticipant?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {chat.products?.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatMessageTime(chat.last_message_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedChatId ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle>
                    {(() => {
                      const selectedChat = chats.find(c => c.id === selectedChatId);
                      const otherParticipant = selectedChat ? getOtherParticipant(selectedChat) : null;
                      return otherParticipant?.full_name || 'Chat';
                    })()}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                            <Skeleton className="h-12 w-48 rounded-lg" />
                          </div>
                        ))}
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-2">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender_id === user?.id
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_id === user?.id ? 'text-green-100' : 'text-gray-500'
                              }`}
                            >
                              {formatMessageTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <Separator />

                  {/* Message Input */}
                  <div className="p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={sendMessageMutation.isPending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;
