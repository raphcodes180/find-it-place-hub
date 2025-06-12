
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string, userType: 'buyer' | 'seller' ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserType: (userType: 'buyer' | 'seller') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string, userType: 'buyer' | 'seller' ) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      console.log('Signing up with redirect URL:', redirectUrl);
      console.log(userType)

    //    // Create profile record
    // if (data.user) {
    //   const { error: profileError } = await supabase
    //     .from('profiles')
    //     .insert({
    //       id: data.user.id,
    //       full_name: fullName,
    //       phone_number: phoneNumber,
    //       user_type: userType
    //     });
    //   if (profileError) throw profileError;
    // }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone_number: phoneNumber,
            user_type: userType,  
          },
        },
      });

  
      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

    

      console.log('Signup successful:', data);
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account before signing in.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      console.log('Sign in successful:', data.user?.email);
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in failed:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const updateUserType = async (userType: 'buyer' | 'seller') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Failed to update user type",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "User type updated",
        description: `Your account type has been changed to ${userType}.`,
      });
    } catch (error: any) {
      console.error('Update user type failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateUserType,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
