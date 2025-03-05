
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Type definitions for database tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          password?: string;
          count: number;
          picture?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'user';
          password?: string;
          count?: number;
          picture?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'user';
          password?: string;
          count?: number;
          picture?: string;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
};

// Helper functions for authentication and database operations
export const authAPI = {
  signUp: async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: email.endsWith('@synjoint.com') ? 'admin' : 'user',
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Also create a record in the users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            name,
            role: email.endsWith('@synjoint.com') ? 'admin' : 'user',
            count: 1,
            created_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },
  
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Update the count in the users table
        const { error: updateError } = await supabase
          .from('users')
          .update({ count: supabase.rpc('increment_count', { row_id: data.user.id }) })
          .eq('id', data.user.id);
          
        if (updateError) console.error('Error updating count:', updateError);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  },
  
  signInWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  },
  
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        return { user: null, error: null };
      }
      
      // Get the user's profile from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (userError) {
        console.error('Error fetching user data:', userError);
      }
      
      return { 
        user: {
          ...session.user,
          profile: userData
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  }
};

export const contactAPI = {
  submitContactForm: async (name: string, email: string, message: string) => {
    try {
      // Create a record in the contacts table
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          name,
          email,
          message,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Send email notification using Supabase Edge Functions (this part would need a separate Edge Function implementation)
      // const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
      //   body: { name, email, message }
      // });
      // 
      // if (emailError) throw emailError;
      
      return { data, error: null };
    } catch (error) {
      console.error('Contact form submission error:', error);
      return { data: null, error };
    }
  }
};
