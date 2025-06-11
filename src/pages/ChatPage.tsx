
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  last_message_at: string;
  created_at: string;
  products: {
    title: string;
  };
  buyer_profile: {
    full_name: string;
    profile_picture_url?: string;
  };
  seller_profile: {
    full_name: string;
    profile_picture_url?: string;
  };
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

const ChatPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          id,
          buyer_id,
          seller_id,
          product_id,
          last_message_at,
          created_at,
          products!inner(title),
          buyer_profile:profiles!buyer_id(full_name, profile_picture_url),
          seller_profile:profiles!seller_id(full_name, profile_picture_url)
        `)
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', user?.id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: selectedChat.id,
          sender_id: user?.id,
          content: newMessage.trim(),
        });

      if (error) throw error;

      // Update chat's last_message_at
      await supabase
        .from('chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedChat.id);

      setNewMessage('');
      fetchMessages(selectedChat.id);
      fetchChats();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    if (chat.buyer_id === user?.id) {
      return {
        name: chat.seller_profile?.full_name || 'Unknown User',
        avatar: chat.seller_profile?.profile_picture_url,
      };
    } else {
      return {
        name: chat.buyer_profile?.full_name || 'Unknown User',
        avatar: chat.buyer_profile?.profile_picture_url,
      };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Please sign in to access your messages.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  chats.map((chat) => {
                    const otherParticipant = getOtherParticipant(chat);
                    return (
                      <div
                        key={chat.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherParticipant.avatar} />
                            <AvatarFallback>
                              {otherParticipant.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">
                              {otherParticipant.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {chat.products?.title}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(chat.last_message_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-2">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">
                    {getOtherParticipant(selectedChat).name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {selectedChat.products?.title}
                  </p>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 p-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${
                          message.sender_id === user?.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="h-[500px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to start messaging</p>
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
